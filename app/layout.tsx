import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { isLive, siteUrl } from "@/lib/env";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/**
 * Root layout is deliberately bare: it owns <html>/<body> and nothing else.
 * Site chrome (nav, footer, popups) lives in app/(site)/layout.tsx so that
 * /studio can render the Sanity Studio full-bleed without it.
 */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Until real inventory and a RERA number are in, the whole site stays out of
  // the index. Flip NEXT_PUBLIC_LAUNCH_MODE to `live` to reverse this.
  robots: isLive
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: siteUrl,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0907",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${fontVariables} no-js`} suppressHydrationWarning>
      <head>
        {/*
          Remove `no-js` before first paint. Reveal-on-scroll starts at
          opacity:0, so without JS we must never apply it — this is the switch,
          and it has to be render-blocking to avoid a flash of hidden content.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js');`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
