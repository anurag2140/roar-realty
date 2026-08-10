"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contact } from "@/lib/env";
import { telLink, whatsappLink } from "@/lib/site";
import { useEnquiry } from "@/components/popups/EnquiryProvider";
import type { SiteSettings } from "@/lib/sanity/types";

const WA_ICON = (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
);

/**
 * Floating WhatsApp button plus the sticky mobile action bar.
 *
 * With two desks configured the button opens a small chooser rather than
 * guessing, because a buyer asking about Dubai and one asking about Gurgaon
 * should reach different people.
 */
export function FloatingActions({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const { open } = useEnquiry();
  const [visible, setVisible] = useState(false);
  const [chooser, setChooser] = useState(false);

  // Environment variables win over CMS values, so a number can be corrected in
  // Vercel without waiting on a content edit.
  const phone = contact.phone || settings?.phone || "";
  const waIndia = contact.whatsapp || settings?.whatsapp || "";
  const waUae = settings?.whatsappUae || "";

  const message = "Hello Roar Realty, I'd like to discuss a property.";
  const desks = [
    waIndia && { label: "India desk", sub: waIndia, href: whatsappLink(waIndia, message) },
    waUae && { label: "Dubai desk", sub: waUae, href: whatsappLink(waUae, message) },
  ].filter(Boolean) as { label: string; sub: string; href: string }[];

  const tel = telLink(phone);
  const single = desks.length === 1 ? desks[0] : null;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!chooser) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChooser(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [chooser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChooser(false);
  }, [pathname]);

  if (pathname?.startsWith("/studio")) return null;

  return (
    <>
      {desks.length > 0 && (
        <div
          className={`roar-no-print fixed right-4 bottom-[76px] z-1050 flex flex-col items-end gap-2 transition-all duration-300 sm:right-6 sm:bottom-6 ${
            visible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          {chooser && desks.length > 1 && (
            <div
              role="dialog"
              aria-label="Choose a WhatsApp desk"
              className="mb-1 w-56 overflow-hidden rounded-lg border border-gold/25 bg-ink-2/95 shadow-xl backdrop-blur-md"
              style={{ animation: "roarModalIn .18s ease-out" }}
            >
              <div className="border-b border-gold/15 px-4 py-2.5 text-[10px] tracking-[0.22em] text-gold uppercase">
                Chat with
              </div>
              {desks.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setChooser(false)}
                  className="flex items-center justify-between gap-3 border-b border-gold/10 px-4 py-3 text-ivory/80 no-underline transition-colors last:border-b-0 hover:bg-gold/10 hover:text-gold-hi"
                >
                  <span>
                    <span className="block text-sm">{d.label}</span>
                    <span className="block text-[11px] text-ivory/40">{d.sub}</span>
                  </span>
                  <span aria-hidden className="text-[#25D366]">›</span>
                </a>
              ))}
            </div>
          )}

          {single ? (
            <a
              href={single.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform active:scale-95"
            >
              {WA_ICON}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setChooser((v) => !v)}
              aria-label="Chat with us on WhatsApp"
              aria-expanded={chooser}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform active:scale-95"
            >
              {WA_ICON}
            </button>
          )}
        </div>
      )}

      {/* Sticky mobile action bar. Every target is at least 56px tall, and the
          page carries matching bottom padding so nothing hides behind it. */}
      <div className="roar-no-print fixed inset-x-0 bottom-0 z-1040 grid grid-cols-3 border-t border-gold/20 bg-ink-2/95 backdrop-blur-md sm:hidden">
        {tel ? (
          <a
            href={tel}
            className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] tracking-[0.16em] text-ivory/70 uppercase active:bg-gold/10"
          >
            <span aria-hidden className="text-[15px]">✆</span>
            Call
          </a>
        ) : (
          <span className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] tracking-[0.16em] text-ivory/25 uppercase">
            <span aria-hidden className="text-[15px]">✆</span>
            Call
          </span>
        )}

        {desks.length > 0 ? (
          <a
            href={single ? single.href : desks[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 flex-col items-center justify-center gap-1 border-x border-gold/15 text-[10px] tracking-[0.16em] text-ivory/70 uppercase active:bg-gold/10"
          >
            <span aria-hidden className="text-[15px]">💬</span>
            WhatsApp
          </a>
        ) : (
          <span className="flex min-h-14 flex-col items-center justify-center gap-1 border-x border-gold/15 text-[10px] tracking-[0.16em] text-ivory/25 uppercase">
            <span aria-hidden className="text-[15px]">💬</span>
            WhatsApp
          </span>
        )}

        <button
          type="button"
          onClick={() =>
            open({
              formType: "enquiry",
              title: "Request a property file",
              description:
                "Tell us the budget, the objective and the timeline. Within 48 hours you get a shortlist with the reasoning written down.",
              showBudget: true,
            })
          }
          className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] tracking-[0.16em] text-gold-hi uppercase active:bg-gold/10"
        >
          <span aria-hidden className="text-[15px]">✦</span>
          Enquire
        </button>
      </div>
    </>
  );
}
