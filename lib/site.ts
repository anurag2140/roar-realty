/** Static site constants — navigation, defaults, and the enums the property
 *  filters are built from. Content lives in Sanity; structure lives here. */

export const SITE_NAME = "Roar Realty";
export const SITE_TAGLINE = "Verified Before Recommended";
export const SITE_DESCRIPTION =
  "Most buyers are shown property. Almost none are shown the risk. " +
  "Twelve years of Dubai transaction experience applied to Dubai and Gurgaon, " +
  "titles verified, carpet-area pricing, one fee in writing, exit planned before entry.";

/** The line the whole brand rests on. Used in CTAs and social cards. */
export const SITE_LINE = "Don't buy the story. Test the investment.";

/**
 * Dubai sits before Gurgaon deliberately — that ordering communicates the
 * 60/40 weighting of the business before anyone reads a word.
 */
export const NAV_LINKS = [
  { href: "/dubai", label: "Dubai" },
  { href: "/gurgaon", label: "Gurgaon" },
  { href: "/the-roar-standard", label: "The Standard" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "Founder" },
] as const;

/** Only shown once Site settings → "Show the properties section" is on. */
export const PROPERTIES_NAV_LINK = { href: "/properties", label: "Properties" } as const;

export const FOOTER_LINKS = {
  explore: [
    { href: "/dubai", label: "Dubai advisory" },
    { href: "/gurgaon", label: "Gurgaon & NCR" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ],
  company: [
    { href: "/about", label: "About Anurag" },
    { href: "/the-roar-standard", label: "The Roar Standard" },
    { href: "/process", label: "How we work" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of use" },
    { href: "/disclaimer", label: "Disclaimer & RERA" },
  ],
} as const;

/* ---------------- Property taxonomy ---------------- */

export const PROPERTY_TYPES = [
  "Apartments",
  "Villas",
  "Off-plan",
  "Commercial",
  "Plots",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const POSSESSION_STATUSES = [
  "Ready to move",
  "Under construction",
  "Registry-ready",
] as const;
export type PossessionStatus = (typeof POSSESSION_STATUSES)[number];

export const FURNISHING = [
  "Unfurnished",
  "Semi-furnished",
  "Fully furnished",
] as const;

export const AREA_UNITS = ["sq ft", "sq yd", "sq m", "acre"] as const;

export const AMENITIES = [
  "Clubhouse",
  "Swimming pool",
  "Gymnasium",
  "Concierge",
  "Power backup",
  "Covered parking",
  "Landscaped gardens",
  "Kids play area",
  "Sports courts",
  "Spa & sauna",
  "Banquet hall",
  "Home automation",
  "Private lift",
  "Servant quarter",
  "EV charging",
  "24×7 security",
] as const;

/** Price bands in ₹ crore — must stay in sync with the homepage chips. */
export const PRICE_BANDS = [
  { label: "All", min: null, max: null },
  { label: "Under ₹3 Cr", min: null, max: 3 },
  { label: "₹3–10 Cr", min: 3, max: 10 },
  { label: "₹10 Cr+", min: 10, max: null },
] as const;

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "area-desc", label: "Largest first" },
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const PROPERTIES_PER_PAGE = 9;

/** Max items the compare drawer will hold. */
export const MAX_COMPARE = 3;

/* ---------------- Formatting helpers ---------------- */

/**
 * Indian price formatting. Input is in ₹ crore (matching how the market and
 * the CMS both talk about price), output is display text.
 * 0.85 → "₹85 L", 14.5 → "₹14.5 Cr", 22 → "₹22 Cr"
 */
export function formatPriceCr(cr: number | null | undefined): string {
  if (cr === null || cr === undefined || Number.isNaN(cr)) return "Price on request";
  if (cr < 1) {
    const lakh = Math.round(cr * 100);
    return `₹${lakh} L`;
  }
  const rounded = Math.round(cr * 100) / 100;
  return `₹${rounded % 1 === 0 ? rounded.toFixed(0) : rounded} Cr`;
}

/** 3850 → "3,850" using the Indian grouping the prototype used. */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export function formatArea(
  value: number | null | undefined,
  unit: string | null | undefined
): string {
  if (!value) return "n/a";
  return `${formatNumber(value)} ${unit || "sq ft"}`;
}

/** Builds a wa.me deep link. Strips everything but digits from the number. */
export function whatsappLink(number: string, message: string): string {
  const digits = (number || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(number: string): string {
  const cleaned = (number || "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}
