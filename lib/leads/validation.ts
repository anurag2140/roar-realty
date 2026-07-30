import { z } from "zod";

/**
 * Indian mobile numbers, with or without +91 / 0 prefixes, and tolerant of
 * spaces and hyphens people actually type. Also accepts other international
 * numbers, since a good share of buyers are NRIs dialling from the Gulf.
 */
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number.")
  .max(20, "That number looks too long.")
  .refine((v) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) return false;
    // If it looks Indian, enforce the 6–9 leading-digit rule.
    const local = digits.replace(/^(91|0)/, "");
    if (digits.length === 10 || (digits.startsWith("91") && digits.length === 12)) {
      return /^[6-9]\d{9}$/.test(local);
    }
    return true;
  }, "Please enter a valid phone number.");

export const FORM_TYPES = [
  "enquiry",
  "glass-file",
  "site-visit",
  "brochure",
  "exit-intent",
  "contact",
  "shortlist",
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(160, "That name is too long."),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .max(254)
    .email("That email doesn't look right.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(3000, "Please keep it under 3000 characters.").optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),

  propertyId: z.string().trim().max(64).optional().or(z.literal("")),
  propertyName: z.string().trim().max(240).optional().or(z.literal("")),
  propertySlug: z.string().trim().max(240).optional().or(z.literal("")),

  formType: z.enum(FORM_TYPES).default("enquiry"),
  sourcePage: z.string().trim().max(500).optional().or(z.literal("")),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),

  utmSource: z.string().trim().max(120).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(120).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(160).optional().or(z.literal("")),
  utmTerm: z.string().trim().max(160).optional().or(z.literal("")),
  utmContent: z.string().trim().max(160).optional().or(z.literal("")),

  // Anti-spam. Neither is ever shown to a human.
  companyWebsite: z.string().max(200).optional().or(z.literal("")),
  renderedAt: z.string().optional().or(z.literal("")),
  turnstileToken: z.string().optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadResult =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
