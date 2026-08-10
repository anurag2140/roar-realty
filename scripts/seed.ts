/**
 * Seeds Sanity with the launch content.
 *
 * Safe to re-run. Singletons (homepage, site settings) are patched field by
 * field rather than replaced, so manual edits made in Studio survive. Pass
 * `--force` to overwrite documents wholesale, and `--drop-samples` to delete
 * the nine illustrative listings and their localities.
 *
 *   npm run seed
 *   npm run seed -- --force
 *   npm run seed -- --drop-samples
 */

import { createClient } from "@sanity/client";
import {
  DEFAULT_FAQS,
  DEFAULT_HOMEPAGE,
  DEFAULT_PROPERTIES,
  DEFAULT_TESTIMONIALS,
} from "../lib/content/defaults";
import { SEED_ARTICLES } from "../lib/content/insights";

const force = process.argv.includes("--force");
const dropSamples = process.argv.includes("--drop-samples");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const withKeys = <T extends object>(items: readonly T[], prefix: string) =>
  items.map((item, i) => ({ ...item, _key: `${prefix}-${i}` }));

async function upsert(doc: { _id: string; _type: string; [k: string]: unknown }) {
  if (force) await client.createOrReplace(doc);
  else await client.createIfNotExists(doc);
}

/** Creates if missing, then sets the given fields — preserving other edits. */
async function upsertAndPatch(
  id: string,
  type: string,
  fields: Record<string, unknown>
) {
  await client.createIfNotExists({ _id: id, _type: type });
  await client.patch(id).set(fields).commit();
}

/** Turns plain paragraphs (and "## Heading" lines) into Portable Text. */
function toPortableText(paragraphs: string[]) {
  return paragraphs.map((p, i) => {
    const isHeading = p.startsWith("## ");
    return {
      _type: "block",
      _key: `b-${i}`,
      style: isHeading ? "h2" : "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `s-${i}`,
          text: isHeading ? p.slice(3) : p,
          marks: [],
        },
      ],
    };
  });
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset}${force ? " (force)" : ""}…\n`);

  /* ---- Remove the illustrative sample listings ---- */
  if (dropSamples) {
    const ids = DEFAULT_PROPERTIES.map((p) => `property-${slugify(p.name)}`);
    const localityIds = Array.from(
      new Set(
        DEFAULT_PROPERTIES.map(
          (p) => `locality-${slugify(p.city)}-${slugify(p.locality)}`
        )
      )
    );
    // Properties reference localities, so listings must go first.
    for (const id of ids) await client.delete(id).catch(() => {});
    for (const id of localityIds) await client.delete(id).catch(() => {});
    console.log(`✓ removed ${ids.length} sample listings and ${localityIds.length} localities`);
  }

  /* ---- Testimonials ---- */
  for (const [i, t] of DEFAULT_TESTIMONIALS.entries()) {
    await upsert({
      _id: `testimonial-placeholder-${i + 1}`,
      _type: "testimonial",
      quote: t.quote,
      name: t.name,
      role: t.role,
      region: t.region,
      agent: t.agent || undefined,
      illustrative: true,
      order: i + 1,
    });
  }
  console.log(`✓ ${DEFAULT_TESTIMONIALS.length} placeholder testimonials`);

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

  /* ---- Insights ---- */
  for (const [i, a] of SEED_ARTICLES.entries()) {
    await upsert({
      _id: `insight-${a.slug}`,
      _type: "insight",
      title: a.title,
      slug: { _type: "slug", current: a.slug },
      excerpt: a.excerpt,
      category: a.category,
      readingMinutes: a.readingMinutes,
      // Spread across the past so ordering is stable; the UI hides dates.
      publishedAt: new Date(Date.now() - (SEED_ARTICLES.length - i) * 864e5).toISOString(),
      body: toPortableText(a.body),
    });
  }
  console.log(`✓ ${SEED_ARTICLES.length} insight articles`);

  /* ---- Homepage ---- */
  const d = DEFAULT_HOMEPAGE;
  await upsertAndPatch("homepage", "homepage", {
    heroEyebrow: d.heroEyebrow,
    heroLine1: d.heroLine1,
    heroLine2: d.heroLine2,
    heroBody: d.heroBody,
    heroStats: withKeys(d.heroStats, "stat"),
    marqueeItems: d.marqueeItems,
    doorsEyebrow: d.doorsEyebrow,
    doorsHeading: d.doorsHeading,
    doors: withKeys(d.doors, "door"),
    frameworkEyebrow: d.frameworkEyebrow,
    frameworkHeading: d.frameworkHeading,
    frameworkBody: d.frameworkBody,
    framework: withKeys(d.framework, "fw"),
    founderHeading: d.founderHeading,
    founderBody: d.founderBody,
    founderCta: d.founderCta,
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

  /* ---- Site settings ---- */
  await upsertAndPatch("siteSettings", "siteSettings", {
    title: "Roar Realty",
    phone: "+91 78989 89029",
    whatsapp: "+917898989029",
    whatsappUae: "+971585455256",
    email: "contact@roarrealty.ae",
    emailIndia: "admin@roarrealty.in",
    officeAddress: "1507, Al Manara Tower, Business Bay, Dubai",
    legalEntity: "Roar Realty LLC",
    foundedYear: 2016,
    // Owner asked for the "registration pending" marker to come down while
    // the number is being issued. Entering a number re-enables the row.
    hideReraNotice: true,
    reraNumber: "",
    // Off until real inventory is loaded.
    showProperties: false,
    goldTone: "#C6A15B",
    effects3d: true,
    grainOverlay: true,
    footerNote: "Don't buy the story. Test the investment.",
    exitIntent: {
      enabled: true,
      heading: "Before you go",
      body: "Get the verification checklist: the free public checks most buyers never run, in Dubai and in Gurgaon. One email, no follow-up calls.",
      cta: "Send me the checklist →",
    },
    announcement: { enabled: false },
  });
  console.log("✓ site settings (Dubai office, Roar Realty LLC, RERA notice hidden)");

  console.log("\nDone. Open /studio to edit.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
