import type { Metadata } from "next";
import { getReviewSummary, getTestimonials } from "@/lib/sanity/queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewGrid } from "@/components/reviews/ReviewGrid";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Client reviews",
  description:
    "Reviews from buyers we've advised in Dubai and Gurgaon. Every one is checked against our transaction records before it appears.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const [reviews, summary] = await Promise.all([getTestimonials(), getReviewSummary()]);
  const real = reviews.filter((r) => !r.illustrative);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Reviews", href: "/reviews" },
        ]}
      />

      <PageHeader
        eyebrow="Client reviews"
        title="What clients say, and how you know it's real."
        intro="Every review here is checked against our transaction records before it goes up. We don't publish anonymous ones, and we don't publish any we can't tie to a real file."
      >
        {real.length > 0 && summary.average > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[44px] leading-none text-gold-hi">
                {summary.average.toFixed(1)}
              </span>
              <span
                className="text-lg tracking-[0.15em] text-gold-hi"
                aria-label={`${summary.average} out of 5`}
              >
                {"★".repeat(Math.round(summary.average))}
              </span>
            </div>
            <span className="text-[13px] tracking-[0.16em] text-ivory/45 uppercase">
              from {real.length} verified {real.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </PageHeader>

      <ReviewGrid reviews={reviews} />

      <section
        id="write"
        className="border-t border-gold/15 px-5 py-24 lg:px-10 lg:py-28"
      >
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="roar-reveal">
            <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
              Worked with us?
            </div>
            <h2 className="m-0 font-display text-[clamp(1.875rem,3.6vw,2.75rem)] leading-tight text-balance text-ivory">
              Tell people what actually happened.
            </h2>
            <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.8] text-ivory/60">
              Including the parts that were inconvenient. A review that only says
              nice things is worth less than one that says we talked you out of
              something, or that a file took longer than you wanted.
            </p>
            <p className="mt-6 font-serif text-xl italic text-gold-hi">
              We publish the honest ones.
            </p>
          </div>

          <div className="roar-reveal border border-gold/25 bg-ink-2 p-7 sm:p-9">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
