"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contact } from "@/lib/env";
import { telLink, whatsappLink } from "@/lib/site";
import { useEnquiry } from "@/components/popups/EnquiryProvider";
import type { SiteSettings } from "@/lib/sanity/types";

/**
 * Floating WhatsApp button (all viewports) plus a sticky Call / WhatsApp /
 * Enquire bar on mobile. WhatsApp is the highest-converting channel for Indian
 * property, so it's never more than one tap away.
 */
export function FloatingActions({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const { open } = useEnquiry();
  const [visible, setVisible] = useState(false);

  // Environment variables win over CMS values, so the number can be corrected
  // in Vercel without waiting on a content edit.
  const phone = contact.phone || settings?.phone || "";
  const whatsapp = contact.whatsapp || settings?.whatsapp || phone;

  const wa = whatsapp
    ? whatsappLink(whatsapp, "Hello Roar Realty — I'd like to discuss a property.")
    : "";
  const tel = telLink(phone);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The Studio is not the marketing site.
  if (pathname?.startsWith("/studio")) return null;

  return (
    <>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className={`roar-no-print fixed right-5 bottom-24 z-1050 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 sm:bottom-8 ${
            visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
          </svg>
        </a>
      )}

      {/* Mobile action bar. Hidden on the shortlist page, which has its own CTA. */}
      <div className="roar-no-print fixed inset-x-0 bottom-0 z-1050 grid grid-cols-3 border-t border-gold/20 bg-ink-2/95 backdrop-blur-md sm:hidden">
        {tel ? (
          <a
            href={tel}
            className="flex flex-col items-center gap-1 py-3 text-[10px] tracking-[0.18em] text-ivory/70 uppercase"
          >
            <span aria-hidden className="text-base">📞</span>
            Call
          </a>
        ) : (
          <span className="flex flex-col items-center gap-1 py-3 text-[10px] tracking-[0.18em] text-ivory/25 uppercase">
            <span aria-hidden className="text-base">📞</span>
            Call
          </span>
        )}

        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 border-x border-gold/15 py-3 text-[10px] tracking-[0.18em] text-ivory/70 uppercase"
          >
            <span aria-hidden className="text-base">💬</span>
            WhatsApp
          </a>
        ) : (
          <span className="flex flex-col items-center gap-1 border-x border-gold/15 py-3 text-[10px] tracking-[0.18em] text-ivory/25 uppercase">
            <span aria-hidden className="text-base">💬</span>
            WhatsApp
          </span>
        )}

        <button
          type="button"
          onClick={() =>
            open({
              formType: "enquiry",
              title: "Speak to us",
              description:
                "Tell us what you're looking for. Within 48 hours you'll have a curated shortlist and a fixed, written fee.",
              showBudget: true,
            })
          }
          className="flex flex-col items-center gap-1 py-3 text-[10px] tracking-[0.18em] text-gold-hi uppercase"
        >
          <span aria-hidden className="text-base">✦</span>
          Enquire
        </button>
      </div>
    </>
  );
}
