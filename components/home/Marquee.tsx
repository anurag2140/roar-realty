import { DEFAULT_HOMEPAGE } from "@/lib/content/defaults";

/**
 * Infinite scrolling banner. The track holds two identical copies and
 * translates by -50%, so the loop is seamless.
 */
export function Marquee({ items }: { items?: string[] }) {
  const list = items?.length ? items : DEFAULT_HOMEPAGE.marqueeItems;

  return (
    <div
      className="overflow-hidden border-y border-gold/15 bg-ink-2 py-4.5"
      role="marquee"
      aria-label="Our guarantees"
    >
      <div className="flex w-max" style={{ animation: "var(--animate-marquee)" }}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex gap-14 pr-14 font-display text-[13px] tracking-[0.3em] whitespace-nowrap text-gold-hi/55 uppercase sm:text-[15px]"
          >
            {list.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-14">
                {item}
                <span aria-hidden className="text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
