"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { imageUrl } from "@/lib/sanity/image";
import type { Testimonial } from "@/lib/sanity/types";

/**
 * Scrolling testimonial carousel, built to carry hundreds of entries.
 *
 * Uses native scroll-snap rather than a JS transform track: it stays smooth
 * with 300+ cards, gives free touch/trackpad swiping, and degrades to a plain
 * horizontal scroller if JS never runs.
 */
export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [region, setRegion] = useState<string>("All");
  const trackRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  const regions = useMemo(() => {
    const set = new Set(items.map((t) => t.region).filter(Boolean) as string[]);
    return ["All", ...[...set].sort()];
  }, [items]);

  const visible = useMemo(
    () => (region === "All" ? items : items.filter((t) => t.region === region)),
    [items, region]
  );

  const anyIllustrative = visible.some((t) => t.illustrative);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 22 : 340;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  // Gentle autoplay. Pauses on hover, focus, touch, when the tab is hidden,
  // and for anyone who has asked for reduced motion.
  useEffect(() => {
    if (paused || visible.length < 3) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el || document.hidden) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else scrollByCards(1);
    }, 5000);

    return () => window.clearInterval(id);
  }, [paused, visible.length, scrollByCards]);

  if (!items.length) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="mx-auto max-w-[1400px] px-5 pt-10 pb-24 lg:px-10 lg:pb-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-3 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
            In their words
          </div>
          <h2
            id="testimonials-heading"
            className="m-0 font-display text-[clamp(1.875rem,3.6vw,3rem)] leading-tight text-ivory"
          >
            {items.length >= 20
              ? `${items.length} clients, one standard.`
              : "What clients actually say."}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Previous testimonials"
            className="flex h-10 w-10 items-center justify-center border border-gold/30 text-lg text-ivory/70 transition-colors hover:border-gold-hi hover:text-gold-hi"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Next testimonials"
            className="flex h-10 w-10 items-center justify-center border border-gold/30 text-lg text-ivory/70 transition-colors hover:border-gold-hi hover:text-gold-hi"
          >
            ›
          </button>
        </div>
      </div>

      {regions.length > 2 && (
        <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label="Filter by region">
          {regions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              aria-pressed={region === r}
              className={`px-4 py-2 text-[11px] tracking-[0.18em] uppercase transition-all ${
                region === r
                  ? "border border-transparent text-ink"
                  : "border border-gold/25 text-ivory/55 hover:border-gold-hi/60"
              }`}
              style={
                region === r
                  ? { background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }
                  : undefined
              }
            >
              {r}
            </button>
          ))}
        </div>
      )}

      <ul
        ref={trackRef}
        className="roar-scrollbar -mx-1 flex snap-x snap-mandatory list-none gap-5.5 overflow-x-auto scroll-smooth px-1 pb-4"
        tabIndex={0}
        aria-label="Client testimonials"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollByCards(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollByCards(-1);
          }
        }}
      >
        {visible.map((q) => {
          const avatar = imageUrl(q.avatar, 96, 96);
          return (
            <li
              key={q._id}
              className="flex w-[min(340px,82vw)] shrink-0 snap-start flex-col gap-5 border border-gold/20 bg-ink-2 p-7"
            >
              <div className="flex items-center justify-between">
                <span aria-hidden className="font-serif text-[52px] leading-[0.4] text-gold">
                  &ldquo;
                </span>
                {q.rating ? (
                  <span className="text-xs tracking-[0.2em] text-gold-hi" aria-label={`${q.rating} out of 5`}>
                    {"★".repeat(Math.round(q.rating))}
                  </span>
                ) : null}
              </div>

              <blockquote className="m-0 font-serif text-[19px] leading-[1.5] italic text-ivory">
                {q.quote}
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 not-italic">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <span className="min-w-0">
                  <span className="block truncate text-sm text-gold-hi">{q.name}</span>
                  <span className="mt-0.5 block text-[11px] tracking-[0.16em] text-ivory/40 uppercase">
                    {[q.role, q.region].filter(Boolean).join(" · ")}
                  </span>
                  {q.agent && (
                    <span className="mt-0.5 block text-[11px] text-ivory/30">
                      Handled by {q.agent}
                    </span>
                  )}
                </span>
              </figcaption>
            </li>
          );
        })}
      </ul>

      {anyIllustrative && (
        <p className="mt-5 text-center text-[11px] tracking-[0.16em] text-ivory/30 uppercase">
          Placeholder testimonials — replace with real, consented client quotes before launch
        </p>
      )}
    </section>
  );
}
