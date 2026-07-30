import { defineField, defineType } from "sanity";
import {
  POSSESSION_STATUSES,
  PROPERTY_TYPES,
  formatPriceCr,
} from "@/lib/site";
import { amenityList, areaUnitList, furnishingList } from "./objects";

export const property = defineType({
  name: "property",
  title: "Property",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "specs", title: "Specifications" },
    { name: "media", title: "Photos & media" },
    { name: "glass", title: "Glass File" },
    { name: "location", title: "Location" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ---- Basics ---- */
    defineField({
      name: "name",
      title: "Property name",
      type: "string",
      group: "basics",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "basics",
      options: { source: "name", maxLength: 96 },
      description: "Generates the web address. Click Generate after typing the name.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "propertyType",
      title: "Type",
      type: "string",
      group: "basics",
      options: { list: [...PROPERTY_TYPES], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tag",
      title: "Badge",
      type: "string",
      group: "basics",
      description:
        'Small label on the photo, e.g. "Ultra-luxury", "Escrow-protected", "Pre-leased 7.1%".',
    }),
    defineField({
      name: "priceCr",
      title: "Price (₹ crore)",
      type: "number",
      group: "basics",
      description:
        "Enter in crore. 85 lakh = 0.85. 14.5 crore = 14.5. Leave blank for price on request.",
      validation: (r) => r.min(0).max(10000),
    }),
    defineField({
      name: "priceOnRequest",
      title: "Show as 'Price on request'",
      type: "boolean",
      group: "basics",
      initialValue: false,
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "basics",
      description: "One or two sentences. Used on cards and in search results.",
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "array",
      group: "basics",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "basics",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      group: "basics",
      initialValue: false,
    }),
    defineField({
      name: "illustrative",
      title: "⚠️ Illustrative sample (not real inventory)",
      type: "boolean",
      group: "basics",
      initialValue: false,
      description:
        "Tick while using placeholder content. The site shows a visible 'sample listing' marker and keeps the page out of Google.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      group: "basics",
      initialValue: () => new Date().toISOString(),
    }),

    /* ---- Specs ---- */
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number", group: "specs", validation: (r) => r.min(0).max(20) }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number", group: "specs", validation: (r) => r.min(0).max(20) }),
    defineField({
      name: "carpetArea",
      title: "Carpet area",
      type: "number",
      group: "specs",
      description: "The area the buyer actually occupies. This is what we quote on.",
    }),
    defineField({
      name: "superBuiltUpArea",
      title: "Super built-up area",
      type: "number",
      group: "specs",
      description: "Shown only for comparison, so buyers can see the difference.",
    }),
    defineField({ name: "plotArea", title: "Plot area", type: "number", group: "specs" }),
    defineField({
      name: "areaUnit",
      title: "Area unit",
      type: "string",
      group: "specs",
      options: { list: areaUnitList },
      initialValue: "sq ft",
    }),
    defineField({
      name: "possessionStatus",
      title: "Possession status",
      type: "string",
      group: "specs",
      options: { list: [...POSSESSION_STATUSES], layout: "radio" },
    }),
    defineField({
      name: "possessionDate",
      title: "Possession by",
      type: "string",
      group: "specs",
      description: 'Free text, e.g. "Q4 2027".',
    }),
    defineField({ name: "facing", title: "Facing", type: "string", group: "specs" }),
    defineField({ name: "floor", title: "Floor", type: "string", group: "specs" }),
    defineField({ name: "totalFloors", title: "Total floors", type: "number", group: "specs" }),
    defineField({
      name: "furnishing",
      title: "Furnishing",
      type: "string",
      group: "specs",
      options: { list: furnishingList },
    }),
    defineField({ name: "parking", title: "Parking spaces", type: "number", group: "specs" }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      group: "specs",
      of: [{ type: "string" }],
      options: { list: amenityList },
    }),
    defineField({
      name: "priceBreakdown",
      title: "Price breakdown",
      type: "array",
      group: "specs",
      of: [{ type: "priceRow" }],
      description:
        "Itemise every charge in plain language — this is Rule 03 made visible.",
    }),
    defineField({
      name: "escrowProtected",
      title: "Escrow-protected",
      type: "boolean",
      group: "specs",
      initialValue: false,
    }),

    /* ---- Media ---- */
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
              description:
                "Describe the photo for screen readers and Google. Required.",
              validation: (r) => r.required(),
            },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
      options: { layout: "grid" },
      description: "First photo is the card image. Drag to reorder.",
    }),
    defineField({
      name: "floorPlans",
      title: "Floor plans",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: false },
          fields: [
            { name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() },
            { name: "caption", type: "string", title: "Label" },
          ],
        },
      ],
      options: { layout: "grid" },
    }),
    defineField({ name: "brochure", title: "Brochure (PDF)", type: "file", group: "media" }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "media",
      description: "YouTube or Vimeo link. Opens in a modal.",
    }),
    defineField({ name: "virtualTourUrl", title: "Virtual tour URL", type: "url", group: "media" }),

    /* ---- Glass File ---- */
    defineField({ name: "glassFile", title: "Glass File", type: "glassFile", group: "glass" }),

    /* ---- Location ---- */
    defineField({
      name: "city",
      title: "City",
      type: "string",
      group: "location",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "citySlug",
      title: "City slug",
      type: "slug",
      group: "location",
      options: { source: "city", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "locality",
      title: "Locality",
      type: "reference",
      group: "location",
      to: [{ type: "locality" }],
    }),
    defineField({ name: "address", title: "Address", type: "text", rows: 2, group: "location" }),
    defineField({
      name: "geo",
      title: "Map coordinates",
      type: "geopoint",
      group: "location",
      description: "Drop a pin to show the map on the listing page.",
    }),
    defineField({
      name: "nearby",
      title: "Nearby landmarks",
      type: "array",
      group: "location",
      of: [{ type: "nearby" }],
    }),
    defineField({
      name: "builder",
      title: "Builder / developer",
      type: "reference",
      group: "location",
      to: [{ type: "builder" }],
    }),
    defineField({
      name: "agent",
      title: "Handling agent",
      type: "reference",
      group: "location",
      to: [{ type: "teamMember" }],
    }),

    /* ---- SEO ---- */
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],

  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Price, high to low", name: "priceDesc", by: [{ field: "priceCr", direction: "desc" }] },
    { title: "Price, low to high", name: "priceAsc", by: [{ field: "priceCr", direction: "asc" }] },
    { title: "Name A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],

  preview: {
    select: {
      title: "name",
      city: "city",
      locality: "locality.name",
      priceCr: "priceCr",
      media: "images.0",
      illustrative: "illustrative",
      type: "propertyType",
    },
    prepare({ title, city, locality, priceCr, media, illustrative, type }) {
      const place = [locality, city].filter(Boolean).join(", ");
      return {
        title: `${illustrative ? "⚠️ " : ""}${title}`,
        subtitle: `${formatPriceCr(priceCr)} · ${type || "—"}${place ? ` · ${place}` : ""}`,
        media,
      };
    },
  },
});
