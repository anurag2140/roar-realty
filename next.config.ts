import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sanity Studio renders with styled-components; without this the Studio
  // flashes unstyled on first paint.
  compiler: {
    styledComponents: true,
  },

  images: {
    // Images are served straight from Sanity's CDN (free, unmetered) rather
    // than Vercel's image optimizer, which is metered on the Hobby plan.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // The lead API must never be cached by a CDN.
        source: "/api/leads/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },

  async redirects() {
    return [
      // The prototype used on-page anchors; keep those links working.
      { source: "/story", destination: "/about", permanent: true },
      { source: "/standard", destination: "/the-roar-standard", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
