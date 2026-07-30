import { Scene3D, JourneyFallback } from "@/components/three/Scene3D";
import { DEFAULT_HOMEPAGE } from "@/lib/content/defaults";
import type { Homepage } from "@/lib/sanity/types";

export function ChapterOne({
  data,
  effects3d = true,
}: {
  data: Homepage | null;
  effects3d?: boolean;
}) {
  const d = DEFAULT_HOMEPAGE;
  const paragraphs = data?.chapter1Body?.length ? data.chapter1Body : d.chapter1Body;
  const cards = data?.chapter1Cards?.length ? data.chapter1Cards : d.chapter1Cards;

  return (
    <section
      id="story"
      className="relative mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-[140px]"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-[70px]">
        <div className="roar-reveal">
          <div className="mb-3.5 font-serif text-[30px] italic text-gold">
            {data?.chapter1Label || d.chapter1Label}
          </div>
          <h2 className="m-0 mb-7 font-display text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[1.04] text-balance text-ivory">
            {data?.chapter1Heading || d.chapter1Heading}
          </h2>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="m-0 mb-5 max-w-[560px] text-base leading-[1.8] text-ivory/60 last:mb-8 sm:text-[17px]"
            >
              {p}
            </p>
          ))}

          <div className="roar-hairline flex flex-col gap-px sm:flex-row">
            {cards.map((card, i) => (
              <div key={i} className="flex-1 bg-ink-2 px-5.5 py-5">
                <div className="font-display text-2xl text-gold-hi">{card.title}</div>
                <div className="mt-1.5 text-[13px] leading-relaxed text-ivory/45">
                  {card.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="roar-reveal relative h-[380px] lg:h-[560px]">
          <Scene3D
            kind="journey"
            enabled={effects3d}
            className="absolute inset-0"
            fallback={<JourneyFallback />}
          />
          <div className="absolute bottom-5 left-0 flex items-center gap-3 text-[11px] tracking-[0.3em] text-ivory/45 uppercase sm:text-xs">
            <span
              aria-hidden
              className="block h-2 w-2 rounded-full bg-gold-hi"
              style={{ animation: "var(--animate-pulse-dot)" }}
            />
            Dubai → New Delhi · 2,200 km · one standard
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChapterTwo({ data }: { data: Homepage | null }) {
  const d = DEFAULT_HOMEPAGE;
  const stats = data?.chapter2Stats?.length ? data.chapter2Stats : d.chapter2Stats;

  return (
    <section className="bg-ivory px-5 py-24 text-ivory-ink lg:px-10 lg:py-[130px]">
      <div className="mx-auto max-w-[1400px]">
        <div className="roar-reveal max-w-[760px]">
          <div className="mb-3.5 font-serif text-[30px] italic text-gold-deep">
            {data?.chapter2Label || d.chapter2Label}
          </div>
          <h2 className="m-0 mb-6.5 font-display text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[1.04] text-balance text-ivory-ink">
            {data?.chapter2Heading || d.chapter2Heading}
          </h2>
          <p className="m-0 text-base leading-[1.8] text-ivory-ink/65 sm:text-[18px]">
            {data?.chapter2Body || d.chapter2Body}
          </p>
        </div>

        <div
          className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border sm:mt-16"
          style={{
            background: "rgb(20 18 9 / 0.14)",
            borderColor: "rgb(20 18 9 / 0.14)",
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="roar-reveal bg-ivory px-7 py-8">
              <div className="font-display text-[42px] leading-none text-ivory-ink sm:text-[52px]">
                {stat.value}
              </div>
              <div className="mt-3.5 text-sm leading-relaxed text-ivory-ink/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <blockquote className="roar-reveal m-0 mt-14 max-w-[820px] font-serif text-[clamp(1.625rem,2.6vw,2.375rem)] leading-[1.35] italic text-ivory-ink">
          &ldquo;{data?.chapter2Quote || d.chapter2Quote}&rdquo;
          <footer className="mt-4 font-sans text-[13px] tracking-[0.28em] text-gold-deep uppercase not-italic">
            {data?.chapter2QuoteAttrib || d.chapter2QuoteAttrib}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
