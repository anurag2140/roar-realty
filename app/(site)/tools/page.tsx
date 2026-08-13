import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { YieldCalculator } from "@/components/tools/YieldCalculator";
import { CarpetAreaCalculator } from "@/components/tools/CarpetAreaCalculator";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Free calculators for property buyers",
  description:
    "Work out the real Dubai rental yield after service charges and voids, and see what a super built-up quote actually costs you per square foot of carpet area. Free, no signup.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/tools" },
        ]}
      />

      <PageHeader
        eyebrow="Free tools"
        title="Two numbers nobody shows you."
        intro="Both of these take about thirty seconds and cost nothing. Neither requires your email. If what they reveal is uncomfortable, that is the point."
      />

      <section
        id="yield"
        aria-labelledby="yield-heading"
        className="mx-auto max-w-[1400px] px-5 pb-20 lg:px-10"
      >
        <div className="roar-reveal mb-8 max-w-[640px]">
          <div className="mb-3 text-[11px] tracking-[0.28em] text-gold uppercase">
            Dubai
          </div>
          <h2
            id="yield-heading"
            className="m-0 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight text-ivory"
          >
            What the rental yield actually is.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ivory/60">
            Advertised Dubai yields are gross. Service charges, void periods,
            management and letting commission all come out before anything
            reaches you. Move the sliders and watch the gap.
          </p>
        </div>
        <YieldCalculator />
      </section>

      <section
        id="carpet"
        aria-labelledby="carpet-heading"
        className="border-t border-gold/15 bg-ink-2 px-5 py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="roar-reveal mb-8 max-w-[640px]">
            <div className="mb-3 text-[11px] tracking-[0.28em] text-gold uppercase">
              India
            </div>
            <h2
              id="carpet-heading"
              className="m-0 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight text-ivory"
            >
              What you are really paying per square foot.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ivory/60">
              A rate quoted on super built-up area is not comparable to one
              quoted on carpet. Enter both and see the real number, and what the
              difference costs you.
            </p>
          </div>
          <CarpetAreaCalculator />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-10">
        <h2 className="font-display text-[clamp(1.625rem,3vw,2.25rem)] text-balance text-ivory">
          These are estimates. The file is the real answer.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ivory/55">
          A calculator uses the numbers you give it. We go and get the actual
          service charge, the registered carpet area, the observed occupancy and
          the title position, then tell you what we found.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/contact" size="lg">
            Request a property file →
          </ButtonLink>
          <ButtonLink href="/insights" variant="outline" size="lg">
            Read the guides
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
