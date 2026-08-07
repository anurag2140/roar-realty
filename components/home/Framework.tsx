import { DEFAULT_HOMEPAGE } from "@/lib/content/defaults";
import type { Homepage } from "@/lib/sanity/types";

/**
 * "How we choose what to show you" — the three-step selection framework.
 *
 * This is the strongest differentiator on the page: it gives away the method
 * rather than asserting expertise, which is what the whole brand rests on.
 */
export function Framework({ data }: { data: Homepage | null }) {
  const d = DEFAULT_HOMEPAGE;
  const steps = data?.framework?.length ? data.framework : d.framework;

  return (
    <section
      id="framework"
      aria-labelledby="framework-heading"
      className="border-y border-gold/15 bg-ink-2 px-5 py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="roar-reveal mb-14 max-w-[760px]">
          <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
            {data?.frameworkEyebrow || d.frameworkEyebrow}
          </div>
          <h2
            id="framework-heading"
            className="m-0 font-display text-[clamp(2.125rem,4.2vw,4rem)] leading-[1.06] text-balance text-ivory"
          >
            {data?.frameworkHeading || d.frameworkHeading}
          </h2>
          <p className="mt-5 text-base leading-[1.8] text-ivory/55 sm:text-[17px]">
            {data?.frameworkBody || d.frameworkBody}
          </p>
        </div>

        <ol className="m-0 grid list-none gap-5.5 p-0 lg:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className="roar-reveal relative flex flex-col border border-gold/20 bg-ink p-8"
            >
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-serif text-[38px] leading-none italic text-gold">
                  {step.num}
                </span>
                <h3 className="font-display text-[22px] leading-tight text-ivory">
                  {step.title}
                </h3>
              </div>

              {step.intro && (
                <p className="mb-4 text-sm leading-relaxed text-ivory/50">{step.intro}</p>
              )}

              <ul className="m-0 mb-6 flex list-none flex-col gap-2 p-0">
                {step.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[15px] leading-snug text-ivory/75"
                  >
                    <span aria-hidden className="mt-[3px] text-[10px] text-gold">
                      ◆
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-auto border-t border-gold/15 pt-5 font-serif text-[19px] leading-snug italic text-gold-hi">
                {step.line}
              </p>

              <span
                aria-hidden
                className="absolute top-0 right-0 h-8 w-8 border-b border-l border-gold/20"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
