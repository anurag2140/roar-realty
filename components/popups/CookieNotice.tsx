"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "roar_cookie_ack";

/**
 * Minimal notice. We set no advertising cookies and Vercel Analytics is
 * cookieless, so this is disclosure rather than a consent gate — which is why
 * there's no "reject" button to reject anything with.
 */
export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        // Let the page settle before adding another thing to look at.
        const t = window.setTimeout(() => setShow(true), 1500);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* storage blocked — skip the notice rather than nag every load */
    }
  }, []);

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className="roar-no-print fixed bottom-0 left-0 z-1150 w-full border-t border-gold/20 bg-ink-2/95 px-5 py-4 backdrop-blur-md sm:bottom-5 sm:left-5 sm:w-auto sm:max-w-sm sm:border"
    >
      <p className="text-xs leading-relaxed text-ivory/55">
        We use privacy-friendly, cookieless analytics to understand which pages
        are useful. We don&apos;t track you across other sites.{" "}
        <Link href="/privacy" className="text-gold-hi underline underline-offset-2">
          Privacy policy
        </Link>
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
          setShow(false);
        }}
        className="mt-3 border border-gold/40 px-4 py-2 text-[11px] tracking-[0.2em] text-gold-hi uppercase transition-colors hover:bg-gold/10"
      >
        Understood
      </button>
    </div>
  );
}
