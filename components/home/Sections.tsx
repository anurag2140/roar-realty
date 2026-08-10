import Link from "next/link";
import { Scene3D, GoldFallback } from "@/components/three/Scene3D";
import { DEFAULT_HOMEPAGE } from "@/lib/content/defaults";
import type { Homepage } from "@/lib/sanity/types";

/* ---------------- The Roar Standard ---------------- */

export function StandardSection({
  data,
  effects3d = true,
}: {
  data: Homepage | null;
  effects3d?: boolean;
}) {
  const d = DEFAULT_HOMEPAGE;
  const pillars = data?.pillars?.length ? data.pillars : d.pillars;

  return (
    <section id="standard" className="relative overflow-hidden px-5 py-24 lg:px-10 lg:py-[140px]">
      <Scene3D
        kind="gold"
        enabled={effects3d}
        intensity={0.9}
        className="absolute inset-0 opacity-85"
        fallback={<GoldFallback intensity={0.9} />}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(10,9,7,.05), rgba(10,9,7,.88) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="roar-reveal mx-auto mb-14 max-w-[820px] text-center lg:mb-18">
          <div className="mb-3.5 font-serif text-[30px] italic text-gold">
            {data?.standardLabel || d.standardLabel}
          </div>
          <h2 className="m-0 mb-5.5 font-display text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[1.04] text-balance text-ivory">
            {data?.standardHeading || d.standardHeading}
          </h2>
          <p className="m-0 text-base leading-[1.75] text-ivory/60 sm:text-[18px]">
            {data?.standardBody || d.standardBody}
          </p>
        </div>

        <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5.5 p-0">
          {pillars.map((p, i) => (
            <li
              key={i}
              className="roar-reveal relative border border-gold/20 bg-ink-2/78 p-8 backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-1 hover:border-gold-hi/60"
            >
              <div className="mb-4.5 font-serif text-xl italic text-gold">{p.num}</div>
              <h3 className="mb-3.5 font-display text-[26px] leading-tight text-ivory">
                {p.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.7] text-ivory/55">{p.body}</p>
              <span
                aria-hidden
                className="absolute top-0 right-0 h-8.5 w-8.5 border-b border-l border-gold/20"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */

export function ProcessSection({ data }: { data: Homepage | null }) {
  const d = DEFAULT_HOMEPAGE;
  const steps = data?.steps?.length ? data.steps : d.steps;

  return (
    <section
      id="process"
      className="relative mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:pt-30 lg:pb-35"
    >
      <div className="roar-reveal mb-14 max-w-[720px] lg:mb-18">
        <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
          {data?.processEyebrow || d.processEyebrow}
        </div>
        <h2 className="m-0 font-display text-[clamp(2.125rem,4.2vw,4rem)] leading-[1.06] text-balance text-ivory">
          {data?.processHeading || d.processHeading}
        </h2>
      </div>

      <ol className="m-0 flex list-none flex-col p-0">
        {steps.map((s, i) => (
          <li
            key={i}
            className="roar-reveal grid items-baseline gap-3 border-t border-gold/20 py-7 transition-colors hover:bg-gold/5 lg:grid-cols-[minmax(70px,120px)_minmax(180px,1fr)_minmax(240px,1.3fr)] lg:gap-10 lg:py-9.5"
          >
            <div className="font-serif text-[38px] leading-none italic text-gold lg:text-[46px]">
              {s.num}
            </div>
            <h3 className="font-display text-[26px] leading-tight text-ivory lg:text-[30px]">
              {s.title}
            </h3>
            <p className="m-0 text-[15px] leading-[1.75] text-ivory/55 lg:text-base">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
      <div className="border-t border-gold/20" />
    </section>
  );
}

/* ---------------- Comparison ---------------- */

export function ComparisonSection({ data }: { data: Homepage | null }) {
  const d = DEFAULT_HOMEPAGE;
  const rows = data?.compareRows?.length ? data.compareRows : d.compareRows;

  return (
    <section className="mx-auto max-w-[1200px] px-5 py-24 lg:px-10 lg:py-[130px]">
      <div className="roar-reveal mx-auto mb-14 max-w-[700px] text-center lg:mb-16">
        <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
          {data?.compareEyebrow || d.compareEyebrow}
        </div>
        <h2 className="m-0 font-display text-[clamp(2.125rem,4.2vw,4rem)] leading-[1.06] text-balance text-ivory">
          {data?.compareHeading || d.compareHeading}
        </h2>
      </div>

      <div className="roar-reveal border border-gold/20">
        {/* Column headers are hidden on mobile, where each row stacks and
            carries its own labels instead. */}
        <div className="hidden grid-cols-[1.1fr_1fr_1fr] border-b border-gold/20 bg-gold/8 lg:grid">
          <div className="px-7 py-5" />
          <div className="border-l border-gold/20 px-7 py-5 text-xs tracking-[0.28em] text-ivory/45 uppercase">
            The typical broker
          </div>
          <div className="border-l border-gold/40 bg-gold/6 px-7 py-5 text-xs tracking-[0.28em] text-gold-hi uppercase">
            The Roar way
          </div>
        </div>

        {rows.map((r, i) => (
          <div
            key={i}
            className="grid border-b border-gold/15 last:border-b-0 lg:grid-cols-[1.1fr_1fr_1fr]"
          >
            <div className="px-6 pt-5 pb-2 font-display text-lg text-ivory lg:px-7 lg:py-5.5">
              {r.label}
            </div>
            <div className="px-6 py-2 text-[14.5px] leading-relaxed text-ivory/45 lg:border-l lg:border-gold/15 lg:px-7 lg:py-5.5">
              <span className="mb-1 block text-[10px] tracking-[0.22em] text-ivory/30 uppercase lg:hidden">
                Typical broker
              </span>
              {r.old}
            </div>
            <div className="bg-gold/5 px-6 pt-2 pb-5 text-[14.5px] leading-relaxed text-ivory lg:border-l lg:border-gold/30 lg:px-7 lg:py-5.5">
              <span className="mb-1 block text-[10px] tracking-[0.22em] text-gold uppercase lg:hidden">
                The Roar way
              </span>
              {r.roar}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Founder ---------------- */

export function FounderBlock({ data }: { data: Homepage | null }) {
  const d = DEFAULT_HOMEPAGE;
  return (
    <section
      aria-labelledby="founder-heading"
      className="border-t border-gold/15 px-5 py-24 lg:px-10 lg:py-28"
    >
      <div className="roar-reveal mx-auto max-w-3xl text-center">
        <h2
          id="founder-heading"
          className="m-0 font-display text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.12] text-balance text-ivory"
        >
          {data?.founderHeading || d.founderHeading}
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-[1.85] text-ivory/60">
          {data?.founderBody || d.founderBody}
        </p>
        <Link
          href="/about"
          className="mt-9 inline-flex min-h-11 items-center gap-3 py-2 text-[12px] tracking-[0.26em] text-gold-hi uppercase no-underline transition-all hover:gap-5"
        >
          {data?.founderCta || d.founderCta} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Portfolio heading + CTA ---------------- */

export function PortfolioHeader({ data, total }: { data: Homepage | null; total: number }) {
  const d = DEFAULT_HOMEPAGE;
  return (
    <div className="roar-reveal mb-10 flex flex-wrap items-end justify-between gap-7 lg:mb-12">
      <div>
        <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
          {data?.portfolioEyebrow || d.portfolioEyebrow}
        </div>
        <h2 className="m-0 font-display text-[clamp(2.125rem,4.2vw,4rem)] leading-[1.06] text-ivory">
          {data?.portfolioHeading || d.portfolioHeading}
        </h2>
      </div>
      <div className="max-w-[420px]">
        <p className="m-0 text-[15px] leading-relaxed text-ivory/50">
          {data?.portfolioBody || d.portfolioBody}
        </p>
        <Link
          href="/properties"
          className="mt-4 inline-flex items-center gap-2.5 text-[12px] tracking-[0.26em] text-gold-hi uppercase no-underline transition-all hover:gap-4"
        >
          Search all {total} properties <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
