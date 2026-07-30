import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Customer enquiries.
 *
 * This lives in Neon rather than Sanity because Sanity's free plan only offers
 * public-read datasets — publishing buyers' names and phone numbers to an
 * unauthenticated endpoint would be a DPDP Act problem, not just untidy.
 */
export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    email: varchar("email", { length: 254 }),
    message: text("message"),
    budget: varchar("budget", { length: 80 }),

    // Denormalised on purpose: if a listing is deleted from the CMS we still
    // want to know what the person was asking about.
    propertyId: varchar("property_id", { length: 64 }),
    propertyName: varchar("property_name", { length: 240 }),
    propertySlug: varchar("property_slug", { length: 240 }),

    /** enquiry | glass-file | site-visit | brochure | exit-intent | contact | shortlist */
    formType: varchar("form_type", { length: 32 }).notNull().default("enquiry"),
    sourcePage: varchar("source_page", { length: 500 }),
    referrer: varchar("referrer", { length: 500 }),

    utmSource: varchar("utm_source", { length: 120 }),
    utmMedium: varchar("utm_medium", { length: 120 }),
    utmCampaign: varchar("utm_campaign", { length: 160 }),
    utmTerm: varchar("utm_term", { length: 160 }),
    utmContent: varchar("utm_content", { length: 160 }),

    /** Salted SHA-256, never the raw IP — we only need it for abuse control. */
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 400 }),

    status: varchar("status", { length: 16 }).notNull().default("new"),
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt),
    index("leads_status_idx").on(t.status),
    index("leads_phone_idx").on(t.phone),
  ]
);

/**
 * Rate-limit counters.
 *
 * Upstash Redis would be the natural home, but the user hasn't provisioned it
 * and Postgres can carry this load comfortably at brochure-site volumes. One
 * row per (key, window); old windows are swept on write.
 */
export const rateLimits = pgTable(
  "rate_limits",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 200 }).notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(1),
  },
  // Must be UNIQUE: the limiter relies on ON CONFLICT DO NOTHING to detect an
  // existing window. With a plain index there is never a conflict, every
  // request inserts a fresh row with count 1, and the limit never trips.
  (t) => [uniqueIndex("rate_limits_key_window_idx").on(t.key, t.windowStart)]
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
