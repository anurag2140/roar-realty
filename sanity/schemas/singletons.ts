import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "doors", title: "Dubai / Gurgaon" },
    { name: "framework", title: "Selection framework" },
    { name: "story", title: "Chapters I & II" },
    { name: "standard", title: "The Roar Standard" },
    { name: "process", title: "Process" },
    { name: "portfolio", title: "Portfolio" },
    { name: "compare", title: "Comparison" },
    { name: "founder", title: "Founder block" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* Hero */
    defineField({ name: "heroEyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroLine1", title: "Headline, line 1", type: "string", group: "hero" }),
    defineField({
      name: "heroLine2",
      title: "Headline, line 2 (gold shimmer)",
      type: "string",
      group: "hero",
    }),
    defineField({ name: "heroBody", title: "Intro paragraph", type: "text", rows: 4, group: "hero" }),
    defineField({
      name: "heroStats",
      title: "Stat strip",
      type: "array",
      group: "hero",
      of: [{ type: "stat" }],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: "marqueeItems",
      title: "Scrolling banner items",
      type: "array",
      group: "hero",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    /* The two doors */
    defineField({ name: "doorsEyebrow", title: "Eyebrow", type: "string", group: "doors" }),
    defineField({ name: "doorsHeading", title: "Heading", type: "string", group: "doors" }),
    defineField({
      name: "doors",
      title: "Market doors",
      type: "array",
      group: "doors",
      description: "Dubai first, the order here sets the visual weight on the page.",
      of: [
        {
          type: "object",
          fields: [
            { name: "market", type: "string", title: "Market label" },
            { name: "heading", type: "string", title: "Heading" },
            { name: "body", type: "text", rows: 4, title: "Body" },
            { name: "cta", type: "string", title: "Button text" },
            { name: "href", type: "string", title: "Link" },
          ],
          preview: { select: { title: "heading", subtitle: "market" } },
        },
      ],
      validation: (r) => r.max(2),
    }),

    /* Selection framework */
    defineField({ name: "frameworkEyebrow", title: "Eyebrow", type: "string", group: "framework" }),
    defineField({ name: "frameworkHeading", title: "Heading", type: "string", group: "framework" }),
    defineField({ name: "frameworkBody", title: "Intro", type: "text", rows: 3, group: "framework" }),
    defineField({
      name: "framework",
      title: "The three steps",
      type: "array",
      group: "framework",
      of: [
        {
          type: "object",
          fields: [
            { name: "num", type: "string", title: "Number" },
            { name: "title", type: "string", title: "Title" },
            { name: "intro", type: "string", title: "Lead-in line" },
            {
              name: "items",
              type: "array",
              title: "Checklist",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            },
            { name: "line", type: "text", rows: 2, title: "Simple line" },
          ],
          preview: { select: { title: "title", subtitle: "line" } },
        },
      ],
      validation: (r) => r.max(4),
    }),

    /* Founder */
    defineField({ name: "founderHeading", title: "Heading", type: "string", group: "founder" }),
    defineField({ name: "founderBody", title: "Body", type: "text", rows: 5, group: "founder" }),
    defineField({ name: "founderCta", title: "Button text", type: "string", group: "founder" }),

    /* Chapters */
    defineField({ name: "chapter1Label", title: "Chapter I, label", type: "string", group: "story" }),
    defineField({ name: "chapter1Heading", title: "Chapter I, heading", type: "string", group: "story" }),
    defineField({
      name: "chapter1Body",
      title: "Chapter I, paragraphs",
      type: "array",
      group: "story",
      of: [{ type: "text", rows: 4 }],
    }),
    defineField({
      name: "chapter1Cards",
      title: "Chapter I, three cards",
      type: "array",
      group: "story",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "string", title: "Body" },
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "chapter2Label", title: "Chapter II, label", type: "string", group: "story" }),
    defineField({ name: "chapter2Heading", title: "Chapter II, heading", type: "string", group: "story" }),
    defineField({ name: "chapter2Body", title: "Chapter II, intro", type: "text", rows: 4, group: "story" }),
    defineField({
      name: "chapter2Stats",
      title: "Chapter II, four statistics",
      type: "array",
      group: "story",
      of: [{ type: "stat" }],
      validation: (r) => r.max(4),
    }),
    defineField({ name: "chapter2Quote", title: "Chapter II, pull quote", type: "text", rows: 3, group: "story" }),
    defineField({ name: "chapter2QuoteAttrib", title: "Chapter II, attribution", type: "string", group: "story" }),

    /* Standard */
    defineField({ name: "standardLabel", title: "Label", type: "string", group: "standard" }),
    defineField({ name: "standardHeading", title: "Heading", type: "string", group: "standard" }),
    defineField({ name: "standardBody", title: "Intro", type: "text", rows: 3, group: "standard" }),
    defineField({
      name: "pillars",
      title: "The rules",
      type: "array",
      group: "standard",
      of: [{ type: "pillar" }],
    }),

    /* Process */
    defineField({ name: "processEyebrow", title: "Eyebrow", type: "string", group: "process" }),
    defineField({ name: "processHeading", title: "Heading", type: "string", group: "process" }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      group: "process",
      of: [{ type: "processStep" }],
    }),

    /* Portfolio */
    defineField({ name: "portfolioEyebrow", title: "Eyebrow", type: "string", group: "portfolio" }),
    defineField({ name: "portfolioHeading", title: "Heading", type: "string", group: "portfolio" }),
    defineField({ name: "portfolioBody", title: "Intro", type: "text", rows: 3, group: "portfolio" }),

    /* Comparison */
    defineField({ name: "compareEyebrow", title: "Eyebrow", type: "string", group: "compare" }),
    defineField({ name: "compareHeading", title: "Heading", type: "string", group: "compare" }),
    defineField({
      name: "compareRows",
      title: "Rows",
      type: "array",
      group: "compare",
      of: [{ type: "compareRow" }],
    }),

    /* Contact */
    defineField({ name: "contactEyebrow", title: "Eyebrow", type: "string", group: "contact" }),
    defineField({ name: "contactHeading", title: "Heading", type: "string", group: "contact" }),
    defineField({ name: "contactBody", title: "Intro", type: "text", rows: 4, group: "contact" }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "legal", title: "Legal" },
    { name: "look", title: "Look & effects" },
    { name: "popups", title: "Banners & popups" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Company name", type: "string", group: "contact" }),
    defineField({ name: "logo", title: "Logo", type: "image", group: "contact", options: { hotspot: true } }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
      description: "Leave blank until you have a real number, the site shows a TBC marker rather than a placeholder.",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp, India desk",
      type: "string",
      group: "contact",
      description:
        "With country code and no spaces, e.g. +917898989029. Powers the floating WhatsApp button.",
    }),
    defineField({
      name: "whatsappUae",
      title: "WhatsApp, Dubai desk",
      type: "string",
      group: "contact",
      description: "e.g. +971585455256",
    }),
    defineField({
      name: "whatsappDesks",
      title: "Extra WhatsApp desks",
      type: "array",
      group: "contact",
      description:
        "Any additional numbers. When more than one desk exists in total, the WhatsApp button shows a chooser instead of guessing.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Desk name" },
            { name: "number", type: "string", title: "Number with country code" },
          ],
          preview: { select: { title: "label", subtitle: "number" } },
        },
      ],
    }),
    defineField({
      name: "email",
      title: "Primary email",
      type: "string",
      group: "contact",
      description: "e.g. contact@roarrealty.ae",
    }),
    defineField({
      name: "emailIndia",
      title: "India email",
      type: "string",
      group: "contact",
      description: "Optional second address, e.g. admin@roarrealty.in",
    }),
    defineField({ name: "officeAddress", title: "Office address", type: "text", rows: 3, group: "contact" }),
    defineField({
      name: "socials",
      title: "Social profiles",
      type: "array",
      group: "contact",
      of: [{ type: "social" }],
    }),

    defineField({
      name: "reraNumber",
      title: "RERA agent registration number",
      type: "string",
      group: "legal",
      description:
        "Displayed in the footer and on every listing. Legally required on brokerage advertising in Haryana and UP.",
    }),
    defineField({
      name: "hideReraNotice",
      title: "Hide the “registration pending” notice",
      type: "boolean",
      group: "legal",
      initialValue: false,
      description:
        "Hides the ⚠ marker while your number is being issued. The number itself still appears automatically once you enter it above.",
    }),
    defineField({ name: "legalEntity", title: "Registered entity name", type: "string", group: "legal" }),
    defineField({
      name: "foundedYear",
      title: "Year founded",
      type: "number",
      group: "legal",
      description: "Used for the copyright line, e.g. “© 2016–2026”.",
      validation: (r) => r.min(1900).max(2100),
    }),
    defineField({ name: "cin", title: "CIN / trade licence", type: "string", group: "legal" }),
    defineField({ name: "footerNote", title: "Footer note", type: "string", group: "legal" }),

    defineField({
      name: "goldTone",
      title: "Gold tone",
      type: "string",
      group: "look",
      options: {
        list: [
          { title: "Roar gold (default)", value: "#C6A15B" },
          { title: "Bright gold", value: "#D4AF37" },
          { title: "Bronze", value: "#B08D57" },
          { title: "Antique", value: "#A98F5E" },
        ],
      },
      initialValue: "#C6A15B",
    }),
    defineField({
      name: "effects3d",
      title: "3D effects",
      type: "boolean",
      group: "look",
      initialValue: true,
      description:
        "Master switch for the Three.js scenes. They already auto-disable on low-powered phones.",
    }),
    defineField({ name: "grainOverlay", title: "Film grain overlay", type: "boolean", group: "look", initialValue: true }),
    defineField({
      name: "showProperties",
      title: "Show the properties section",
      type: "boolean",
      group: "look",
      initialValue: false,
      description:
        "Off until you have real listings. Hides the homepage portfolio grid and the Properties link in the menu. Your listings and the search page still exist, they're just not linked.",
    }),

    defineField({
      name: "announcement",
      title: "Announcement bar",
      type: "object",
      group: "popups",
      fields: [
        { name: "enabled", type: "boolean", title: "Show", initialValue: false },
        { name: "text", type: "string", title: "Text" },
        { name: "href", type: "string", title: "Link" },
      ],
    }),
    defineField({
      name: "exitIntent",
      title: "Exit-intent popup",
      type: "object",
      group: "popups",
      description:
        "Appears when a desktop visitor moves to close the tab, or after 35s + 50% scroll on mobile. Suppressed for 30 days once dismissed or submitted.",
      fields: [
        { name: "enabled", type: "boolean", title: "Enable", initialValue: true },
        { name: "heading", type: "string", title: "Heading" },
        { name: "body", type: "text", rows: 3, title: "Body" },
        { name: "cta", type: "string", title: "Button label" },
      ],
    }),

    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
