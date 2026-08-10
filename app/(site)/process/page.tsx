import type { Metadata } from "next";
import { getHomepage } from "@/lib/sanity/queries";
import { ProcessSection } from "@/components/home/Sections";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "How we work, five steps, zero surprises",
  description:
    "The brief, the shortlist, the Glass File, escrow and registration, then twenty-four months of aftercare. You always know what happens next.",
  alternates: { canonical: "/process" },
};

export default async function ProcessPage() {
  const home = await getHomepage();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Process", href: "/process" },
        ]}
      />

      <PageHeader
        eyebrow="How we work with you"
        title="Five steps. Zero surprises."
        intro="Most buyers describe the process as the frightening part, not the property. So this is written down, published, and identical for every client."
      />

      <ProcessSection data={home} />

      <section className="mx-auto max-w-3xl px-5 pb-24 text-center lg:px-10">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] text-balance text-ivory">
          Step one takes an hour, and costs nothing.
        </h2>
        <div className="mt-8">
          <ButtonLink href="/contact" size="lg">
            Book the brief →
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
