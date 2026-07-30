/**
 * Seeds Sanity with the approved prototype's content.
 *
 * Safe to re-run: every document uses a deterministic `_id` and
 * `createIfNotExists`, so existing edits are never overwritten. Pass
 * `--force` to overwrite them deliberately.
 *
 *   npm run seed
 *   npm run seed -- --force
 */

import { createClient } from "@sanity/client";
import {
  DEFAULT_FAQS,
  DEFAULT_HOMEPAGE,
  DEFAULT_PROPERTIES,
  DEFAULT_TESTIMONIALS,
} from "../lib/content/defaults";

const force = process.argv.includes("--force");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.\n" +
      "Run with: npm run seed"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

/** Stable, human-readable ids so re-runs update rather than duplicate. */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const withKeys = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ ...item, _key: `${prefix}-${i}` }));

async function upsert(doc: { _id: string; _type: string; [k: string]: unknown }) {
  if (force) {
    await client.createOrReplace(doc);
    return "replaced";
  }
  await client.createIfNotExists(doc);
  return "ensured";
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset}${force ? " (force)" : ""}…\n`);

  /* ---- Localities (referenced by properties, so these go first) ---- */
  const localities = Array.from(
    new Map(
      DEFAULT_PROPERTIES.map((p) => [
        `${p.city}|${p.locality}`,
        { city: p.city, locality: p.locality },
      ])
    ).values()
  );

  const localityIdBy = new Map<string, string>();
  for (const l of localities) {
    const id = `locality-${slugify(l.city)}-${slugify(l.locality)}`;
    localityIdBy.set(`${l.city}|${l.locality}`, id);
    await upsert({
      _id: id,
      _type: "locality",
      name: l.locality,
      slug: { _type: "slug", current: slugify(l.locality) },
      city: l.city,
      citySlug: { _type: "slug", current: slugify(l.city) },
      blurb: `${l.locality}, ${l.city} — every listing here carries a complete Glass File before it reaches this page.`,
    });
  }
  console.log(`✓ ${localities.length} localities`);

  /* ---- Properties ---- */
  for (const p of DEFAULT_PROPERTIES) {
    await upsert({
      _id: `property-${slugify(p.name)}`,
      _type: "property",
      name: p.name,
      slug: { _type: "slug", current: slugify(p.name) },
      propertyType: p.propertyType,
      tag: p.tag,
      priceCr: p.priceCr,
      city: p.city,
      citySlug: { _type: "slug", current: slugify(p.city) },
      locality: {
        _type: "reference",
        _ref: localityIdBy.get(`${p.city}|${p.locality}`),
      },
      bedrooms: p.bedrooms,
      carpetArea: p.carpetArea,
      plotArea: p.plotArea,
      areaUnit: p.areaUnit || "sq ft",
      possessionStatus: p.possessionStatus,
      possessionDate: p.possessionDate,
      escrowProtected: Boolean(p.escrowProtected),
      featured: Boolean(p.featured),
      // Every seeded listing is flagged, so nothing invented can quietly go
      // live looking like real inventory.
      illustrative: true,
      summary: `${p.name} in ${p.locality}, ${p.city}. Illustrative sample listing — replace with real inventory before launch.`,
      glassFile: {
        titleChainYears: 30,
        litigationScan: true,
        encumbranceChecked: true,
        duesCleared: true,
        builderRecordChecked: true,
        reraVerified: false,
      },
      publishedAt: new Date().toISOString(),
    });
  }
  console.log(`✓ ${DEFAULT_PROPERTIES.length} properties (all marked illustrative)`);

  /* ---- Testimonials ---- */
  for (const [i, t] of DEFAULT_TESTIMONIALS.entries()) {
    await upsert({
      _id: `testimonial-${slugify(t.name)}`,
      _type: "testimonial",
      quote: t.quote,
      name: t.name,
      role: t.role,
      illustrative: true,
      order: i + 1,
    });
  }
  console.log(`✓ ${DEFAULT_TESTIMONIALS.length} testimonials (all marked illustrative)`);

  /* ---- FAQs ---- */
  for (const f of DEFAULT_FAQS) {
    await upsert({
      _id: `faq-${slugify(f.question).slice(0, 60)}`,
      _type: "faq",
      question: f.question,
      answer: f.answer,
      category: f.category,
      order: f.order,
    });
  }
  console.log(`✓ ${DEFAULT_FAQS.length} FAQs`);

  /* ---- Homepage ---- */
  const d = DEFAULT_HOMEPAGE;
  await upsert({
    _id: "homepage",
    _type: "homepage",
    heroEyebrow: d.heroEyebrow,
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroBody: d.heroBody,
    heroStats: withKeys(d.heroStats, "stat"),
    marqueeItems: d.marqueeItems,
    chapter1Label: d.chapter1Label,
    chapter1Heading: d.chapter1Heading,
    chapter1Body: d.chapter1Body,
    chapter1Cards: withKeys(d.chapter1Cards, "c1"),
    chapter2Label: d.chapter2Label,
    chapter2Heading: d.chapter2Heading,
    chapter2Body: d.chapter2Body,
    chapter2Stats: withKeys(d.chapter2Stats, "c2stat"),
    chapter2Quote: d.chapter2Quote,
    chapter2QuoteAttrib: d.chapter2QuoteAttrib,
    standardLabel: d.standardLabel,
    standardHeading: d.standardHeading,
    standardBody: d.standardBody,
    pillars: withKeys(d.pillars, "pillar"),
    processEyebrow: d.processEyebrow,
    processHeading: d.processHeading,
    steps: withKeys(d.steps, "step"),
    portfolioEyebrow: d.portfolioEyebrow,
    portfolioHeading: d.portfolioHeading,
    portfolioBody: d.portfolioBody,
    compareEyebrow: d.compareEyebrow,
    compareHeading: d.compareHeading,
    compareRows: withKeys(d.compareRows, "cmp"),
    contactEyebrow: d.contactEyebrow,
    contactHeading: d.contactHeading,
    contactBody: d.contactBody,
  });
  console.log("✓ homepage");

  /* ---- Site settings ----
     Contact fields are deliberately left empty. The prototype's placeholders
     (+91 98100 00000, HRERA-GGM-XXXX-2026) were invented, and a fake phone
     number that looks real is more dangerous than a visible gap. */
  await upsert({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Roar Realty",
    phone: "",
    whatsapp: "",
    email: "",
    officeAddress: "",
    reraNumber: "",
    legalEntity: "Roar Realty India Pvt. Ltd.",
    goldTone: "#C6A15B",
    effects3d: true,
    grainOverlay: true,
    footerNote: "Every promise in writing.",
    exitIntent: {
      enabled: true,
      heading: "Before you go —",
      body: "Get our Delhi NCR market brief: what's actually selling, where prices moved, and which projects we walked away from. One email, no follow-up calls.",
      cta: "Send me the brief →",
    },
    announcement: { enabled: false },
  });
  console.log("✓ site settings (contact fields intentionally blank)");

  console.log("\nDone. Open /studio to edit.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
