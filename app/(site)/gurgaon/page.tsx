import type { Metadata } from "next";
import { GURGAON } from "@/lib/content/markets";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { MarketCta } from "@/components/market/MarketCta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buying property in Gurgaon & NCR, verified before you shortlist",
  description:
    "Title chain, mutation status, encumbrance certificate, RERA registration, DTCP licence, litigation scan and true carpet area, assembled before you pay a token, not after.",
  alternates: { canonical: "/gurgaon" },
};

export default function GurgaonPage() {
  const g = GURGAON;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Gurgaon & NCR", href: "/gurgaon" },
        ]}
      />

      <PageHeader eyebrow={g.eyebrow} title={g.heading} intro={g.intro} />

      {/* The verification table — the forensic heart of the India practice. */}
      <section className="mx-auto max-w-[1400px] px-5 pb-20 lg:px-10">
        <h2 className="roar-reveal mb-8 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] text-ivory">
          {g.verifyHeading}
        </h2>

        <div className="roar-scrollbar overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse border border-gold/20 text-left">
            <thead>
              <tr>
                <th className="border-b border-gold/25 px-5 py-4 text-[10px] tracking-[0.22em] text-gold uppercase">
                  The check
                </th>
                <th className="border-b border-l border-gold/20 px-5 py-4 text-[10px] tracking-[0.22em] text-gold uppercase">
                  What it reveals
                </th>
                <th className="border-b border-l border-gold/20 px-5 py-4 text-[10px] tracking-[0.22em] text-gold uppercase">
                  Why it matters
                </th>
              </tr>
            </thead>
            <tbody>
              {g.verify.map((row) => (
                <tr key={row.check} className="border-b border-gold/12 last:border-b-0">
                  <th
                    scope="row"
                    className="px-5 py-4 text-left font-display text-[17px] font-normal text-ivory"
                  >
                    {row.check}
                  </th>
                  <td className="border-l border-gold/12 px-5 py-4 text-[14.5px] leading-relaxed text-ivory/60">
                    {row.reveals}
                  </td>
                  <td className="border-l border-gold/12 bg-gold/4 px-5 py-4 text-[14.5px] leading-relaxed text-ivory/75">
                    {row.matters}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Questions buyers don't ask */}
      <section className="border-y border-gold/15 bg-ink-2 px-5 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="roar-reveal m-0 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight text-balance text-ivory">
            {g.askHeading}
          </h2>
          <ol className="mt-9 flex list-none flex-col gap-0 p-0">
            {g.ask.map((q, i) => (
              <li
                key={q}
                className="roar-reveal flex gap-5 border-b border-gold/12 py-5 last:border-b-0"
              >
                <span className="font-serif text-2xl italic text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[16px] leading-relaxed text-ivory/70">{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
        <h2 className="roar-reveal m-0 mb-10 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] text-ivory">
          {g.servicesHeading}
        </h2>
        <div className="grid gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
          {g.services.map((s) => (
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

      <MarketCta
        heading="Get the verification done before you commit"
        body="Send us the property you're considering, or tell us what you're looking for. We'll assemble the file: title chain, mutation, encumbrance, litigation and the real carpet-area maths."
        formType="enquiry"
      />
    </>
  );
}
