import type { Metadata } from "next";
import { DUBAI } from "@/lib/content/markets";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Scene3D, GoldFallback } from "@/components/three/Scene3D";
import { getSiteSettings } from "@/lib/sanity/queries";
import { MarketCta } from "@/components/market/MarketCta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Investing in Dubai property from India",
  description:
    "Dubai is one of the most verifiable property markets in the world — escrow law, a public title registry, licensed brokers. That doesn't make every project a good investment. Our eight-point filter, and what Dubai's protections don't cover.",
  alternates: { canonical: "/dubai" },
};

export default async function DubaiPage() {
  const settings = await getSiteSettings();
  const d = DUBAI;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Dubai", href: "/dubai" },
        ]}
      />

      <PageHeader eyebrow={d.eyebrow} title={d.heading} intro={d.intro} />

      {/* The two-sided argument — the whole point of the page. */}
      <section className="mx-auto max-w-[1400px] px-5 pb-20 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="roar-reveal border border-gold/25 bg-gradient-to-br from-gold/8 to-transparent p-8">
            <h2 className="m-0 mb-6 font-display text-[26px] leading-tight text-ivory">
              {d.protectsHeading}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {d.protects.map((p) => (
                <li key={p.title}>
                  <div className="flex items-baseline gap-2.5">
                    <span aria-hidden className="text-gold">✓</span>
                    <span className="font-display text-lg text-gold-hi">{p.title}</span>
                  </div>
                  <p className="m-0 mt-1 pl-6 text-[15px] leading-relaxed text-ivory/55">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="roar-reveal border border-gold/15 bg-ink-2 p-8">
            <h2 className="m-0 mb-6 font-display text-[26px] leading-tight text-ivory">
              {d.doesNotHeading}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {d.doesNot.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ivory/60">
                  <span aria-hidden className="mt-1 text-ivory/30">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 border-t border-gold/15 pt-5 font-serif text-lg italic text-gold-hi">
              Everyone sells Dubai&apos;s safety. Almost nobody explains what that
              safety does not cover.
            </p>
          </div>
        </div>
      </section>

      {/* Eight-point filter */}
      <section className="relative overflow-hidden border-y border-gold/15 px-5 py-24 lg:px-10">
        <Scene3D
          kind="gold"
          enabled={settings?.effects3d !== false}
          intensity={0.55}
          className="absolute inset-0 opacity-60"
          fallback={<GoldFallback intensity={0.55} />}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(10,9,7,.2), rgba(10,9,7,.92) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="roar-reveal mb-12 max-w-[720px]">
            <h2 className="m-0 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight text-ivory">
              {d.filterHeading}
            </h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-ivory/60">{d.filterIntro}</p>
          </div>
          <ol className="m-0 grid list-none gap-px p-0 sm:grid-cols-2 lg:grid-cols-4" style={{ background: "rgb(198 161 91 / 0.18)" }}>
            {d.filter.map((f, i) => (
              <li key={f.title} className="roar-reveal bg-ink p-6">
                <div className="mb-3 font-serif text-lg italic text-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-2.5 font-display text-lg leading-tight text-ivory">
                  {f.title}
                </h3>
                <p className="m-0 text-sm leading-relaxed text-ivory/55">{f.body}</p>
              </li>
            ))}
          </ol>

          <div className="roar-reveal mx-auto mt-14 max-w-2xl border-l-2 border-gold pl-6">
            <h3 className="m-0 mb-3 font-display text-2xl text-ivory">
              {d.scenariosHeading}
            </h3>
            <p className="m-0 text-[16px] leading-[1.8] text-ivory/60">{d.scenariosBody}</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
        <h2 className="roar-reveal m-0 mb-10 font-display text-[clamp(2rem,4vw,3.25rem)] text-ivory">
          {d.servicesHeading}
        </h2>
        <div className="grid gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          {d.services.map((s) => (
            <article key={s.title} className="roar-reveal border border-gold/20 bg-ink-2 p-7">
              <div className="mb-2 text-[10px] tracking-[0.24em] text-gold uppercase">
                {s.who}
              </div>
              <h3 className="mb-3 font-display text-xl text-ivory">{s.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-ivory/55">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Indian-buyer mistakes */}
      <section className="border-y border-gold/15 bg-ink-2 px-5 py-24 lg:px-10">
        <div className="mx-auto max-w-[1400px] grid gap-14 lg:grid-cols-2">
          <div className="roar-reveal">
            <h2 className="m-0 font-display text-[clamp(1.875rem,3.6vw,3rem)] leading-tight text-balance text-ivory">
              {d.mistakesHeading}
            </h2>
            <p className="mt-6 text-[17px] leading-[1.8] text-ivory/60">{d.mistakesIntro}</p>
            <ul className="mt-8 flex list-none flex-col gap-3 p-0">
              {d.mistakes.map((m) => (
                <li key={m} className="flex items-start gap-3 text-[15px] leading-snug text-ivory/70">
                  <span aria-hidden className="mt-0.5 text-red-400/70">✕</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="roar-reveal">
            <h2 className="m-0 font-display text-[clamp(1.5rem,2.6vw,2.125rem)] leading-tight text-ivory">
              {d.questionsHeading}
            </h2>
            <ul className="mt-6 flex list-none flex-col gap-4 p-0">
              {d.questions.map((q) => (
                <li
                  key={q}
                  className="border-b border-gold/12 pb-4 text-[15px] leading-relaxed text-ivory/65 last:border-b-0"
                >
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-6 border border-gold/25 bg-gold/5 p-5 text-sm leading-relaxed text-ivory/55">
              {d.questionsNote}
            </p>
          </div>
        </div>
      </section>

      <MarketCta
        heading="Start your Dubai investment review"
        body="Tell us the budget, the objective and the timeline. You get a filtered shortlist with the reasoning written down — including what we rejected and why."
        formType="enquiry"
      />
    </>
  );
}
