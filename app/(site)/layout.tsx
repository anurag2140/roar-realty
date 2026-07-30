import { Analytics } from "@vercel/analytics/next";
import { getSiteSettings } from "@/lib/sanity/queries";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { FilmGrain } from "@/components/chrome/FilmGrain";
import { RevealProvider } from "@/components/chrome/RevealProvider";
import { GoldTone } from "@/components/chrome/GoldTone";
import { ToastProvider } from "@/components/ui/Toast";
import { ShortlistProvider } from "@/components/shortlist/ShortlistProvider";
import { EnquiryProvider } from "@/components/popups/EnquiryProvider";
import { FloatingActions } from "@/components/chrome/FloatingActions";
import { ExitIntent } from "@/components/popups/ExitIntent";
import { CookieNotice } from "@/components/popups/CookieNotice";
import { PreviewBanner } from "@/components/chrome/PreviewBanner";
import { AnnouncementBar } from "@/components/chrome/AnnouncementBar";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <ToastProvider>
      <ShortlistProvider>
        <EnquiryProvider settings={settings}>
          <RevealProvider>
            <GoldTone tone={settings?.goldTone} />
            <ScrollProgress />
            <FilmGrain enabled={settings?.grainOverlay !== false} />

            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-1200 focus:bg-gold-hi focus:px-5 focus:py-3 focus:text-sm focus:tracking-[0.2em] focus:text-ink focus:uppercase"
            >
              Skip to content
            </a>

            <PreviewBanner />
            <AnnouncementBar settings={settings} />
            <SiteHeader settings={settings} />

            <main id="main">{children}</main>

            <SiteFooter settings={settings} />
            <FloatingActions settings={settings} />
            <ExitIntent settings={settings} />
            <CookieNotice />
          </RevealProvider>
        </EnquiryProvider>
      </ShortlistProvider>

      <OrganizationJsonLd settings={settings} />
      <Analytics />
    </ToastProvider>
  );
}
