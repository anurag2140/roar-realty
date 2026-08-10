import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity/queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Legal, LegalHeading, LegalP } from "@/components/layout/Legal";
import { TBC } from "@/components/ui/TBC";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Roar Realty collects when you enquire, why we hold it, how long we keep it, and the rights you have under India's DPDP Act.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const entity = settings?.legalEntity || "Roar Realty India Pvt. Ltd.";

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        intro="The short version: we collect what you type into an enquiry form, we use it to reply to you, and we never sell it."
      />
      <Legal>
        <LegalHeading>Who we are</LegalHeading>
        <LegalP>
          {entity} (&ldquo;we&rdquo;) is the data fiduciary responsible for
          personal data collected through this website. Contact us at{" "}
          {settings?.email ? (
            <a href={`mailto:${settings.email}`} className="text-gold-hi underline underline-offset-2">
              {settings.email}
            </a>
          ) : (
            <TBC>email address</TBC>
          )}
          .
        </LegalP>

        <LegalHeading>What we collect</LegalHeading>
        <LegalP>
          When you submit an enquiry, site-visit request, brochure download or
          market-report signup, we collect: your name, phone number, and, if
          you provide them, your email address, budget range and the message
          you write. We also record which page you submitted from, the campaign
          parameters in the URL if you arrived from an advertisement, your
          browser&apos;s user-agent string, and a one-way hash of your IP
          address.
        </LegalP>
        <LegalP>
          We store a <em>hash</em> of the IP address rather than the address
          itself. It lets us stop automated abuse of the form without keeping
          data that identifies your connection.
        </LegalP>

        <LegalHeading>Why we hold it</LegalHeading>
        <LegalP>
          To respond to your enquiry, to prepare and send the shortlist or Glass
          File you asked for, and to keep a record of what was promised to you.
          The legal basis is the consent you give by submitting the form, and
          our legitimate interest in preventing abuse of the website.
        </LegalP>

        <LegalHeading>What we never do</LegalHeading>
        <LegalP>
          We do not sell, rent or share your details with builders, other
          brokers, lead aggregators or any third party for their own marketing.
          This is not a policy we intend to revise, a broker forwarding your
          number to six developers is precisely the practice this company exists
          to replace.
        </LegalP>

        <LegalHeading>Who processes data on our behalf</LegalHeading>
        <LegalP>
          Website hosting (Vercel Inc.), our content system (Sanity AS), our
          enquiry database (Neon Inc., hosted in Singapore), and our email
          delivery provider (Resend). Each processes data only to deliver its
          service to us.
        </LegalP>

        <LegalHeading>Analytics and cookies</LegalHeading>
        <LegalP>
          We use Vercel Web Analytics, which is cookieless and does not build a
          cross-site profile of you. We set no advertising or tracking cookies.
          A small amount of data is kept in your browser&apos;s local storage,
          your saved shortlist and whether you&apos;ve dismissed a notice, which
          never leaves your device unless you submit a form.
        </LegalP>

        <LegalHeading>How long we keep it</LegalHeading>
        <LegalP>
          Enquiry records are retained for three years from your last contact
          with us, after which they are deleted. Rate-limiting records are
          deleted within days.
        </LegalP>

        <LegalHeading>Your rights</LegalHeading>
        <LegalP>
          Under the Digital Personal Data Protection Act, 2023, you may request
          access to the personal data we hold about you, ask us to correct it,
          ask us to erase it, or withdraw your consent at any time. Write to us
          and we will action the request within thirty days. If you are not
          satisfied, you may complain to the Data Protection Board of India.
        </LegalP>
      </Legal>
    </>
  );
}
