"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { serverEnv, turnstileEnabled } from "@/lib/env";
import { checkRateLimit, hashIp } from "./rateLimit";
import { sendLeadEmails } from "./email";
import { leadSchema, type LeadResult } from "./validation";

/** A human takes at least this long to read and fill a form. */
const MIN_FILL_MS = 2500;

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: serverEnv.turnstileSecret,
          response: token,
          remoteip: ip,
        }),
      }
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Cloudflare being down shouldn't cost us a genuine lead; the honeypot,
    // timing check and rate limiter still apply.
    return true;
  }
}

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const lead = parsed.data;

  // 1 — Honeypot. Only a bot fills a field positioned off-screen.
  //     Return success so the bot has nothing to learn from the response.
  if (lead.companyWebsite) {
    return { ok: true, message: "Thank you — we'll be in touch." };
  }

  // 2 — Timing. Sub-2.5s means a script, not a person.
  if (lead.renderedAt) {
    const elapsed = Date.now() - Number(lead.renderedAt);
    if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
      return { ok: true, message: "Thank you — we'll be in touch." };
    }
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const ipHash = await hashIp(ip);

  // 3 — Turnstile, when configured.
  if (!(await verifyTurnstile(lead.turnstileToken || "", ip))) {
    return { ok: false, error: "Verification failed. Please try again." };
  }

  // 4 — Rate limits: burst and sustained, per IP; plus a per-phone cap so one
  //     person hammering refresh doesn't create twenty duplicate rows.
  const [burst, sustained, byPhone] = await Promise.all([
    checkRateLimit(`ip:${ipHash}:m`, { limit: 3, windowSeconds: 60 }),
    checkRateLimit(`ip:${ipHash}:d`, { limit: 25, windowSeconds: 86400 }),
    checkRateLimit(`ph:${lead.phone.replace(/\D/g, "")}`, { limit: 5, windowSeconds: 3600 }),
  ]);

  if (!burst.allowed || !sustained.allowed || !byPhone.allowed) {
    return {
      ok: false,
      error: "You've sent several enquiries already. Please call us instead — we'd rather talk.",
    };
  }

  try {
    const [row] = await db
      .insert(leads)
      .values({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || null,
        message: lead.message || null,
        budget: lead.budget || null,
        propertyId: lead.propertyId || null,
        propertyName: lead.propertyName || null,
        propertySlug: lead.propertySlug || null,
        formType: lead.formType,
        sourcePage: lead.sourcePage || null,
        referrer: lead.referrer || null,
        utmSource: lead.utmSource || null,
        utmMedium: lead.utmMedium || null,
        utmCampaign: lead.utmCampaign || null,
        utmTerm: lead.utmTerm || null,
        utmContent: lead.utmContent || null,
        ipHash,
        userAgent: h.get("user-agent")?.slice(0, 400) || null,
      })
      .returning({ id: leads.id });

    // Email is best-effort and must not gate the response — the enquiry is
    // already durable at this point.
    await sendLeadEmails(lead, row.id);

    return {
      ok: true,
      message: "Consider it heard. Your shortlist is on its way within 48 hours.",
    };
  } catch (err) {
    console.error("[submitLead] failed to save lead", err);
    return {
      ok: false,
      error:
        "Something went wrong on our side. Please call or WhatsApp us — we don't want to lose your enquiry.",
    };
  }
}
