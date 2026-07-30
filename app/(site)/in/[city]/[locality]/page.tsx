import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import {
  getAllLocalityPaths,
  getLocalityBySlug,
  getProperties,
} from "@/lib/sanity/queries";
import { isLive } from "@/lib/env";
import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyCard } from "@/components/property/PropertyCard";
import { EmptyResults } from "@/components/property/EmptyResults";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";

export const revalidate = 3600;

/**
 * Locality landing pages — /in/gurugram/golf-course-road.
 *
 * These live under /in rather than /properties/[city]/[locality] because
 * Next.js cannot have two differently-named dynamic segments ([slug] and
 * [city]) at the same position in one route tree.
 */

export async function generateStaticParams() {
  const paths = await getAllLocalityPaths();
  return paths.map((p) => ({ city: p.city, locality: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}): Promise<Metadata> {
  const { city, locality } = await params;
  const area = await getLocalityBySlug(city, locality);
  if (!area) return { title: "Area not found" };

  return {
    title: `Property in ${area.name}, ${area.city}`,
    description:
      area.blurb ||
      `Glass-File-verified property for sale in ${area.name}, ${area.city}. Title chain, dues, litigation scan and builder record checked before any listing reaches this page.`,
    robots: isLive ? undefined : { index: false, follow: true },
    alternates: { canonical: `/in/${city}/${locality}` },
  };
}

export default async function LocalityPage({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}) {
  const { city, locality } = await params;
  const area = await getLocalityBySlug(city, locality);
  if (!area) notFound();

  const { items } = await getProperties({ locality, city, page: 1 });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Properties", href: "/properties" },
          { name: area.city, href: `/properties?city=${city}` },
          { name: area.name, href: `/in/${city}/${locality}` },
        ]}
      />

      <PageHeader
        eyebrow={`${area.city} · Locality guide`}
        title={`Property in ${area.name}.`}
        intro={area.blurb}
      />

      <div className="mx-auto max-w-[1400px] px-5 pb-24 lg:px-10 lg:pb-32">
        {items.length ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6.5">
              {items.map((p, i) => (
                <PropertyCard key={p._id} property={p} priority={i < 3} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <ButtonLink href={`/properties?city=${city}`} variant="outline" size="lg">
                See everything in {area.city} →
              </ButtonLink>
            </div>
          </>
        ) : (
          <EmptyResults summary={`property in ${area.name}, ${area.city}`} />
        )}

        {area.body && area.body.length > 0 && (
          <section className="mx-auto mt-20 max-w-3xl text-[16px] leading-[1.85] text-ivory/65 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ivory [&_p]:mb-4">
            <PortableText value={area.body} />
          </section>
        )}
      </div>
    </>
  );
}
