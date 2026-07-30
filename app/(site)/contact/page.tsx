import type { Metadata } from "next";
import { getHomepage, getSiteSettings } from "@/lib/sanity/queries";
import { ContactSection } from "@/components/home/ContactSection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact — begin the conversation",
  description:
    "Tell us what you're looking for. Within 48 hours you'll have a curated shortlist, each with its Glass File, and a fixed fee in writing. No obligation.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [home, settings] = await Promise.all([getHomepage(), getSiteSettings()]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <ContactSection
        data={home}
        settings={settings}
        effects3d={settings?.effects3d !== false}
      />
    </>
  );
}
