import type { Metadata } from "next";
import {
  getFeaturedProperties,
  getHomepage,
  getProperties,
  getSiteSettings,
  getTestimonials,
} from "@/lib/sanity/queries";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ChapterOne, ChapterTwo } from "@/components/home/Chapters";
import {
  ComparisonSection,
  PortfolioHeader,
  ProcessSection,
  StandardSection,
  TestimonialsSection,
} from "@/components/home/Sections";
import { ContactSection } from "@/components/home/ContactSection";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// Content is served from cache and refreshed by the Sanity webhook; the hourly
// window is just a backstop in case a webhook is ever missed.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomepage();
  return {
    // The root layout's title.template appends "· Roar Realty" to page titles,
    // but the homepage is the brand itself — so it sets an absolute title.
    // Passing `title: undefined` here would render an empty <title>.
    title: home?.seo?.title
      ? { absolute: home.seo.title }
      : { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
    description: home?.seo?.description || SITE_DESCRIPTION,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [home, settings, featured, testimonials, all] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
    getFeaturedProperties(6),
    getTestimonials(3),
    getProperties({ page: 1 }),
  ]);

  const effects3d = settings?.effects3d !== false;

  return (
    <>
      <Hero data={home} effects3d={effects3d} />
      <Marquee items={home?.marqueeItems} />
      <ChapterOne data={home} effects3d={effects3d} />
      <ChapterTwo data={home} />
      <StandardSection data={home} effects3d={effects3d} />
      <ProcessSection data={home} />

      <section
        id="properties"
        className="border-y border-gold/15 bg-ink-2 px-5 py-24 lg:px-10 lg:pt-30 lg:pb-35"
      >
        <div className="mx-auto max-w-[1400px]">
          <PortfolioHeader data={home} total={all.total} />

          {featured.length ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6.5">
              {featured.map((p, i) => (
                <PropertyCard key={p._id} property={p} priority={i < 3} />
              ))}
            </div>
          ) : (
            <p className="border border-dashed border-gold/25 px-6 py-14 text-center text-ivory/45">
              No properties published yet. Add your first listing in{" "}
              {/* Deliberately a full page load: /studio is a separate SPA and
                  client-navigating into it drags the Studio bundle in. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/studio" className="text-gold-hi underline underline-offset-2">
                Studio → Properties
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <ComparisonSection data={home} />
      <TestimonialsSection items={testimonials} />
      <ContactSection data={home} settings={settings} effects3d={effects3d} />
    </>
  );
}
