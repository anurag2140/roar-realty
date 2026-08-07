import { groq } from "next-sanity";
import { sanityFetch } from "./client";
import type {
  Faq,
  Homepage,
  Insight,
  Locality,
  Property,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";
import { PROPERTIES_PER_PAGE, type SortOption } from "@/lib/site";

/* ---------------- Fragments ---------------- */

const imageFields = groq`
  ...,
  alt,
  caption
`;

const seoFields = groq`
  seo{ title, description, noIndex, ogImage{ ${imageFields} } }
`;

const propertyCardFields = groq`
  _id,
  name,
  "slug": slug.current,
  tag,
  propertyType,
  priceCr,
  priceOnRequest,
  city,
  "citySlug": citySlug.current,
  "locality": locality->name,
  "localitySlug": locality->slug.current,
  bedrooms,
  carpetArea,
  plotArea,
  areaUnit,
  possessionStatus,
  possessionDate,
  escrowProtected,
  featured,
  illustrative,
  images[0...2]{ ${imageFields} }
`;

const propertyFullFields = groq`
  ${propertyCardFields},
  bathrooms,
  superBuiltUpArea,
  address,
  geo,
  facing,
  floor,
  totalFloors,
  furnishing,
  parking,
  amenities,
  images[]{ ${imageFields} },
  floorPlans[]{ ${imageFields} },
  "brochureUrl": brochure.asset->url,
  videoUrl,
  virtualTourUrl,
  summary,
  body,
  highlights,
  nearby[]{ _key, label, distance },
  priceBreakdown[]{ _key, label, amount, note },
  glassFile,
  publishedAt,
  builder->{ _id, name, "slug": slug.current, logo{ ${imageFields} }, established, description, projectsDelivered },
  agent->{ _id, name, role, phone, whatsapp, email, reraId, photo{ ${imageFields} } },
  ${seoFields}
`;

/* ---------------- Site settings ---------------- */

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>(
    groq`*[_type == "siteSettings"][0]{
      title,
      logo{ ${imageFields} },
      phone, whatsapp, email, emailIndia, officeAddress,
      reraNumber, hideReraNotice, legalEntity, foundedYear, cin,
      socials[]{ _key, platform, url },
      goldTone, effects3d, grainOverlay, showProperties,
      announcement, exitIntent, footerNote,
      defaultSeo{ title, description, ogImage{ ${imageFields} } }
    }`,
    {},
    { tags: ["siteSettings"] }
  );
}

/* ---------------- Homepage ---------------- */

export async function getHomepage(): Promise<Homepage | null> {
  return sanityFetch<Homepage | null>(
    groq`*[_type == "homepage"][0]{
      ...,
      pillars[]{ _key, num, title, body },
      steps[]{ _key, num, title, body },
      compareRows[]{ _key, label, old, roar },
      heroStats[]{ _key, value, countTo, suffix, label },
      chapter2Stats[]{ _key, value, countTo, suffix, label },
      chapter1Cards[]{ _key, title, body },
      doors[]{ _key, market, heading, body, cta, href },
      framework[]{ _key, num, title, intro, items, line },
      ${seoFields}
    }`,
    {},
    { tags: ["homepage"] }
  );
}

/* ---------------- Properties ---------------- */

export type PropertyFilters = {
  q?: string;
  type?: string;
  minCr?: number | null;
  maxCr?: number | null;
  beds?: number[];
  city?: string;
  locality?: string;
  possession?: string;
  amenities?: string[];
  escrowOnly?: boolean;
  sort?: SortOption;
  page?: number;
};

const SORT_CLAUSE: Record<SortOption, string> = {
  newest: "publishedAt desc, _createdAt desc",
  "price-asc": "priceCr asc",
  "price-desc": "priceCr desc",
  "area-desc": "coalesce(carpetArea, plotArea, 0) desc",
};

/**
 * Builds the GROQ filter from user input.
 *
 * Every dynamic value goes in as a bound parameter rather than string
 * interpolation — GROQ injection is a real thing and search input is untrusted.
 */
function buildPropertyFilter(f: PropertyFilters): {
  filter: string;
  params: Record<string, unknown>;
} {
  const clauses = [`_type == "property"`, `defined(slug.current)`];
  const params: Record<string, unknown> = {};

  if (f.q) {
    clauses.push(
      `(name match $q || city match $q || locality->name match $q || builder->name match $q || summary match $q)`
    );
    params.q = `*${f.q}*`;
  }
  if (f.type && f.type !== "All") {
    clauses.push(`propertyType == $type`);
    params.type = f.type;
  }
  if (typeof f.minCr === "number") {
    clauses.push(`priceCr >= $minCr`);
    params.minCr = f.minCr;
  }
  if (typeof f.maxCr === "number") {
    clauses.push(`priceCr <= $maxCr`);
    params.maxCr = f.maxCr;
  }
  if (f.beds?.length) {
    // 5 means "5 or more".
    const hasFivePlus = f.beds.includes(5);
    clauses.push(
      hasFivePlus
        ? `(bedrooms in $beds || bedrooms >= 5)`
        : `bedrooms in $beds`
    );
    params.beds = f.beds;
  }
  if (f.city) {
    clauses.push(`citySlug.current == $city`);
    params.city = f.city;
  }
  if (f.locality) {
    clauses.push(`locality->slug.current == $locality`);
    params.locality = f.locality;
  }
  if (f.possession) {
    clauses.push(`possessionStatus == $possession`);
    params.possession = f.possession;
  }
  if (f.amenities?.length) {
    clauses.push(`count((amenities[])[@ in $amenities]) == $amenityCount`);
    params.amenities = f.amenities;
    params.amenityCount = f.amenities.length;
  }
  if (f.escrowOnly) {
    clauses.push(`escrowProtected == true`);
  }

  return { filter: clauses.join(" && "), params };
}

export async function getProperties(f: PropertyFilters = {}): Promise<{
  items: Property[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const { filter, params } = buildPropertyFilter(f);
  const page = Math.max(1, f.page || 1);
  const start = (page - 1) * PROPERTIES_PER_PAGE;
  const end = start + PROPERTIES_PER_PAGE;
  const order = SORT_CLAUSE[f.sort || "newest"];

  const result = await sanityFetch<{ items: Property[]; total: number }>(
    groq`{
      "items": *[${filter}] | order(${order}) [$start...$end]{ ${propertyCardFields} },
      "total": count(*[${filter}])
    }`,
    { ...params, start, end },
    { tags: ["property"] }
  );

  return {
    items: result?.items ?? [],
    total: result?.total ?? 0,
    page,
    pageCount: Math.max(1, Math.ceil((result?.total ?? 0) / PROPERTIES_PER_PAGE)),
  };
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  return sanityFetch<Property[]>(
    groq`*[_type == "property" && defined(slug.current)]
      | order(featured desc, publishedAt desc)[0...$limit]{ ${propertyCardFields} }`,
    { limit },
    { tags: ["property"] }
  );
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return sanityFetch<Property | null>(
    groq`*[_type == "property" && slug.current == $slug][0]{ ${propertyFullFields} }`,
    { slug },
    { tags: ["property", `property:${slug}`] }
  );
}

export async function getAllPropertySlugs(): Promise<
  { slug: string; publishedAt?: string }[]
> {
  return sanityFetch<{ slug: string; publishedAt?: string }[]>(
    groq`*[_type == "property" && defined(slug.current)]{ "slug": slug.current, publishedAt }`,
    {},
    { tags: ["property"] }
  );
}

/**
 * Similar = same type or city, closest in price, excluding the current listing.
 *
 * GROQ has no `abs()`, so the absolute price gap is projected with `select()`
 * first and the result ordered by that field.
 */
export async function getSimilarProperties(
  property: Property,
  limit = 3
): Promise<Property[]> {
  const price = property.priceCr ?? 0;
  return sanityFetch<Property[]>(
    groq`*[_type == "property"
      && _id != $id
      && defined(slug.current)
      && (propertyType == $type || city == $city)]{
        ${propertyCardFields},
        "priceDelta": select(
          coalesce(priceCr, 0) >= $price => coalesce(priceCr, 0) - $price,
          $price - coalesce(priceCr, 0)
        )
      } | order(priceDelta asc)[0...$limit]`,
    {
      id: property._id,
      type: property.propertyType,
      city: property.city,
      price,
      limit,
    },
    { tags: ["property"] }
  );
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  if (!ids.length) return [];
  return sanityFetch<Property[]>(
    groq`*[_type == "property" && _id in $ids]{ ${propertyCardFields} }`,
    { ids },
    { tags: ["property"] }
  );
}

/** Distinct facet values, so filter dropdowns only offer what exists. */
export async function getPropertyFacets(): Promise<{
  cities: { name: string; slug: string }[];
  localities: { name: string; slug: string; city: string }[];
  types: string[];
}> {
  const res = await sanityFetch<{
    cities: { name: string; slug: string }[];
    localities: { name: string; slug: string; city: string }[];
    types: string[];
  }>(
    groq`{
      "cities": array::unique(*[_type == "property" && defined(citySlug.current)]{
        "name": city, "slug": citySlug.current
      }),
      "localities": array::unique(*[_type == "locality" && defined(slug.current)]{
        "name": name, "slug": slug.current, city
      }),
      "types": array::unique(*[_type == "property"].propertyType)
    }`,
    {},
    { tags: ["property", "locality"] }
  );
  return {
    cities: res?.cities ?? [],
    localities: res?.localities ?? [],
    types: (res?.types ?? []).filter(Boolean),
  };
}

/* ---------------- Localities ---------------- */

export async function getLocalityBySlug(
  citySlug: string,
  slug: string
): Promise<Locality | null> {
  return sanityFetch<Locality | null>(
    groq`*[_type == "locality" && slug.current == $slug && citySlug.current == $citySlug][0]{
      _id, name, "slug": slug.current, city, "citySlug": citySlug.current,
      blurb, body, image{ ${imageFields} }
    }`,
    { slug, citySlug },
    { tags: ["locality"] }
  );
}

export async function getAllLocalityPaths(): Promise<
  { city: string; slug: string }[]
> {
  return sanityFetch<{ city: string; slug: string }[]>(
    groq`*[_type == "locality" && defined(slug.current) && defined(citySlug.current)]{
      "city": citySlug.current, "slug": slug.current
    }`,
    {},
    { tags: ["locality"] }
  );
}

/* ---------------- Editorial ---------------- */

export async function getTestimonials(limit = 300): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>(
    groq`*[_type == "testimonial"] | order(order asc, _createdAt asc)[0...$limit]{
      _id, quote, name, role, region, market, agent, rating, illustrative, order,
      avatar{ ${imageFields} }
    }`,
    { limit },
    { tags: ["testimonial"] }
  );
}

export async function getTeam(): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>(
    groq`*[_type == "teamMember"] | order(order asc, name asc){
      _id, name, role, bio, phone, whatsapp, email, reraId, order, photo{ ${imageFields} }
    }`,
    {},
    { tags: ["teamMember"] }
  );
}

export async function getInsights(limit = 24): Promise<Insight[]> {
  return sanityFetch<Insight[]>(
    groq`*[_type == "insight" && defined(slug.current)]
      | order(publishedAt desc)[0...$limit]{
      _id, title, "slug": slug.current, excerpt, category, readingMinutes, publishedAt,
      cover{ ${imageFields} },
      author->{ _id, name, role, photo{ ${imageFields} } }
    }`,
    { limit },
    { tags: ["insight"] }
  );
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  return sanityFetch<Insight | null>(
    groq`*[_type == "insight" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, excerpt, category, readingMinutes, publishedAt, body,
      cover{ ${imageFields} },
      author->{ _id, name, role, bio, photo{ ${imageFields} } },
      ${seoFields}
    }`,
    { slug },
    { tags: ["insight", `insight:${slug}`] }
  );
}

export async function getAllInsightSlugs(): Promise<
  { slug: string; publishedAt: string }[]
> {
  return sanityFetch<{ slug: string; publishedAt: string }[]>(
    groq`*[_type == "insight" && defined(slug.current)]{ "slug": slug.current, publishedAt }`,
    {},
    { tags: ["insight"] }
  );
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  return sanityFetch<Faq[]>(
    category
      ? groq`*[_type == "faq" && category == $category] | order(order asc){ _id, question, answer, category, order }`
      : groq`*[_type == "faq"] | order(order asc){ _id, question, answer, category, order }`,
    category ? { category } : {},
    { tags: ["faq"] }
  );
}
