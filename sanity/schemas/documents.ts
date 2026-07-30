import { defineField, defineType } from "sanity";

export const builder = defineType({
  name: "builder",
  title: "Builder",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "established", title: "Established (year)", type: "number" }),
    defineField({ name: "projectsDelivered", title: "Projects delivered", type: "number" }),
    defineField({ name: "description", title: "Track record", type: "text", rows: 4 }),
  ],
  preview: { select: { title: "name", subtitle: "description", media: "logo" } },
});

export const locality = defineType({
  name: "locality",
  title: "Locality",
  type: "document",
  description:
    "Each locality gets its own SEO landing page at /properties/<city>/<locality>.",
  fields: [
    defineField({ name: "name", title: "Locality name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "city", title: "City", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "citySlug",
      title: "City slug",
      type: "slug",
      options: { source: "city" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "blurb", title: "Short intro", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Header image", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", title: "Area guide", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "name", subtitle: "city", media: "image" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "reraId",
      title: "RERA agent registration number",
      type: "string",
      description: "Displayed publicly. Required by law on brokerage advertising.",
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Client name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Descriptor", type: "string", description: 'e.g. "NRI investor · Dubai & Gurugram"' }),
    defineField({ name: "avatar", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "rating", title: "Rating (1–5)", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({
      name: "illustrative",
      title: "⚠️ Illustrative sample (not a real client)",
      type: "boolean",
      initialValue: false,
      description:
        "Tick for placeholder testimonials. Publishing invented client quotes as real is a misleading-advertisement risk under the Consumer Protection Act.",
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "avatar", illustrative: "illustrative" },
    prepare: ({ title, subtitle, media, illustrative }) => ({
      title: `${illustrative ? "⚠️ " : ""}${title}`,
      subtitle,
      media,
    }),
  },
});

export const insight = defineType({
  name: "insight",
  title: "Insight",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (r) => r.max(240) }),
    defineField({ name: "cover", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Market report", "Buyer guide", "Legal & RERA", "Neighbourhood", "Company news"],
      },
    }),
    defineField({ name: "readingMinutes", title: "Reading time (minutes)", type: "number" }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "teamMember" }] }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() }],
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "cover" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["Buying", "Escrow & payments", "Legal", "Fees", "Aftercare"] },
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  preview: { select: { title: "question", subtitle: "category" } },
});
