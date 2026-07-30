import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import {
  getAllPropertySlugs,
  getPropertyBySlug,
  getSimilarProperties,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { imageUrl } from "@/lib/sanity/image";
import { contact, isLive } from "@/lib/env";
import { formatArea, formatNumber, formatPriceCr } from "@/lib/site";
import { Gallery } from "@/components/property/Gallery";
import { GlassFilePanel } from "@/components/property/GlassFilePanel";
import { PropertyActions } from "@/components/property/PropertyActions";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BreadcrumbJsonLd, PropertyJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) return { title: "Property not found" };

  const place = [p.locality, p.city].filter(Boolean).join(", ");
  const price = p.priceOnRequest ? "Price on request" : formatPriceCr(p.priceCr);
  const og = imageUrl(p.seo?.ogImage ?? p.images?.[0], 1200, 630);

  return {
    title: p.seo?.title || `${p.name}, ${place} — ${price}`,
    description:
      p.seo?.description ||
      p.summary ||
      `${p.name} in ${place}. ${price}. Glass-File verified: title chain, dues, litigation scan and builder record checked before listing.`,
    // Sample listings must never be indexed as though they were real stock.
    robots:
      p.illustrative || p.seo?.noIndex || !isLive
        ? { index: false, follow: true }
        : undefined,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: {
      type: "article",
      title: `${p.name} — ${price}`,
      description: p.summary ?? undefined,
      url: `/properties/${p.slug}`,
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const [similar, settings] = await Promise.all([
    getSimilarProperties(property, 3),
    getSiteSettings(),
  ]);

  const place = [property.locality, property.city].filter(Boolean).join(", ");
  const price = property.priceOnRequest
    ? "Price on request"
    : formatPriceCr(property.priceCr);

  const specs: { label: string; value: string }[] = [
    property.bedrooms ? { label: "Bedrooms", value: `${property.bedrooms} BHK` } : null,
    property.bathrooms ? { label: "Bathrooms", value: String(property.bathrooms) } : null,
    property.carpetArea
      ? { label: "Carpet area", value: formatArea(property.carpetArea, property.areaUnit) }
      : null,
    property.superBuiltUpArea
      ? {
          label: "Super built-up",
          value: formatArea(property.superBuiltUpArea, property.areaUnit),
        }
      : null,
    property.plotArea
      ? { label: "Plot area", value: formatArea(property.plotArea, property.areaUnit) }
      : null,
    property.possessionStatus
      ? { label: "Possession", value: property.possessionDate || property.possessionStatus }
      : null,
    property.facing ? { label: "Facing", value: property.facing } : null,
    property.floor
      ? {
          label: "Floor",
          value: property.totalFloors
            ? `${property.floor} of ${property.totalFloors}`
            : property.floor,
        }
      : null,
    property.furnishing ? { label: "Furnishing", value: property.furnishing } : null,
    property.parking ? { label: "Parking", value: `${property.parking} spaces` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // Carpet vs super built-up is the company's Rule 03 made concrete — show the
  // gap in plain numbers rather than claiming it in prose.
  const areaGap =
    property.carpetArea && property.superBuiltUpArea
      ? Math.round(
          ((property.superBuiltUpArea - property.carpetArea) / property.superBuiltUpArea) * 100
        )
      : null;

  return (
    <>
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Properties", href: "/properties" },
          { name: property.name, href: `/properties/${property.slug}` },
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-24 lg:px-10 lg:pb-32">
        <nav aria-label="Breadcrumb" className="mb-6 text-[11px] tracking-[0.16em] uppercase">
          <ol className="flex flex-wrap items-center gap-2 text-ivory/40">
            <li>
              <Link href="/" className="no-underline hover:text-gold-hi">Home</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/properties" className="no-underline hover:text-gold-hi">Properties</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ivory/70">{property.name}</li>
          </ol>
        </nav>

        {property.illustrative && (
          <p className="mb-6 border border-dashed border-gold/40 bg-gold/5 px-5 py-3 text-[12px] tracking-[0.14em] text-gold/85 uppercase">
            ⚠ Illustrative sample listing — not currently available inventory
          </p>
        )}

        <Gallery images={property.images ?? []} name={property.name} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-14">
          {/* ---------------- Main column ---------------- */}
          <div className="min-w-0">
            <header>
              {property.tag && (
                <span className="mb-4 inline-block border border-gold/35 px-3 py-1.5 text-[11px] tracking-[0.22em] text-gold-hi uppercase">
                  {property.tag}
                </span>
              )}
              <h1 className="m-0 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.06] text-balance text-ivory">
                {property.name}
              </h1>
              <p className="mt-3 text-[13px] tracking-[0.16em] text-ivory/50 uppercase">
                {place}
              </p>
              <p className="mt-5 font-display text-[32px] text-gold-hi lg:hidden">{price}</p>
            </header>

            {property.summary && (
              <p className="mt-7 max-w-2xl text-[17px] leading-[1.8] text-ivory/65">
                {property.summary}
              </p>
            )}

            {specs.length > 0 && (
              <section aria-labelledby="specs-heading" className="mt-10">
                <h2 id="specs-heading" className="sr-only">Specifications</h2>
                <dl className="roar-hairline grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4">
                  {specs.map((s) => (
                    <div key={s.label} className="bg-ink px-5 py-4">
                      <dt className="text-[10px] tracking-[0.22em] text-ivory/40 uppercase">
                        {s.label}
                      </dt>
                      <dd className="m-0 mt-1.5 font-display text-lg text-ivory">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {areaGap !== null && (
              <div className="mt-6 border-l-2 border-gold px-5 py-4">
                <p className="m-0 text-sm leading-relaxed text-ivory/60">
                  We quote on <strong className="text-ivory">carpet area</strong>:{" "}
                  {formatNumber(property.carpetArea!)} {property.areaUnit || "sq ft"}. The
                  super built-up figure of {formatNumber(property.superBuiltUpArea!)} includes{" "}
                  <strong className="text-gold-hi">{areaGap}%</strong> of walls, lobbies and
                  common area you will not live in.
                </p>
              </div>
            )}

            {property.body && property.body.length > 0 && (
              <div className="prose-roar mt-10 max-w-2xl text-[16px] leading-[1.8] text-ivory/65 [&_a]:text-gold-hi [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ivory [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ivory [&_li]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
                <PortableText value={property.body} />
              </div>
            )}

            {property.highlights?.length ? (
              <section aria-labelledby="highlights-heading" className="mt-10">
                <h2 id="highlights-heading" className="mb-4 font-display text-2xl text-ivory">
                  Highlights
                </h2>
                <ul className="grid list-none gap-2.5 p-0 sm:grid-cols-2">
                  {property.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-[15px] text-ivory/65">
                      <span aria-hidden className="mt-1.5 text-gold">✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-12">
              <GlassFilePanel glassFile={property.glassFile} />
            </div>

            {property.priceBreakdown?.length ? (
              <section aria-labelledby="price-heading" className="mt-12">
                <h2 id="price-heading" className="mb-4 font-display text-2xl text-ivory">
                  What you actually pay
                </h2>
                <table className="w-full border-collapse border border-gold/20 text-left">
                  <tbody>
                    {property.priceBreakdown.map((row) => (
                      <tr key={row._key} className="border-b border-gold/12 last:border-b-0">
                        <th scope="row" className="px-5 py-3.5 text-sm font-normal text-ivory/70">
                          {row.label}
                          {row.note && (
                            <span className="mt-0.5 block text-xs text-ivory/35">{row.note}</span>
                          )}
                        </th>
                        <td className="px-5 py-3.5 text-right font-display text-lg whitespace-nowrap text-gold-hi">
                          {row.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : null}

            {property.amenities?.length ? (
              <section aria-labelledby="amenities-heading" className="mt-12">
                <h2 id="amenities-heading" className="mb-4 font-display text-2xl text-ivory">
                  Amenities
                </h2>
                <ul className="flex list-none flex-wrap gap-2.5 p-0">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="border border-gold/20 px-4 py-2 text-[13px] text-ivory/65"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {property.floorPlans?.length ? (
              <section aria-labelledby="plans-heading" className="mt-12">
                <h2 id="plans-heading" className="mb-4 font-display text-2xl text-ivory">
                  Floor plans
                </h2>
                <Gallery images={property.floorPlans} name={`${property.name} floor plan`} />
              </section>
            ) : null}

            {property.geo && (
              <section aria-labelledby="location-heading" className="mt-12">
                <h2 id="location-heading" className="mb-4 font-display text-2xl text-ivory">
                  Location
                </h2>
                {property.address && (
                  <p className="mb-4 text-[15px] text-ivory/60">{property.address}</p>
                )}
                <PropertyMap
                  lat={property.geo.lat}
                  lng={property.geo.lng}
                  name={property.name}
                  address={property.address}
                />
              </section>
            )}

            {property.nearby?.length ? (
              <section aria-labelledby="nearby-heading" className="mt-10">
                <h2 id="nearby-heading" className="mb-4 font-display text-xl text-ivory">
                  What&apos;s nearby
                </h2>
                <ul className="roar-hairline grid list-none grid-cols-2 gap-px p-0 sm:grid-cols-3">
                  {property.nearby.map((n) => (
                    <li key={n._key} className="bg-ink px-5 py-3.5">
                      <div className="text-sm text-ivory/70">{n.label}</div>
                      <div className="mt-0.5 text-xs text-gold/70">{n.distance}</div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {property.builder && (
              <section aria-labelledby="builder-heading" className="mt-12 border border-gold/20 p-6">
                <h2 id="builder-heading" className="mb-2 text-[11px] tracking-[0.24em] text-gold uppercase">
                  Developer
                </h2>
                <div className="font-display text-2xl text-ivory">{property.builder.name}</div>
                {property.builder.description && (
                  <p className="mt-3 text-[15px] leading-relaxed text-ivory/55">
                    {property.builder.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-6 text-xs text-ivory/40">
                  {property.builder.established && (
                    <span>Established {property.builder.established}</span>
                  )}
                  {property.builder.projectsDelivered && (
                    <span>{property.builder.projectsDelivered} projects delivered</span>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* ---------------- Sticky sidebar ---------------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-gold/25 bg-ink-2 p-6">
              <div className="hidden lg:block">
                <div className="text-[10px] tracking-[0.24em] text-ivory/40 uppercase">
                  {property.priceOnRequest ? "Guide price" : "Asking price"}
                </div>
                <div className="mt-1 font-display text-[34px] leading-none text-gold-hi">
                  {price}
                </div>
                {property.carpetArea && property.priceCr && (
                  <div className="mt-2 text-xs text-ivory/40">
                    ≈ ₹
                    {formatNumber(
                      Math.round((property.priceCr * 1e7) / property.carpetArea)
                    )}{" "}
                    per {property.areaUnit || "sq ft"} carpet
                  </div>
                )}
                <hr className="my-5 border-gold/15" />
              </div>

              <PropertyActions
                property={property}
                phone={contact.phone || settings?.phone}
                whatsapp={contact.whatsapp || settings?.whatsapp || contact.phone || settings?.phone}
              />
            </div>

            {property.agent && (
              <div className="mt-4 border border-gold/20 p-5">
                <div className="text-[10px] tracking-[0.24em] text-gold uppercase">
                  Your advisor
                </div>
                <div className="mt-2 font-display text-lg text-ivory">
                  {property.agent.name}
                </div>
                <div className="text-xs text-ivory/45">{property.agent.role}</div>
                {property.agent.reraId && (
                  <div className="mt-2 text-[11px] text-ivory/35">
                    RERA {property.agent.reraId}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>

        {similar.length > 0 && (
          <section aria-labelledby="similar-heading" className="mt-20 border-t border-gold/15 pt-14">
            <h2 id="similar-heading" className="mb-8 font-display text-3xl text-ivory">
              Similar properties
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6.5">
              {similar.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
