"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getWriteClient } from "@/lib/sanity/client";
import { checkRateLimit, hashIp } from "@/lib/leads/rateLimit";

/**
 * Public review submission.
 *
 * Reviews land in Sanity with `approved: false` and are invisible on the site
 * until someone ticks the box in Studio. The submitter's contact details are
 * stored alongside so the team can confirm the person is a real client before
 * publishing, which is the whole point of collecting them this way.
 */

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  quote: z
    .string()
    .trim()
    .min(30, "Please write a little more, at least a sentence or two.")
    .max(1500),
  rating: z.coerce.number().int().min(1).max(5),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  region: z.string().trim().max(60).optional().or(z.literal("")),
  market: z.string().trim().max(60).optional().or(z.literal("")),
  email: z.string().trim().email("That email doesn't look right.").max(254),
  phone: z.string().trim().max(24).optional().or(z.literal("")),
  companyWebsite: z.string().max(120).optional().or(z.literal("")),
  consent: z.string().optional(),
});

export type ReviewResult =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitReview(formData: FormData): Promise<ReviewResult> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const r = parsed.data;

  // Honeypot: only a bot fills a field positioned off-screen.
  if (r.companyWebsite) {
    return { ok: true, message: "Thank you, your review has been received." };
  }

  if (!r.consent) {
    return {
      ok: false,
      error: "Please confirm you're happy for us to publish this.",
      fieldErrors: { consent: "Required." },
    };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = await hashIp(ip);

  const limit = await checkRateLimit(`review:${ipHash}`, {
    limit: 2,
    windowSeconds: 86400,
  });
  if (!limit.allowed) {
    return { ok: false, error: "You've already submitted a review recently. Thank you." };
  }

  try {
    await getWriteClient().create({
      _type: "testimonial",
      quote: r.quote,
      name: r.name,
      role: r.role || undefined,
      region: r.region || undefined,
      market: r.market || undefined,
      rating: r.rating,
      // The two flags that keep this honest: not approved, not illustrative.
      approved: false,
      illustrative: false,
      submittedEmail: r.email,
      submittedPhone: r.phone || undefined,
      order: 50,
    });

    return {
      ok: true,
      message:
        "Thank you. We read every review, verify it against our records, and publish it once confirmed.",
    };
  } catch (err) {
    console.error("[submitReview]", err);
    return {
      ok: false,
      error: "Something went wrong on our side. Please try again, or send it to us on WhatsApp.",
    };
  }
}
