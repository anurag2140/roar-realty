import type { Metadata } from "next";
import { getHomepage, getTeam } from "@/lib/sanity/queries";
import { imageUrl } from "@/lib/sanity/image";
import { ChapterTwo } from "@/components/home/Chapters";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Anurag, twelve years in Dubai real estate",
  description:
    "Twelve years selling property in a market where verification is built into the law, now applying the same standard in Gurgaon. The work is the assembly, everything else is showing property.",
  alternates: { canonical: "/about" },
};

/**
 * First person throughout. In a personal-brand advisory business the founder
 * is the product, so this page carries more conversion weight than any service
 * page — which is why it reads as one person talking rather than a company
 * describing itself.
 */
const STORY = [
  {
    kind: "lede",
    text: "I spent twelve years selling property in Dubai. Then I came back to India and discovered I could no longer answer a simple question quickly: who actually owns this, and is it clean?",
  },
  {
    kind: "p",
    text: "In Dubai that question takes minutes. Every title, every transaction, every developer record sits in one place, and it is open. In India the same information exists, registry, mutation, RERA, court records, licensing, spread across systems that were never designed to be read together.",
  },
  {
    kind: "p",
    text: "It took me months to do properly what used to take me an afternoon. And that, I realised, is exactly why most buyers never do it at all. Not because they don't care. Because the cost in time is high enough that skipping it feels reasonable right up until the moment it isn't.",
  },
  {
    kind: "quote",
    text: "So the work became the assembly. Not showing property, anybody can show property.",
  },
  {
    kind: "p",
    text: "Putting the full picture in front of a buyer before they commit, in a market that makes that deliberately inconvenient. That is Roar Realty, in Dubai and in Gurgaon.",
  },
  {
    kind: "p",
    text: "I do not recommend every project. I do not promise returns. I show you what I found, what I could not verify, and what I would want to know if it were my money.",
  },
];

const CREDENTIALS = [
  { label: "Experience", value: "12+ years in Dubai real estate" },
  { label: "Practice", value: "Roar Realty. Dubai and Gurgaon" },
  {
    label: "Specialisation",
    value:
      "Cross-border UAE–India transactions · title and documentation verification · investment analysis · high-value client advisory",
  },
];

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
        eyebrow="About"
        title="Twelve years in Dubai. Now building the same standard in Gurgaon."
      />

      <article className="mx-auto max-w-3xl px-5 pb-20 lg:px-10">
        {STORY.map((block, i) => {
          if (block.kind === "lede") {
            return (
              <p
                key={i}
                className="roar-reveal m-0 mb-8 font-serif text-[clamp(1.375rem,2.6vw,1.75rem)] leading-[1.5] italic text-gold-hi"
              >
                {block.text}
              </p>
            );
          }
          if (block.kind === "quote") {
            return (
              <blockquote
                key={i}
                className="roar-reveal my-9 border-l-2 border-gold pl-6 font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-snug text-ivory"
              >
                {block.text}
              </blockquote>
            );
          }
          return (
            <p
              key={i}
              className="roar-reveal m-0 mb-5 text-[17px] leading-[1.85] text-ivory/70"
            >
              {block.text}
            </p>
          );
        })}

        <div className="roar-reveal mt-14 border border-gold/20 bg-ink-2 p-8">
          <h2 className="m-0 mb-6 text-[11px] tracking-[0.28em] text-gold uppercase">
            Credentials
          </h2>
          <dl className="m-0 flex flex-col gap-5">
            {CREDENTIALS.map((c) => (
              <div key={c.label} className="grid gap-1 sm:grid-cols-[110px_1fr] sm:gap-5">
                <dt className="text-[11px] tracking-[0.2em] text-ivory/40 uppercase">
                  {c.label}
                </dt>
                <dd className="m-0 text-[15px] leading-relaxed text-ivory/75">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      {/* Why the practice exists, in the market's own numbers. */}
      <ChapterTwo data={home} />

      {team.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
          <h2 className="mb-10 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] text-ivory">
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
          The rules are public. Hold me to them.
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
