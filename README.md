# Roar Realty

Property website for Roar Realty India — Next.js 16 + Sanity CMS + Neon Postgres,
deployed on Vercel.

Live site: https://roarrealty.in · Admin: https://roarrealty.in/studio

---

## Running it locally

```bash
npm install
npm run dev
```

Requires Node 20+. Copy `.env.example` to `.env.local` and fill it in — see
[docs/SETUP-KEYS.md](docs/SETUP-KEYS.md) for where each value comes from.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run seed` | Load the launch content into Sanity (safe to re-run) |
| `npm run seed -- --force` | Same, but overwrites existing documents |
| `npm run db:push` | Sync the Neon lead tables to `lib/db/schema.ts` |

---

## How it's put together

```
app/
  (site)/          Public pages — share the nav, footer and popup chrome
  studio/          Sanity Studio, mounted at /studio
  api/
    leads/         Password-gated read/update for the Studio inbox
    properties/    Resolves shortlist ids saved in the browser
    revalidate/    Sanity webhook target
components/
  home/            Homepage sections
  property/        Cards, search filters, gallery, Glass File, map
  popups/          Enquiry modal, exit intent, cookie notice
  three/           WebGL scenes + capability detection + static fallbacks
  forms/           Lead form, Turnstile
lib/
  sanity/          Client, GROQ queries, typed content model
  db/              Drizzle schema for Neon
  leads/           Validation, rate limiting, email, server action
  content/         Launch copy (also the seed source)
sanity/            Schemas, Studio structure, Leads panel
```

### Where content lives

| Data | Home | Why |
|---|---|---|
| Properties, pages, testimonials, insights | Sanity | Editor-friendly, free tier, image CDN |
| Customer enquiries | Neon Postgres | Sanity's free datasets are **public-read** — customer phone numbers must not be |
| Rate-limit counters | Neon Postgres | Avoids a separate Redis dependency |

### Two things that will bite you if you don't know them

1. **`sanity` must never be imported from a Server Component.** Next resolves
   its `swr` dependency through the `react-server` export condition there, which
   has no default export, and the build fails. `components/studio/StudioRoot.tsx`
   is the client boundary that keeps the Studio out of the RSC graph.

2. **`rate_limits` needs its UNIQUE index.** The limiter uses
   `ON CONFLICT DO NOTHING` to detect an existing window. With a plain index
   there's never a conflict, every request inserts a fresh row with count 1, and
   the limit silently never trips.

---

## Going live

The site is **live by default**. Setting `NEXT_PUBLIC_SITE_MODE=preview` in
Vercel and redeploying pulls it back out of search:

- returns `noindex, nofollow` on every page
- serves a `Disallow: /` robots.txt and an empty sitemap
- shows a "preview mode" bar at the top

The switch deliberately reads `NEXT_PUBLIC_SITE_MODE`, not the older
`NEXT_PUBLIC_LAUNCH_MODE`. That older variable is still set to `preview` in
Vercel and is now ignored; delete it whenever convenient.

Placeholder testimonials (`illustrative: true`) are hidden automatically while
the site is live, so nothing labelled "placeholder" can reach a public page.

---

## Images

Served straight from Sanity's CDN, not Next's image optimizer — Vercel meters
image transformations on the Hobby plan and Sanity doesn't. That's why the
codebase uses `<img>` with `imageUrl()` / `imageSrcSet()` rather than
`next/image`.

## 3D scenes

Three.js is code-split and only fetched when a scene scrolls into view on a
device that can handle it. `components/three/capability.ts` decides; anything
that fails falls back to a hand-built static gradient. Append `?force3d=1` to
any URL to bypass both gates for testing.
