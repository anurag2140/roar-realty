import Link from "next/link";
import { DEFAULT_HOMEPAGE } from "@/lib/content/defaults";
import type { Homepage } from "@/lib/sanity/types";

/**
 * The two market doors. Dubai is deliberately the larger panel — the content
 * plan puts 60–70% of the business there, and the layout should say so before
 * anyone reads a word.
 */
export function Doors({ data }: { data: Homepage | null }) {
  const d = DEFAULT_HOMEPAGE;
  const doors = data?.doors?.length ? data.doors : d.doors;

  return (
    <section
      aria-labelledby="doors-heading"
      className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-28"
    >
      <div className="roar-reveal mb-12 max-w-[640px]">
        <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
          {data?.doorsEyebrow || d.doorsEyebrow}
        </div>
        <h2
          id="doors-heading"
          className="m-0 font-display text-[clamp(2.125rem,4.2vw,3.5rem)] leading-[1.06] text-ivory"
        >
          {data?.doorsHeading || d.doorsHeading}
        </h2>
      </div>

      <div className="grid gap-5.5 lg:grid-cols-[1.65fr_1fr]">
        {doors.map((door, i) => (
          <article
            key={i}
            className={`roar-reveal group relative flex flex-col justify-between overflow-hidden border p-8 transition-all duration-300 hover:-translate-y-1 lg:p-10 ${
              i === 0
                ? "border-gold/35 bg-gradient-to-br from-gold/8 to-transparent hover:border-gold-hi/70"
                : "border-gold/20 bg-ink-2 hover:border-gold-hi/50"
            }`}
          >
            <div>
              <div className="mb-4 text-[11px] tracking-[0.28em] text-gold uppercase">
                {door.market}
              </div>
              <h3
                className={`m-0 mb-5 font-display leading-[1.1] text-ivory ${
                  i === 0 ? "text-[clamp(1.75rem,3vw,2.5rem)]" : "text-[clamp(1.5rem,2.4vw,2rem)]"
                }`}
              >
                {door.heading}
              </h3>
              <p
                className={`m-0 leading-[1.8] text-ivory/60 ${
                  i === 0 ? "max-w-[52ch] text-[17px]" : "text-[15px]"
                }`}
              >
                {door.body}
              </p>
            </div>

            <Link
              href={door.href}
              className="mt-8 inline-flex items-center gap-3 self-start text-[12px] tracking-[0.24em] text-gold-hi uppercase no-underline transition-all group-hover:gap-5 after:absolute after:inset-0 after:content-['']"
            >
              {door.cta} <span aria-hidden>→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
