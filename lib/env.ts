/**
 * Central, typed access to environment configuration.
 *
 * Rule: anything read here must either have a safe default or throw loudly at
 * module load. Silent `undefined` leaking into a query string is how you get a
 * site that builds fine and 404s in production.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        `Add it to .env.local locally and to Vercel → Settings → Environment Variables.`
    );
  }
  return value;
}

/** Public — safe to inline into the client bundle. */
export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);
export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET
);
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/**
 * `preview` keeps the whole site noindex and shows "illustrative content"
 * markers. Flip to `live` in Vercel once real inventory + RERA number are in.
 */
export const launchMode: "preview" | "live" =
  process.env.NEXT_PUBLIC_LAUNCH_MODE === "live" ? "live" : "preview";

export const isLive = launchMode === "live";

/** Turnstile is optional — when unset, forms fall back to honeypot + rate limit. */
export const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

/** Business contact details. Empty string means "not supplied yet" — the UI
 *  renders a visible TBC marker rather than inventing a number. */
export const contact = {
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  rera: process.env.NEXT_PUBLIC_RERA_NUMBER || "",
};

/* ------------------------------------------------------------------ */
/* Server-only. Importing these from a client component is a build error. */
/* ------------------------------------------------------------------ */

export const serverEnv = {
  get sanityReadToken() {
    return process.env.SANITY_API_READ_TOKEN || "";
  },
  get sanityWriteToken() {
    return required("SANITY_API_WRITE_TOKEN", process.env.SANITY_API_WRITE_TOKEN);
  },
  get revalidateSecret() {
    return process.env.SANITY_REVALIDATE_SECRET || "";
  },
  get databaseUrl() {
    return required("DATABASE_URL", process.env.DATABASE_URL);
  },
  get resendApiKey() {
    return process.env.RESEND_API_KEY || "";
  },
  get leadFrom() {
    return process.env.LEAD_FROM_EMAIL || "Roar Realty <onboarding@resend.dev>";
  },
  get leadNotify() {
    return process.env.LEAD_NOTIFY_EMAIL || "";
  },
  get turnstileSecret() {
    return process.env.TURNSTILE_SECRET_KEY || "";
  },
  get leadsAdminPassword() {
    return process.env.LEADS_ADMIN_PASSWORD || "";
  },
};

/** Turnstile is only enforced when BOTH halves of the keypair exist. */
export function turnstileEnabled(): boolean {
  return Boolean(turnstileSiteKey && serverEnv.turnstileSecret);
}
