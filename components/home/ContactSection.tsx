import { Scene3D, GoldFallback } from "@/components/three/Scene3D";
import { LeadForm } from "@/components/forms/LeadForm";
import { TBC } from "@/components/ui/TBC";
import { contact } from "@/lib/env";
import { DEFAULT_HOMEPAGE } from "@/lib/content/defaults";
import type { Homepage, SiteSettings } from "@/lib/sanity/types";

export function ContactSection({
  data,
  settings,
  effects3d = true,
}: {
  data: Homepage | null;
  settings: SiteSettings | null;
  effects3d?: boolean;
}) {
  const d = DEFAULT_HOMEPAGE;
  const phone = contact.phone || settings?.phone;
  const rera = contact.rera || settings?.reraNumber;

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Office",
      value: settings?.officeAddress || <TBC>Office address</TBC>,
    },
    {
      label: "Phone",
      value: phone ? (
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-gold-hi">
          {phone}
        </a>
      ) : (
        <TBC>Phone number</TBC>
      ),
    },
    {
      label: "Email",
      value: settings?.email ? (
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          <a href={`mailto:${settings.email}`} className="hover:text-gold-hi">
            {settings.email}
          </a>
          {settings.emailIndia && (
            <>
              <span className="text-ivory/25">·</span>
              <a href={`mailto:${settings.emailIndia}`} className="hover:text-gold-hi">
                {settings.emailIndia}
              </a>
            </>
          )}
        </span>
      ) : (
        <TBC>Email address</TBC>
      ),
    },
  ];

  // The pending marker comes down while the registration is being issued;
  // a real number always shows.
  if (rera) {
    rows.push({ label: "RERA", value: rera });
  } else if (settings?.hideReraNotice !== true) {
    rows.push({ label: "RERA", value: <TBC>Registration pending</TBC> });
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-gold/15 px-5 py-24 lg:px-10 lg:pt-[130px] lg:pb-22"
    >
      <Scene3D
        kind="gold"
        enabled={effects3d}
        intensity={0.7}
        className="absolute inset-0 opacity-70"
        fallback={<GoldFallback intensity={0.7} />}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(10,9,7,.12), rgba(10,9,7,.9) 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-2 lg:gap-[70px]">
        <div className="roar-reveal">
          <div className="mb-4.5 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
            {data?.contactEyebrow || d.contactEyebrow}
          </div>
          <h2 className="m-0 mb-6.5 font-display text-[clamp(2.125rem,4vw,3.875rem)] leading-[1.05] text-balance text-ivory">
            {data?.contactHeading || d.contactHeading}
          </h2>
          <p className="m-0 mb-10 max-w-[460px] text-base leading-[1.8] text-ivory/55">
            {data?.contactBody || d.contactBody}
          </p>

          <dl className="m-0 flex flex-col gap-4.5 text-[15px] text-ivory/60">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap items-baseline gap-4">
                <dt className="w-20 shrink-0 text-[11px] tracking-[0.28em] text-gold uppercase">
                  {row.label}
                </dt>
                <dd className="m-0 flex-1">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="roar-reveal border border-gold/25 bg-ink-2/82 p-8 backdrop-blur-md sm:p-10">
          <LeadForm formType="contact" showBudget />
        </div>
      </div>
    </section>
  );
}
