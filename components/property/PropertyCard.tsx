"use client";

import Link from "next/link";
import { imageSrcSet, imageUrl } from "@/lib/sanity/image";
import { formatArea, formatPriceCr } from "@/lib/site";
import type { Property } from "@/lib/sanity/types";
import { useShortlist } from "@/components/shortlist/ShortlistProvider";
import { useEnquiry } from "@/components/popups/EnquiryProvider";
import { useToast } from "@/components/ui/Toast";

export function PropertyCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const { has, toggle, ready } = useShortlist();
  const { requestGlassFile } = useEnquiry();
  const { toast } = useToast();

  const cover = property.images?.[0];
  const src = imageUrl(cover, 640, 500);
  const srcSet = imageSrcSet(cover, [400, 640, 828, 1080], 640 / 500);
  const saved = ready && has(property._id);

  const specs = [
    property.bedrooms ? `${property.bedrooms} BHK` : null,
    property.carpetArea
      ? `${formatArea(property.carpetArea, property.areaUnit)} carpet`
      : property.plotArea
        ? `${formatArea(property.plotArea, property.areaUnit)} plot`
        : null,
  ].filter(Boolean) as string[];

  return (
    <article className="group flex flex-col border border-gold/20 bg-ink transition-all duration-300 hover:-translate-y-1 hover:border-gold-hi/55">
      <div className="relative overflow-hidden">
        <Link href={`/properties/${property.slug}`} className="block" tabIndex={-1} aria-hidden>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              srcSet={srcSet ?? undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt=""
              width={640}
              height={500}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              className="h-[250px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-[250px] w-full items-center justify-center bg-gradient-to-br from-ink-2 to-ink text-xs tracking-[0.2em] text-gold/40 uppercase">
              Photo coming soon
            </div>
          )}
        </Link>

        {property.tag && (
          <span className="absolute top-3.5 left-3.5 border border-gold/35 bg-ink/80 px-3 py-1.5 text-[11px] tracking-[0.22em] text-gold-hi uppercase backdrop-blur-sm">
            {property.tag}
          </span>
        )}

        {property.illustrative && (
          <span className="absolute top-3.5 right-14 border border-dashed border-gold/50 bg-ink/85 px-2.5 py-1 text-[10px] tracking-[0.18em] text-gold/80 uppercase">
            Sample
          </span>
        )}

        <button
          type="button"
          aria-label={saved ? `Remove ${property.name} from shortlist` : `Save ${property.name} to shortlist`}
          aria-pressed={saved}
          onClick={() => {
            const added = toggle(property._id);
            toast(added ? "Saved to your shortlist." : "Removed from your shortlist.", "success");
          }}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center border border-gold/30 bg-ink/80 backdrop-blur-sm transition-colors hover:border-gold-hi"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={saved ? "var(--goldhi)" : "none"}
            stroke={saved ? "var(--goldhi)" : "currentColor"}
            strokeWidth="1.6"
            className="text-ivory/70"
            aria-hidden
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-6 pb-7">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[23px] leading-tight text-ivory">
            <Link
              href={`/properties/${property.slug}`}
              className="no-underline transition-colors after:absolute after:inset-0 after:content-[''] hover:text-gold-hi"
            >
              {property.name}
            </Link>
          </h3>
          <div className="font-display text-[19px] whitespace-nowrap text-gold-hi">
            {property.priceOnRequest ? "On request" : formatPriceCr(property.priceCr)}
          </div>
        </div>

        <div className="text-[13px] tracking-[0.14em] text-ivory/45 uppercase">
          {[property.locality, property.city].filter(Boolean).join(", ")}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gold/15 pt-4 text-[13px] text-ivory/55">
          {specs.map((s, i) => (
            <span key={s} className="flex items-center gap-4">
              {i > 0 && <span className="text-gold/50">·</span>}
              {s}
            </span>
          ))}
          {property.possessionStatus && (
            <>
              <span className="text-gold/50">·</span>
              <span className="text-gold">
                {property.possessionStatus === "Under construction" && property.possessionDate
                  ? property.possessionDate
                  : property.possessionStatus}
              </span>
            </>
          )}
        </div>

        {/* Sits above the card-wide link overlay so it stays clickable. */}
        <button
          type="button"
          onClick={() =>
            requestGlassFile({
              id: property._id,
              name: property.name,
              slug: property.slug,
            })
          }
          className="relative z-10 mt-3.5 inline-flex items-center gap-2.5 self-start text-[12px] tracking-[0.26em] text-gold-hi uppercase transition-all hover:gap-4"
        >
          Request Glass File <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
}
