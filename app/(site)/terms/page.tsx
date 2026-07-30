import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/sanity/queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Legal, LegalHeading, LegalP } from "@/components/layout/Legal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms on which you may use the Roar Realty website.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const entity = settings?.legalEntity || "Roar Realty India Pvt. Ltd.";

  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of use" />
      <Legal>
        <LegalHeading>Acceptance</LegalHeading>
        <LegalP>
          By using this website you agree to these terms. If you do not agree,
          please do not use the site.
        </LegalP>

        <LegalHeading>Accuracy of information</LegalHeading>
        <LegalP>
          We take reasonable care to keep listing information accurate, but
          prices, availability, areas and possession dates change and are
          provided without warranty. See our{" "}
          <Link href="/disclaimer" className="text-gold-hi underline underline-offset-2">
            disclaimer and RERA disclosure
          </Link>{" "}
          for the full position.
        </LegalP>

        <LegalHeading>Use of the site</LegalHeading>
        <LegalP>
          You may browse, save and share listings for your own non-commercial
          use. You may not scrape, republish or resell our listing data,
          photographs or written content without written permission, nor submit
          automated or fraudulent enquiries.
        </LegalP>

        <LegalHeading>Intellectual property</LegalHeading>
        <LegalP>
          All content on this site, including text, photography, renders and the
          Roar Realty name and marks, belongs to {entity} or its licensors.
        </LegalP>

        <LegalHeading>Third-party links</LegalHeading>
        <LegalP>
          We link to state RERA portals and mapping services. We are not
          responsible for the content or availability of external sites.
        </LegalP>

        <LegalHeading>Limitation of liability</LegalHeading>
        <LegalP>
          To the extent permitted by law, we are not liable for indirect or
          consequential loss arising from use of this website. Nothing in these
          terms limits liability for fraud or for anything that cannot lawfully
          be limited. Our obligations in any actual transaction are governed by
          the signed agreement for that transaction, not by this page.
        </LegalP>

        <LegalHeading>Governing law</LegalHeading>
        <LegalP>
          These terms are governed by the laws of India, and the courts at
          Gurugram, Haryana have exclusive jurisdiction.
        </LegalP>
      </Legal>
    </>
  );
}
