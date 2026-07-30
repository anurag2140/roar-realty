import { defineField, defineType } from "sanity";
import { AMENITIES, AREA_UNITS, FURNISHING } from "@/lib/site";

export const seoObject = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Leave blank to use the page title. Aim for under 60 characters.",
      validation: (r) => r.max(70).warning("Google truncates past ~60 characters."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (r) => r.max(180).warning("Google truncates past ~155 characters."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "1200×630 works best. Falls back to the first property photo.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const statObject = defineType({
  name: "stat",
  title: "Stat",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Displayed value",
      type: "string",
      description: 'What the visitor reads, e.g. "12 yrs", "100%", "₹0".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "countTo",
      title: "Count up to",
      type: "number",
      description:
        "Optional. If set, the number animates from 0 to this value when scrolled into view.",
    }),
    defineField({ name: "suffix", title: "Suffix after the number", type: "string" }),
    defineField({
      name: "label",
      title: "Caption",
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});

export const pillarObject = defineType({
  name: "pillar",
  title: "Rule",
  type: "object",
  fields: [
    defineField({ name: "num", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "num" } },
});

export const processStepObject = defineType({
  name: "processStep",
  title: "Step",
  type: "object",
  fields: [
    defineField({ name: "num", title: "Numeral", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "num" } },
});

export const compareRowObject = defineType({
  name: "compareRow",
  title: "Comparison row",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Aspect", type: "string", validation: (r) => r.required() }),
    defineField({ name: "old", title: "The typical broker", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "roar", title: "The Roar way", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "roar" } },
});

export const glassFileObject = defineType({
  name: "glassFile",
  title: "Glass File",
  type: "object",
  description:
    "The due-diligence facts shown on the listing. Only tick what has actually been verified.",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "titleChainYears",
      title: "Title chain verified (years)",
      type: "number",
      validation: (r) => r.min(0).max(200),
    }),
    defineField({ name: "litigationScan", title: "Litigation scan completed", type: "boolean", initialValue: false }),
    defineField({ name: "encumbranceChecked", title: "Encumbrance certificate checked", type: "boolean", initialValue: false }),
    defineField({ name: "duesCleared", title: "Dues confirmed cleared", type: "boolean", initialValue: false }),
    defineField({ name: "builderRecordChecked", title: "Builder track record reviewed", type: "boolean", initialValue: false }),
    defineField({ name: "reraVerified", title: "RERA cross-check done", type: "boolean", initialValue: false }),
    defineField({
      name: "reraNumber",
      title: "Project RERA number",
      type: "string",
      description: "The project's registration number, as published by the state authority.",
    }),
    defineField({ name: "notes", title: "Internal notes", type: "text", rows: 3 }),
  ],
});

export const priceRowObject = defineType({
  name: "priceRow",
  title: "Price line item",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "amount", title: "Amount", type: "string" }),
    defineField({ name: "note", title: "Note", type: "string" }),
  ],
  preview: { select: { title: "label", subtitle: "amount" } },
});

export const nearbyObject = defineType({
  name: "nearby",
  title: "Nearby landmark",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Place", type: "string", validation: (r) => r.required() }),
    defineField({ name: "distance", title: "Distance / time", type: "string" }),
  ],
  preview: { select: { title: "label", subtitle: "distance" } },
});

export const socialObject = defineType({
  name: "social",
  title: "Social profile",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: ["Instagram", "LinkedIn", "YouTube", "Facebook", "X", "WhatsApp"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "platform", subtitle: "url" } },
});

/** Shared option lists so the schema and the filter UI can never drift. */
export const amenityList = [...AMENITIES];
export const areaUnitList = [...AREA_UNITS];
export const furnishingList = [...FURNISHING];
