import "server-only";

import { Resend } from "resend";
import { serverEnv, siteUrl } from "@/lib/env";
import type { LeadInput } from "./validation";

const FORM_LABELS: Record<string, string> = {
  enquiry: "Property enquiry",
  "glass-file": "Glass File request",
  "site-visit": "Site visit request",
  brochure: "Brochure download",
  "exit-intent": "Market report request",
  contact: "Contact form",
  shortlist: "Shortlist enquiry",
};

function esc(s: string | undefined | null): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Fires both emails. Deliberately never throws: the lead is already safely in
 * Postgres by the time this runs, so an email outage must not surface to the
 * buyer as a failed submission.
 */
export async function sendLeadEmails(lead: LeadInput, leadId: number): Promise<void> {
  const apiKey = serverEnv.resendApiKey;
  const notify = serverEnv.leadNotify;
  if (!apiKey || !notify) return;

  const resend = new Resend(apiKey);
  const label = FORM_LABELS[lead.formType] || "Enquiry";
  const waLink = `https://wa.me/${lead.phone.replace(/\D/g, "")}`;

  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email || undefined],
    ["Budget", lead.budget || undefined],
    ["Property", lead.propertyName || undefined],
    ["Form", label],
    ["Page", lead.sourcePage || undefined],
    ["Campaign", lead.utmSource ? `${lead.utmSource} / ${lead.utmCampaign || "—"}` : undefined],
  ];

  const tableRows = rows
    .filter(([, v]) => Boolean(v))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#8a8a8a;font-size:13px;white-space:nowrap">${esc(k)}</td>` +
        `<td style="padding:6px 0;color:#111;font-size:14px">${esc(v)}</td></tr>`
    )
    .join("");

  await Promise.allSettled([
    // 1 — internal alert
    resend.emails.send({
      from: serverEnv.leadFrom,
      to: notify.split(",").map((s) => s.trim()).filter(Boolean),
      replyTo: lead.email || undefined,
      subject: `${label}: ${lead.name}${lead.propertyName ? ` — ${lead.propertyName}` : ""}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px">
          <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C6A15B;margin:0 0 6px">
            Roar Realty · new lead #${leadId}
          </p>
          <h2 style="margin:0 0 18px;font-size:20px;color:#111">${esc(lead.name)}</h2>
          <table style="border-collapse:collapse;margin-bottom:18px">${tableRows}</table>
          ${
            lead.message
              ? `<div style="border-left:3px solid #C6A15B;padding:10px 0 10px 14px;margin-bottom:18px">
                   <div style="font-size:12px;color:#8a8a8a;margin-bottom:4px">What they said</div>
                   <div style="font-size:14px;color:#111;line-height:1.6;white-space:pre-wrap">${esc(lead.message)}</div>
                 </div>`
              : ""
          }
          <p style="margin:0 0 20px">
            <a href="tel:${esc(lead.phone)}" style="display:inline-block;padding:9px 16px;background:#111;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;margin-right:6px">Call</a>
            <a href="${esc(waLink)}" style="display:inline-block;padding:9px 16px;background:#25D366;color:#fff;text-decoration:none;border-radius:4px;font-size:13px">WhatsApp</a>
          </p>
          <p style="font-size:12px;color:#aaa;margin:0">
            Full inbox: <a href="${siteUrl}/studio/leads" style="color:#aaa">${siteUrl}/studio</a>
          </p>
        </div>`,
    }),

    // 2 — auto-reply, in the brand's own voice from the prototype
    lead.email
      ? resend.emails.send({
          from: serverEnv.leadFrom,
          to: lead.email,
          subject: "Consider it heard — Roar Realty",
          html: `
            <div style="font-family:Georgia,serif;max-width:520px;color:#111">
              <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#9a7b3c;margin:0 0 20px">
                Roar Realty
              </p>
              <p style="font-size:26px;font-style:italic;color:#9a7b3c;margin:0 0 20px">Consider it heard.</p>
              <p style="font-size:15px;line-height:1.75">Dear ${esc(lead.name.split(" ")[0])},</p>
              <p style="font-size:15px;line-height:1.75">
                Your brief is with our Gurugram desk.${
                  lead.propertyName
                    ? ` We've noted your interest in <strong>${esc(lead.propertyName)}</strong>.`
                    : ""
                }
                Expect a curated shortlist — each listing with its complete Glass File — within 48 hours.
              </p>
              <p style="font-size:15px;line-height:1.75">
                No obligation, and no follow-up calls you didn't ask for. Your details are never
                sold or shared. That's rule zero.
              </p>
              <p style="font-size:15px;line-height:1.75;margin-top:28px">— The team at Roar Realty</p>
              <hr style="border:none;border-top:1px solid #e5e0d5;margin:28px 0">
              <p style="font-family:sans-serif;font-size:11px;color:#999;line-height:1.6">
                You're receiving this because you submitted an enquiry at
                <a href="${siteUrl}" style="color:#999">roarrealty.in</a>.
              </p>
            </div>`,
        })
      : Promise.resolve(),
  ]);
}
