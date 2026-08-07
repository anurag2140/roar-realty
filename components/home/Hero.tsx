import Link from "next/link";
import { Scene3D, HeroFallback } from "@/components/three/Scene3D";
import { CountUp } from "@/components/ui/CountUp";
import { DEFAULT_HOMEPAGE } from "@/lib/content/defaults";
import type { Homepage } from "@/lib/sanity/types";

export function Hero({
  data,
  effects3d = true,
}: {
  data: Homepage | null;
  effects3d?: boolean;
}) {
  const d = DEFAULT_HOMEPAGE;
  const stats = data?.heroStats?.length ? data.heroStats : d.heroStats;

  return (
    <header
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <Scene3D
        kind="hero"
        enabled={effects3d}
        className="absolute inset-0"
        fallback={<HeroFallback />}
      />

      {/* Bottom vignette so the headline always has contrast over the scene. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(10,9,7,0) 0%, rgba(10,9,7,.3) 70%, rgba(10,9,7,.92) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-45"
        style={{ background: "linear-gradient(180deg, #0A0907, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-12 lg:px-10 lg:pb-16">
        <div className="mb-6 flex items-center gap-4">
          <span aria-hidden className="block h-px w-13 bg-gold" />
          <span className="text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
            {data?.heroEyebrow || d.heroEyebrow}
          </span>
        </div>

        <h1 className="m-0 mb-2.5 font-display text-[clamp(2.75rem,8.2vw,8rem)] leading-[0.98] tracking-[0.005em] text-balance text-ivory">
          {data?.heroLine1 || d.heroLine1}
          <br />
          <span className="roar-shimmer">{data?.heroLine2 || d.heroLine2}</span>
        </h1>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <p className="m-0 max-w-[520px] text-base leading-[1.75] text-ivory/60 sm:text-[18px]">
            {data?.heroBody || d.heroBody}
          </p>
          {/* Primary CTA is the property file, not the listings page — the
              listings are hidden until real inventory exists, and "request a
              file" is the conversion the whole brand is built around. */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-3.5 px-8 py-4 text-[13px] font-medium tracking-[0.22em] whitespace-nowrap text-ink uppercase no-underline transition-all hover:-translate-y-0.5 hover:brightness-110 sm:px-8.5 sm:py-[18px] sm:text-sm"
            style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
          >
            Request a property file <span aria-hidden className="text-lg">→</span>
          </Link>
        </div>

        <div className="roar-hairline mt-12 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px sm:mt-14">
          {stats.map((stat, i) => (
            <div
              key={stat.label + i}
              className="bg-ink/72 px-5 py-5 backdrop-blur-sm sm:px-6.5"
            >
              <div className="font-display text-[28px] text-gold-hi sm:text-[34px]">
                {stat.countTo ? (
                  <CountUp
                    to={stat.countTo}
                    display={stat.value}
                    suffix={stat.suffix ?? ""}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <div className="mt-1.5 text-[11px] tracking-[0.24em] text-ivory/45 uppercase sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <span
          className="block h-8.5 w-px"
          style={{
            background: "linear-gradient(180deg, var(--gold), transparent)",
            animation: "var(--animate-scroll-cue)",
          }}
        />
      </div>
    </header>
  );
}
