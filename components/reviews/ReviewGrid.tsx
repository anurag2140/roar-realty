"use client";

import { useMemo, useState } from "react";
import { imageUrl } from "@/lib/sanity/image";
import type { Testimonial } from "@/lib/sanity/types";

/**
 * Full reviews listing. A masonry-ish grid rather than a carousel, because on
 * this page the visitor came to read them rather than glance at them.
 */
export function ReviewGrid({ reviews }: { reviews: Testimonial[] }) {
  const [region, setRegion] = useState("All");
  const [market, setMarket] = useState("All");

  const regions = useMemo(
    () => ["All", ...[...new Set(reviews.map((r) => r.region).filter(Boolean) as string[])].sort()],
    [reviews]
  );
  const markets = useMemo(
    () => ["All", ...[...new Set(reviews.map((r) => r.market).filter(Boolean) as string[])].sort()],
    [reviews]
  );

  const visible = reviews.filter(
    (r) =>
      (region === "All" || r.region === region) &&
      (market === "All" || r.market === market)
  );

  if (!reviews.length) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-20 text-center lg:px-10">
        <div className="border border-dashed border-gold/25 px-6 py-14">
          <p className="m-0 text-[15px] leading-relaxed text-ivory/50">
            No reviews published yet. If we&apos;ve worked together, yours would
            be the first, and it would carry more weight than any marketing copy
            on this site.
          </p>
          <a
            href="#write"
            className="mt-6 inline-flex min-h-11 items-center gap-3 text-[12px] tracking-[0.24em] text-gold-hi uppercase no-underline"
          >
            Write the first one <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-20 lg:px-10">
      {(regions.length > 2 || markets.length > 2) && (
        <div className="mb-9 flex flex-col gap-4">
          {regions.length > 2 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] tracking-[0.24em] text-ivory/35 uppercase">
                Based in
              </span>
              {regions.map((r) => (
                <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
                  {r}
                </Chip>
              ))}
            </div>
          )}
          {markets.length > 2 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] tracking-[0.24em] text-ivory/35 uppercase">
                Bought in
              </span>
              {markets.map((m) => (
                <Chip key={m} active={market === m} onClick={() => setMarket(m)}>
                  {m}
                </Chip>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="mb-6 text-[13px] text-ivory/40" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? "review" : "reviews"}
      </p>

      <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => {
          const avatar = imageUrl(r.avatar, 96, 96);
          return (
            <li
              key={r._id}
              className="roar-reveal flex flex-col gap-4 border border-gold/20 bg-ink-2 p-6"
            >
              <div className="flex items-center justify-between">
                {r.rating ? (
                  <span
                    className="text-sm tracking-[0.16em] text-gold-hi"
                    aria-label={`${r.rating} out of 5`}
                  >
                    {"★".repeat(r.rating)}
                    <span className="text-ivory/15">{"★".repeat(5 - r.rating)}</span>
                  </span>
                ) : (
                  <span />
                )}
                {r.market && (
                  <span className="text-[10px] tracking-[0.2em] text-gold/60 uppercase">
                    {r.market}
                  </span>
                )}
              </div>

              <blockquote className="m-0 font-serif text-[18px] leading-[1.55] italic text-ivory/90">
                {r.quote}
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 border-t border-gold/12 pt-4 not-italic">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/25 font-display text-sm text-gold/70"
                  >
                    {r.name.charAt(0)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm text-gold-hi">{r.name}</span>
                  <span className="block text-[11px] tracking-[0.14em] text-ivory/40 uppercase">
                    {[r.role, r.region].filter(Boolean).join(" · ") || "Client"}
                  </span>
                </span>
              </figcaption>

              {r.illustrative && (
                <p className="m-0 border-t border-dashed border-gold/25 pt-3 text-[10px] tracking-[0.16em] text-gold/60 uppercase">
                  Placeholder, not a real client
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-9 px-3.5 py-2 text-[11px] tracking-[0.16em] uppercase transition-all ${
        active
          ? "border border-transparent text-ink"
          : "border border-gold/25 text-ivory/55 hover:border-gold-hi/60"
      }`}
      style={
        active
          ? { background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }
          : undefined
      }
    >
      {children}
    </button>
  );
}
