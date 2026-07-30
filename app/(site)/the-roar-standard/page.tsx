import type { Metadata } from "next";
import { getFaqs, getHomepage, getSiteSettings } from "@/lib/sanity/queries";
import { StandardSection, ComparisonSection } from "@/components/home/Sections";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { Faqs } from "@/components/ui/Faqs";
import { ButtonLink } from "@/components/ui/Button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Roar Standard — six rules, in writing",
  description:
    "Escrow-protected payments, titles verified thrice, carpet-area pricing, one fixed fee, a full digital paper trail and a possession-date guarantee. Written into your agreement, not a brochure.",
  alternates: { canonical: "/the-roar-standard" },
};

export default async function StandardPage() {
  const [home, settings, faqs] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
    getFaqs(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "The Roar Standard", href: "/the-roar-standard" },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <StandardSection data={home} effects3d={settings?.effects3d !== false} />
      <ComparisonSection data={home} />

      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-5 pb-24 lg:px-10">
          <h2 className="mb-8 font-display text-[clamp(1.875rem,3.4vw,2.75rem)] text-ivory">
            Questions we get asked.
          </h2>
          <Faqs items={faqs} />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 pb-24 text-center lg:px-10">
        <ButtonLink href="/contact" size="lg">
          Put us to the test →
        </ButtonLink>
      </section>
    </>
  );
}
