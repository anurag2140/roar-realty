import type { PropertyFilters } from "@/lib/sanity/queries";
import { PROPERTY_TYPES, SORT_OPTIONS, type SortOption } from "@/lib/site";

export type SearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined): string =>
  (Array.isArray(v) ? v[0] : v) ?? "";

const many = (v: string | string[] | undefined): string[] => {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.flatMap((s) => s.split(",")).map((s) => s.trim()).filter(Boolean);
};

const num = (v: string): number | null => {
  const n = Number(v);
  return v !== "" && Number.isFinite(n) ? n : null;
};

/**
 * Turns URL query into a validated filter object.
 *
 * Everything is whitelisted against known values — a query string is user
 * input, and it flows into a GROQ query.
 */
export function parseFilters(sp: SearchParams): PropertyFilters {
  const type = one(sp.type);
  const sort = one(sp.sort) as SortOption;

  return {
    q: one(sp.q).slice(0, 100) || undefined,
    type: (PROPERTY_TYPES as readonly string[]).includes(type) ? type : undefined,
    minCr: num(one(sp.min)),
    maxCr: num(one(sp.max)),
    beds: many(sp.beds)
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 5),
    city: one(sp.city).slice(0, 60) || undefined,
    locality: one(sp.locality).slice(0, 60) || undefined,
    possession: one(sp.possession) || undefined,
    amenities: many(sp.amenities).slice(0, 16),
    escrowOnly: one(sp.escrow) === "1",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : "newest",
    page: Math.max(1, Number(one(sp.page)) || 1),
  };
}

/** Serialises filters back to a query string for links and history. */
export function buildQuery(
  filters: PropertyFilters,
  overrides: Partial<PropertyFilters> = {}
): string {
  const f = { ...filters, ...overrides };
  const p = new URLSearchParams();

  if (f.q) p.set("q", f.q);
  if (f.type) p.set("type", f.type);
  if (typeof f.minCr === "number") p.set("min", String(f.minCr));
  if (typeof f.maxCr === "number") p.set("max", String(f.maxCr));
  if (f.beds?.length) p.set("beds", f.beds.join(","));
  if (f.city) p.set("city", f.city);
  if (f.locality) p.set("locality", f.locality);
  if (f.possession) p.set("possession", f.possession);
  if (f.amenities?.length) p.set("amenities", f.amenities.join(","));
  if (f.escrowOnly) p.set("escrow", "1");
  if (f.sort && f.sort !== "newest") p.set("sort", f.sort);
  // Page 1 is the default; keeping it out makes shared links tidier.
  if (f.page && f.page > 1) p.set("page", String(f.page));

  const s = p.toString();
  return s ? `?${s}` : "";
}

/** How many filters are active — drives the "Filters (3)" badge. */
export function countActive(f: PropertyFilters): number {
  return [
    f.q,
    f.type,
    typeof f.minCr === "number" || typeof f.maxCr === "number",
    f.beds?.length,
    f.city,
    f.locality,
    f.possession,
    f.amenities?.length,
    f.escrowOnly,
  ].filter(Boolean).length;
}

/** Human-readable summary used in the results heading and meta description. */
export function describeFilters(f: PropertyFilters): string {
  const parts: string[] = [];
  if (f.beds?.length) parts.push(`${f.beds.join(", ")} BHK`);
  parts.push(f.type ? f.type.toLowerCase() : "properties");
  if (f.locality) parts.push(`in ${f.locality.replace(/-/g, " ")}`);
  else if (f.city) parts.push(`in ${f.city.replace(/-/g, " ")}`);
  if (typeof f.minCr === "number" && typeof f.maxCr === "number")
    parts.push(`between ₹${f.minCr} Cr and ₹${f.maxCr} Cr`);
  else if (typeof f.maxCr === "number") parts.push(`under ₹${f.maxCr} Cr`);
  else if (typeof f.minCr === "number") parts.push(`over ₹${f.minCr} Cr`);
  return parts.join(" ");
}
