import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity/queries";
import { contact, isLive } from "@/lib/env";
import { PageHeader } from "@/components/layout/PageHeader";
import { TBC } from "@/components/ui/TBC";
import { Legal, LegalHeading, LegalP } from "@/components/layout/Legal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Disclaimer & RERA disclosure",
  description:
    "Statutory disclosures for Roar Realty India, including RERA agent registration and the basis on which listing information is published.",
  alternates: { canonical: "/disclaimer" },
};

export default async function DisclaimerPage() {
  const settings = await getSiteSettings();
  const rera = contact.rera || settings?.reraNumber;
  const entity = settings?.legalEntity || "Roar Realty India Pvt. Ltd.";

  return (
    <>
      <PageHeader eyebrow="Legal" title="Disclaimer & RERA disclosure" />
      <Legal>
        <LegalHeading>RERA registration</LegalHeading>
        <LegalP>
          {entity} operates as a real estate agent. Our agent registration
          number is{" "}
          {rera ? (
            <strong className="text-gold-hi">{rera}</strong>
          ) : (
            <TBC>registration pending</TBC>
          )}
          .
        </LegalP>
        {!rera && (
          <div className="my-6 border border-dashed border-gold/40 bg-gold/5 px-5 py-4 text-sm leading-relaxed text-gold/85">
            <strong>Notice:</strong> this website is operating in preview mode
            and no agent registration number has yet been published. Under the
            Real Estate (Regulation and Development) Act, 2016, a real estate
            agent must be registered with the relevant state authority before
            facilitating the sale or purchase of a registered project, and must
            display that registration number in advertising. No brokerage
            services are offered through this site until that number appears
            above.
          </div>
        )}

        <LegalHeading>Project registration</LegalHeading>
        <LegalP>
          Where a project is registered under RERA, the registration number is
          shown on the individual property page. Buyers are advised to
          independently verify every project&apos;s registration on the relevant
          state authority&apos;s portal — Haryana RERA (haryanarera.gov.in),
          UP RERA (up-rera.in) or Delhi RERA, as applicable.
        </LegalP>

        <LegalHeading>Listing information</LegalHeading>
        <LegalP>
          Prices, areas, specifications, possession dates and availability shown
          on this website are indicative and are subject to change without
          notice. Carpet area, where quoted, follows the definition in Section
          2(k) of the RERA Act. Images, renders and floor plans are for
          illustration and may not depict the exact unit offered.
        </LegalP>
        {!isLive && (
          <LegalP>
            <strong className="text-gold-hi">
              This site is currently in preview mode.
            </strong>{" "}
            Listings marked &ldquo;illustrative sample&rdquo; are placeholder
            content used during development. They do not represent available
            inventory and must not be relied upon.
          </LegalP>
        )}

        <LegalHeading>No offer or invitation</LegalHeading>
        <LegalP>
          Nothing on this website constitutes an offer, an invitation to offer,
          or a contract of any kind. Any transaction is governed solely by the
          executed agreement between the parties.
        </LegalP>

        <LegalHeading>Financial advice</LegalHeading>
        <LegalP>
          We are property advisors, not licensed investment or tax advisors.
          Nothing here is investment, tax or legal advice. Please consult a
          qualified professional before making a financial decision.
        </LegalP>

        <LegalHeading>Escrow references</LegalHeading>
        <LegalP>
          References to escrow protection describe the designated project
          account mechanism under Section 4(2)(l)(D) of the RERA Act, and, for
          resale transactions, supervised escrow arrangements agreed in writing
          between the parties. The specific mechanism applicable to any given
          transaction is set out in that transaction&apos;s agreement.
        </LegalP>
      </Legal>
    </>
  );
}
