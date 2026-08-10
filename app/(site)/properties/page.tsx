import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProperties, getPropertyFacets } from "@/lib/sanity/queries";
import { buildQuery, countActive, describeFilters, parseFilters, type SearchParams } from "@/lib/property/filters";
import { Filters } from "@/components/property/Filters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { EmptyResults } from "@/components/property/EmptyResults";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CompareDrawer } from "@/components/property/CompareDrawer";

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const active = countActive(filters);
  const summary = describeFilters(filters);

  return {
    title: active ? `${summary}, search` : "Properties for sale in Delhi NCR",
    description: active
      ? `Browse ${summary} with Roar Realty. Every listing carries a complete Glass File, title chain, dues, litigation scan and builder record.`
      : "Escrow-protected, Glass-File-verified property across Gurugram, New Delhi and Noida. Search by type, budget, bedrooms, locality and possession.",
    // Filtered permutations are near-duplicates; only the clean page should be
    // indexed, or Google sees thousands of thin variants of the same list.
    robots: active ? { index: false, follow: true } : undefined,
    alternates: { canonical: "/properties" },
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const activeCount = countActive(filters);

  const [result, facets] = await Promise.all([
    getProperties(filters),
    getPropertyFacets(),
  ]);

  const { items, total, page, pageCount } = result;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Properties", href: "/properties" },
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-5 pt-16 pb-24 lg:px-10 lg:pt-20 lg:pb-32">
        <header className="mb-10">
          <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
            Curated · Delhi NCR
          </div>
          <h1 className="m-0 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.06] text-balance text-ivory">
            {activeCount ? "Search results." : "The portfolio."}
          </h1>
          <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-ivory/50">
            Every listing here carries a complete Glass File, title chain, dues,
            litigation scan and builder record, before we let it on this page.
          </p>
        </header>

        {/* useSearchParams needs a Suspense boundary during prerender. */}
        <Suspense fallback={<div className="mb-10 h-32" />}>
          <Filters facets={facets} total={total} activeCount={activeCount} />
        </Suspense>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6.5">
              {items.map((p, i) => (
                <PropertyCard key={p._id} property={p} priority={i < 3} />
              ))}
            </div>

            {pageCount > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-14 flex items-center justify-center gap-2"
              >
                {page > 1 && (
                  <Link
                    href={`/properties${buildQuery(filters, { page: page - 1 })}`}
                    className="border border-gold/30 px-5 py-3 text-[12px] tracking-[0.2em] text-ivory/70 uppercase no-underline transition-colors hover:border-gold-hi hover:text-gold-hi"
                  >
                    ← Previous
                  </Link>
                )}

                <span className="px-4 text-[13px] text-ivory/45">
                  Page {page} of {pageCount}
                </span>

                {page < pageCount && (
                  <Link
                    href={`/properties${buildQuery(filters, { page: page + 1 })}`}
                    className="border border-gold/30 px-5 py-3 text-[12px] tracking-[0.2em] text-ivory/70 uppercase no-underline transition-colors hover:border-gold-hi hover:text-gold-hi"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <EmptyResults summary={describeFilters(filters)} />
        )}
      </div>

      <CompareDrawer />
    </>
  );
}
