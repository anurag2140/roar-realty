import type { Metadata } from "next";
import { getHomepage, getTeam } from "@/lib/sanity/queries";
import { imageUrl } from "@/lib/sanity/image";
import { ChapterOne, ChapterTwo } from "@/components/home/Chapters";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our story — twelve years of Dubai discipline",
  description:
    "Roar Realty brought Dubai's escrow law, public title registry and licensed-broker accountability to Delhi NCR property. This is why, and how.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [home, team] = await Promise.all([getHomepage(), getTeam()]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <PageHeader
        eyebrow="Our story"
        title="We were shaped by a market where every promise is enforced."
        intro="Twelve years in Dubai taught us what a property transaction feels like when the system is on the buyer's side. Bringing that home became the whole point."
      />

      <ChapterOne data={home} />
      <ChapterTwo data={home} />

      {team.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
          <h2 className="mb-10 font-display text-[clamp(2rem,3.6vw,3rem)] text-ivory">
            The people who will actually answer the phone.
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-6">
            {team.map((m) => {
              const photo = imageUrl(m.photo, 500, 600);
              return (
                <article key={m._id} className="roar-reveal border border-gold/20 bg-ink-2">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={m.name}
                      width={500}
                      height={600}
                      loading="lazy"
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-gradient-to-br from-ink-2 to-ink font-display text-4xl text-gold/40">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-xl text-ivory">{m.name}</h3>
                    <div className="mt-1 text-xs tracking-[0.18em] text-gold uppercase">
                      {m.role}
                    </div>
                    {m.bio && (
                      <p className="mt-3 text-sm leading-relaxed text-ivory/55">{m.bio}</p>
                    )}
                    {m.reraId && (
                      <div className="mt-3 text-[11px] text-ivory/35">RERA {m.reraId}</div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-10">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] text-balance text-ivory">
          The rules are public. Hold us to them.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/the-roar-standard" size="lg">
            Read the Roar Standard →
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" size="lg">
            Speak to us
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
