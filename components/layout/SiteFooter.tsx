import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/site";
import { contact } from "@/lib/env";
import { imageUrl } from "@/lib/sanity/image";
import type { SiteSettings } from "@/lib/sanity/types";
import { INVESTMENT_DISCLAIMER } from "@/lib/content/defaults";
import { TBC } from "@/components/ui/TBC";

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const founded = settings?.foundedYear;
  const logo = imageUrl(settings?.logo, 160, 160) || "/logo.jpeg";
  const rera = contact.rera || settings?.reraNumber || "";
  const entity = settings?.legalEntity || `${SITE_NAME} LLC`;
  // Owner asked for the pending notice to come down while the number is issued.
  const showReraRow = Boolean(rera) || settings?.hideReraNotice !== true;

  return (
    <footer className="border-t border-gold/15 bg-ink-3 px-5 pt-16 pb-28 sm:pb-14 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 border-b border-gold/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt=""
                width={54}
                height={54}
                className="block h-[54px] w-[54px] rounded-[10px] object-cover"
              />
              <div>
                <div className="font-display text-base tracking-[0.22em] text-ivory">
                  ROAR REALTY
                </div>
                <div className="mt-1 text-xs tracking-[0.2em] text-ivory/35 uppercase">
                  Dubai · Gurgaon
                </div>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/45">
              Titles verified before you shortlist, carpet-area pricing, one fee
              in writing, and the exit planned before the entry. In Dubai and in
              Gurgaon.
            </p>
          </div>

          <FooterColumn title="Explore" links={FOOTER_LINKS.explore} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />

          <div>
            <h2 className="mb-5 text-[11px] tracking-[0.28em] text-gold uppercase">
              Contact
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-ivory/55">
              <li>
                {settings?.officeAddress || (
                  <TBC>Registered office address</TBC>
                )}
              </li>
              <li>
                {contact.phone || settings?.phone ? (
                  <a
                    href={`tel:${(contact.phone || settings?.phone || "").replace(/[^\d+]/g, "")}`}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-gold-hi sm:min-h-0"
                  >
                    {contact.phone || settings?.phone}
                  </a>
                ) : (
                  <TBC>Phone number</TBC>
                )}
              </li>
              <li>
                {settings?.email ? (
                  <a
                    href={`mailto:${settings.email}`}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-gold-hi sm:min-h-0"
                  >
                    {settings.email}
                  </a>
                ) : (
                  <TBC>Email address</TBC>
                )}
              </li>
              {settings?.emailIndia && (
                <li>
                  <a
                    href={`mailto:${settings.emailIndia}`}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-gold-hi sm:min-h-0"
                  >
                    {settings.emailIndia}
                  </a>
                </li>
              )}
            </ul>

            {settings?.socials?.length ? (
              <div className="mt-6 flex flex-wrap gap-4">
                {settings.socials.map((s) => (
                  <a
                    key={s._key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-[0.2em] text-ivory/45 uppercase transition-colors hover:text-gold-hi"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Investment disclaimer — required sitewide by the content plan, since
            every advisory page discusses returns, yields and appreciation. */}
        <div className="border-b border-gold/10 py-6">
          <p className="m-0 max-w-4xl text-[11px] leading-relaxed text-ivory/35">
            {INVESTMENT_DISCLAIMER}
          </p>
        </div>

        {/* RERA disclosure. Legally required on brokerage advertising in
            Haryana and UP — rendered as a visible gap, never as a fake number. */}
        {showReraRow && (
          <div className="border-b border-gold/10 py-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-ivory/40">
              <span className="tracking-[0.24em] text-gold uppercase">RERA</span>
              {rera ? (
                <span>{rera}</span>
              ) : (
                <TBC>Agent registration number pending</TBC>
              )}
              <span className="text-ivory/25">·</span>
              <Link href="/disclaimer" className="underline underline-offset-2 hover:text-gold-hi">
                Full disclaimer
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-[0.08em] text-ivory/30">
            © {founded && founded < year ? `${founded}–${year}` : founded || year} {entity}
            {settings?.cin ? ` · ${settings.cin}` : ""} ·{" "}
            {settings?.footerNote || "Every promise in writing."}
          </p>
          <div className="flex flex-wrap gap-5">
            {FOOTER_LINKS.legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-11 items-center py-1 text-[11px] tracking-[0.2em] text-ivory/40 uppercase no-underline transition-colors hover:text-gold-hi sm:min-h-0 sm:py-0"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="mb-5 text-[11px] tracking-[0.28em] text-gold uppercase">{title}</h2>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-11 items-center py-1 text-sm text-ivory/55 no-underline transition-colors hover:text-gold-hi sm:min-h-0 sm:py-0"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
