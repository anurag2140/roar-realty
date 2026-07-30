import { siteUrl } from "@/lib/env";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { imageUrl } from "@/lib/sanity/image";
import type { Insight, Property, SiteSettings } from "@/lib/sanity/types";
import { formatPriceCr } from "@/lib/site";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escaping `<` prevents a `</script>` inside CMS text from breaking out.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function OrganizationJsonLd({ settings }: { settings: SiteSettings | null }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/#organization`,
    name: settings?.title || SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    areaServed: [
      { "@type": "City", name: "Gurugram" },
      { "@type": "City", name: "New Delhi" },
      { "@type": "City", name: "Noida" },
    ],
  };

  const logo = imageUrl(settings?.logo, 512, 512);
  if (logo) data.logo = logo;
  if (settings?.phone) data.telephone = settings.phone;
  if (settings?.email) data.email = settings.email;
  if (settings?.officeAddress) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: settings.officeAddress,
      addressCountry: "IN",
    };
  }
  if (settings?.socials?.length) {
    data.sameAs = settings.socials.map((s) => s.url);
  }

  return <JsonLd data={data} />;
}

export function PropertyJsonLd({ property }: { property: Property }) {
  const url = `${siteUrl}/properties/${property.slug}`;
  const images = (property.images ?? [])
    .map((img) => imageUrl(img, 1200))
    .filter((v): v is string => Boolean(v));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    name: property.name,
    url,
    description:
      property.summary ||
      `${property.name} — ${[property.locality, property.city].filter(Boolean).join(", ")}`,
    datePosted: property.publishedAt,
    ...(images.length ? { image: images } : {}),
  };

  if (property.priceCr && !property.priceOnRequest) {
    data.offers = {
      "@type": "Offer",
      // Schema.org wants an absolute figure; the CMS stores crore.
      price: Math.round(property.priceCr * 1e7),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url,
    };
  }

  const address: Record<string, string> = { "@type": "PostalAddress", addressCountry: "IN" };
  if (property.address) address.streetAddress = property.address;
  if (property.locality) address.addressLocality = property.locality;
  if (property.city) address.addressRegion = property.city;

  data.about = {
    "@type": "Residence",
    name: property.name,
    address,
    ...(property.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: property.geo.lat,
            longitude: property.geo.lng,
          },
        }
      : {}),
    ...(property.bedrooms ? { numberOfRooms: property.bedrooms } : {}),
    ...(property.carpetArea
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.carpetArea,
            unitText: property.areaUnit || "sq ft",
          },
        }
      : {}),
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${siteUrl}${item.href}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}

export function ArticleJsonLd({ insight }: { insight: Insight }) {
  const url = `${siteUrl}/insights/${insight.slug}`;
  const cover = imageUrl(insight.cover, 1200);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: insight.title,
        description: insight.excerpt,
        datePublished: insight.publishedAt,
        url,
        ...(cover ? { image: [cover] } : {}),
        author: {
          "@type": insight.author ? "Person" : "Organization",
          name: insight.author?.name || SITE_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          "@id": `${siteUrl}/#organization`,
        },
      }}
    />
  );
}

/** Exported for the price-summary line in listing meta descriptions. */
export const priceLabel = formatPriceCr;
