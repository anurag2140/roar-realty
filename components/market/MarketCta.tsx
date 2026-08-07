import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormProps } from "@/components/forms/LeadForm";

/** Closing conversion block shared by the Dubai and Gurgaon market pages. */
export function MarketCta({
  heading,
  body,
  formType = "enquiry",
}: {
  heading: string;
  body: string;
  formType?: LeadFormProps["formType"];
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-24 lg:px-10 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="roar-reveal">
          <h2 className="m-0 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] text-balance text-ivory">
            {heading}
          </h2>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.8] text-ivory/60">{body}</p>
          <p className="mt-6 font-serif text-xl italic text-gold-hi">
            Don&apos;t buy the story. Test the investment.
          </p>
        </div>
        <div className="roar-reveal border border-gold/25 bg-ink-2 p-8 sm:p-10">
          <LeadForm formType={formType} showBudget submitLabel="Request a property file →" />
        </div>
      </div>
    </section>
  );
}
