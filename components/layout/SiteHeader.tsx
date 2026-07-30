"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { imageUrl } from "@/lib/sanity/image";
import { useShortlist } from "@/components/shortlist/ShortlistProvider";
import type { SiteSettings } from "@/lib/sanity/types";

export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { ids, ready } = useShortlist();

  const logo = imageUrl(settings?.logo, 128, 128) || "/logo.jpeg";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes. Syncing UI state to an
  // external event (navigation) is exactly what an effect is for.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.dataset.scrollLocked = "true";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      delete document.body.dataset.scrollLocked;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`roar-no-print sticky top-0 z-900 flex items-center justify-between border-b px-5 py-3 backdrop-blur-[18px] transition-colors duration-300 lg:px-10 lg:py-3.5 ${
          scrolled
            ? "border-gold/20 bg-ink/80"
            : "border-gold/15 bg-ink/55"
        }`}
      >
        <Link href="/" className="flex items-center gap-3.5 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt=""
            width={44}
            height={44}
            className="block h-11 w-11 rounded-lg object-cover"
          />
          <span className="font-display text-[17px] tracking-[0.22em] text-ivory lg:text-[19px]">
            ROAR REALTY
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`text-[13px] tracking-[0.18em] uppercase no-underline transition-colors ${
                  isActive(link.href)
                    ? "text-gold-hi"
                    : "text-ivory/65 hover:text-gold-hi"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/shortlist"
            aria-label={`Shortlist${ready && ids.length ? `, ${ids.length} saved` : ""}`}
            className="relative hidden text-ivory/65 transition-colors hover:text-gold-hi sm:block"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {ready && ids.length > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-ink">
                {ids.length}
              </span>
            )}
          </Link>

          <Link
            href="/contact"
            className="hidden px-5 py-2.5 text-[13px] font-normal tracking-[0.18em] text-ink uppercase no-underline transition-all hover:brightness-110 sm:inline-block"
            style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
          >
            Speak to us
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center text-ivory lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer. The prototype hid the nav links below 1000px with no
          replacement, leaving phones with no way to navigate at all. */}
      <div
        id="mobile-menu"
        className={`roar-no-print fixed inset-0 z-1200 lg:hidden ${
          menuOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          role="dialog"
          aria-modal={menuOpen || undefined}
          aria-label="Menu"
          className={`absolute top-0 right-0 flex h-full w-[min(360px,86vw)] flex-col border-l border-gold/20 bg-ink-2 transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
            <span className="font-display text-sm tracking-[0.22em] text-ivory">MENU</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center text-2xl leading-none text-ivory/60 hover:text-gold-hi"
            >
              ×
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? 0 : -1}
                className={`border-b border-gold/10 py-4 font-display text-xl no-underline transition-colors ${
                  isActive(link.href) ? "text-gold-hi" : "text-ivory hover:text-gold-hi"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shortlist"
              tabIndex={menuOpen ? 0 : -1}
              className="border-b border-gold/10 py-4 font-display text-xl text-ivory no-underline hover:text-gold-hi"
            >
              My shortlist{ready && ids.length ? ` (${ids.length})` : ""}
            </Link>
          </div>

          <div className="border-t border-gold/15 p-6">
            <Link
              href="/contact"
              tabIndex={menuOpen ? 0 : -1}
              className="block w-full py-4 text-center text-[13px] tracking-[0.2em] text-ink uppercase no-underline"
              style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
            >
              Speak to us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
