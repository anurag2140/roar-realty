# Roar Realty — Build & Deployment Plan

**Goal:** Turn the attached one-page design into a complete, production real-estate website with a
non-technical admin backend, deployed on your own domain, at (near) zero recurring cost.

---

## 1. What you have today

The zip is a Claude-Design "DC" component — a single HTML file with a React-style class, plus two
JS files. It is **a beautiful prototype, not a website**:

| Piece | State today | What it needs to become |
|---|---|---|
| Hero, marquee, Chapters I–III, Process, Comparison, Testimonials, Footer | Static markup, hardcoded copy | CMS-driven sections, real content |
| 3D scenes (`roar-3d.js`) — particle skyline, liquid-gold shader, Dubai→Delhi globe | Custom elements, Three.js r128 from a CDN | React components, lazy-loaded, motion/perf guards |
| Properties (9 listings) | Hardcoded array in the JS | Real database + search, filters, detail pages |
| Property images | `image-slot` placeholders | Real photo galleries on an image CDN |
| Contact form | `submit: () => this.setState({sent:true})` — **sends nothing anywhere** | Real lead capture: DB + email + spam protection |
| Pages | One page, anchor links only | ~12 routes incl. property detail, insights, legal |
| SEO | None (no meta, no sitemap, no structured data) | Full metadata, JSON-LD, sitemap, OG images |
| Phone / RERA no. | `+91 98100 00000`, `HRERA-GGM-XXXX-2026` | Real, verified values (see §9) |

**The design itself is excellent and will be preserved exactly** — same palette (`#0A0907`
near-black, `#F4EFE4` ivory, gold `#C6A15B` → `#E8CD8F`), same fonts (Marcellus / Cormorant
Garamond / Jost), same 3D, same grain, marquee, scroll-progress bar, reveal-on-scroll and count-up
animations. Everything new is built *in* that system.

---

## 2. Recommended stack

| Layer | Choice | Cost | Why |
|---|---|---|---|
| Framework | **Next.js 15** (App Router, TypeScript, Tailwind) | Free | Best-in-class SEO + Vercel-native |
| Hosting | **Vercel** | Free (Hobby) — see §3 | Already set up on your side |
| CMS / backend | **Sanity.io**, Studio embedded at `roarrealty.in/studio` | Free | Best non-technical editing UX; image CDN included |
| Images | Sanity's asset CDN | Free (100 GB) | Avoids Vercel's image-optimisation quota entirely |
| Email | **Resend** | Free (3,000/mo, 100/day) | Lead alerts to you + auto-reply to the buyer |
| Spam | **Cloudflare Turnstile** | Free, unlimited | Invisible; no "click the traffic lights" |
| Lead database | **Neon Postgres** (private) | Free (0.5 GB, no card) | Customer data must not sit in a public dataset |
| Rate limiting | **Upstash Redis** | Free (10k cmd/day) | Stops form-flooding |
| Maps | **Leaflet + OpenStreetMap** | Free, **no API key, no credit card** | Google Maps needs billing enabled |
| Analytics | **Vercel Web Analytics** + Google Search Console | Free | Traffic + Google indexing |
| WhatsApp | `wa.me` click-to-chat deep links | Free, no API | The #1 conversion channel for Indian real estate |
| Repo | **GitHub** (personal account) | Free | Vercel auto-deploys on every push |

**Total recurring cost: ₹0** (plus your domain renewal). See §3 for the one honest caveat.

### Why Sanity and not Supabase/Strapi/WordPress

You said "easy to use backend." That means *you* logging in and adding a property in 3 minutes with
15 photos, from your phone if needed. Sanity Studio gives you that out of the box — drag-drop image
upload with crop/focal point, rich text, references, drafts vs. published, revision history and undo.
Supabase would give you a raw SQL table editor; Strapi/WordPress need a paid server. Sanity's free
tier (20 seats, 10,000 documents, 100 GB assets, 1M CDN requests/mo) is far more than this site will
ever use — 10,000 documents is roughly 500 properties + 8,000 leads.

Leads land in the **same** Studio as a "Leads" inbox with New / Contacted / Qualified / Closed
status — so you get a lightweight CRM without a second system to log into.

---

## 3. The one caveat about "completely free" — read this

Vercel's Hobby (free) plan is **restricted to non-commercial, personal use** in their Terms. A
lead-generating website for a real brokerage is commercial. In practice small sites run on Hobby for
years without issue, but Vercel can and does suspend commercial projects found on Hobby.

Three honest options:

| Option | Cost | ToS risk | Notes |
|---|---|---|---|
| **A. Vercel Hobby** | ₹0 | Non-compliant; small but real suspension risk | Works today; you already have the account |
| **B. Vercel Pro** | $20/mo (~₹1,700) | None | Also unlocks 1 TB transfer, team seats, password-protected previews |
| **C. Cloudflare Workers** | ₹0 | **None — commercial use explicitly allowed** | Same Next.js code via `@opennextjs/cloudflare`; unlimited bandwidth |

**My recommendation:** I build the app host-agnostically and deploy to **Vercel Hobby now** (fastest
path to your domain being live). If you ever want zero risk without paying, option C is a
half-day migration — nothing in the codebase has to change. Your call; tell me which and I'll plan
accordingly.

Other free-tier ceilings, so nothing surprises you later:

- Vercel Hobby: 100 GB data transfer/mo, 1M function invocations/mo, 100 deploys/day — a brochure
  site with 5,000 monthly visitors uses maybe 3 % of that.
- Vercel Hobby **cannot connect to a GitHub *organization* repo** — the repo must sit under your
  personal GitHub account. (Minor, but it derails people.)
- Resend free: 100 emails/day. Each lead = 2 emails (you + auto-reply), so ~50 leads/day headroom.
- Sanity free: datasets are **public-read**. Property data is meant to be public anyway, but leads
  must not be. **Decided:** leads go to a private **Neon Postgres** database; the inbox UI is a
  custom panel inside `/studio`, so you still have one place to log in.

---

## 4. Site map

```
/                          Home — the design you approved, CMS-driven
/properties                Search & filter (the real engine)
/properties/[slug]         Property detail — gallery, specs, Glass File, map, enquiry
/properties/[city]/[area]  SEO landing pages (e.g. /properties/gurugram/golf-course-road)
/about                     Story (Chapters I & II), team, Dubai→Delhi timeline
/the-roar-standard         The 6 rules, expanded
/process                   The 5 steps, expanded
/insights                  Blog / market reports — this is what earns Google traffic
/insights/[slug]
/contact                   Form, office map, WhatsApp, phone
/shortlist                 Saved properties (localStorage, no login needed)
/studio                    ← Your admin panel (Sanity)
/privacy  /terms  /disclaimer   Legal (RERA disclaimer required in India)
/sitemap.xml  /robots.txt  /opengraph-image   Auto-generated
404, /thank-you
```

---

## 5. The search engine (`/properties`)

This is where a real-estate site is won or lost. Spec:

- **Free-text search** across name, locality, city, builder
- **Filters:** property type (Apartment / Villa / Plot / Commercial / Off-plan) · price range
  (presets + custom min–max) · bedrooms (1–5+) · city & locality · possession status (Ready /
  Under construction) · possession year · carpet area range · amenities · "Escrow-protected only" ·
  "Glass File ready only"
- **Sort:** newest, price ↑/↓, area ↑/↓, possession date
- **URL-synced state** — `/properties?type=villa&min=3&max=10&city=gurugram` is shareable and
  Google-indexable
- **Server-rendered results** (fast, SEO-visible), infinite-scroll or paginated
- **Mobile:** filters in a bottom sheet with a live result count and "clear all"
- **Shortlist** — heart icon saves to localStorage, no login; `/shortlist` page; "Enquire about all
  4 shortlisted" bulk CTA
- **Compare** — side-by-side table of up to 3 properties
- **Empty state** that converts: "Nothing matches yet — tell us what you want and we'll find it"
  → lead form

---

## 6. Property detail page

Sticky enquiry card · full-screen gallery lightbox (keyboard + swipe) · specification grid ·
**Glass File panel** (title-chain years, litigation scan, encumbrance, RERA no., builder record —
your core differentiator, made visual) · carpet vs. super-built-up price breakdown table · amenities
grid · floor plans (zoomable) · Leaflet map + neighbourhood highlights · video / virtual tour modal ·
brochure download (gated on phone number = a lead) · similar properties · breadcrumbs ·
`RealEstateListing` JSON-LD so listings can appear in Google rich results · sticky mobile bar
(Call · WhatsApp · Enquire).

---

## 7. Every popup / overlay (you asked for this specifically)

1. Mobile navigation drawer (the current design just *hides* nav links under 1000px — a real bug)
2. Property gallery lightbox — arrows, swipe, ESC, thumbnails, counter
3. **"Request Glass File"** enquiry modal — pre-filled with the property, from any card or detail page
4. **"Schedule a site visit"** modal — date + time-slot picker
5. **Exit-intent modal** (desktop mouse-leave; mobile after 35 s + 50 % scroll) — offer a free
   market report; suppressed for 30 days after dismissal or submission via localStorage
6. Brochure-download gate modal
7. Video / virtual-tour modal
8. Mobile filter bottom-sheet
9. Compare drawer
10. Toast notifications (saved to shortlist, form errors, copied link)
11. Cookie / privacy notice (minimal, DPDP-Act-aware)
12. Floating WhatsApp button + sticky mobile CTA bar
13. Success states — inline confirmation *and* `/thank-you` page for ad conversion tracking

All modals get proper focus trapping, ESC-to-close, scroll-lock, `aria-modal`, and respect
`prefers-reduced-motion`.

---

## 8. Backend — what you'll actually see

Log in at **roarrealty.in/studio** with Google. Left sidebar:

```
📋 Leads            New (3) · Contacted · Qualified · Closed
🏠 Properties       Published · Drafts · Featured · By city
🏗  Builders
📍 Localities
👤 Team & Agents
💬 Testimonials
📰 Insights
❓ FAQs
🎛  Homepage         Hero, stats, marquee, pillars, process, comparison
⚙️  Site Settings    Phone, WhatsApp, email, address, RERA no., socials, popups
```

Adding a property: click **+**, type the name (slug auto-generates), drag in photos, fill the specs
form, toggle Published. The live site updates in ~10 seconds via a webhook — no rebuild, no
redeploy, no code.

**Lead flow when someone submits any form:**

```
Form → validate (zod) → Turnstile check → rate-limit → save lead
                                                     ↓
                          ┌──────────────────────────┴─────────────────┐
                    Email to you                            Auto-reply to buyer
              (name, phone, property, page,                ("Consider it heard" —
               UTM source, one-click WhatsApp)              the design's own copy)
```

Plus: honeypot field, submit-timing check, UTM capture, and optional Google Sheet mirror if you
want leads in a spreadsheet too.

---

## 9. What I need from you — content

Separate from API keys. The current design uses placeholders that **cannot go live as-is**:

| Placeholder in the design | Need |
|---|---|
| `+91 98100 00000` | Real phone + WhatsApp number |
| `hello@roarrealty.in` | Real inbox (see Zoho Mail tip in SETUP-KEYS.md — free) |
| `HRERA-GGM-XXXX-2026 (registration in progress)` | **Your actual RERA agent registration number** |
| "12 yrs", "4,200 keys handed over", "100 % escrow-protected" | Confirm these are literally true |
| 3 testimonials (Rohit Khanna, Priya Raghavan, Sameer & Aditi Bhalla) | Real clients + written consent |
| 9 listings (The Camellias, Aravalli Crest…) | Your real inventory + photos, or say "launch with these as illustrative" |
| One Horizon Center, Golf Course Road | Real registered office |
| Logo | You have a JPEG; an SVG or transparent PNG would be much sharper |

**A flag, once, then I'll drop it:** in India, advertising property brokerage without displaying a
valid RERA agent registration number is an offence under RERA §9/§62 in Haryana and UP, and
fabricated testimonials or unverifiable claims ("4,200 keys") fall under the ASCI code and the
Consumer Protection Act's misleading-advertisement provisions. This is your call, not mine — but I'd
be doing you a disservice not to say it before we publish. If real numbers aren't ready, I'll build
with clearly-marked illustrative content and a `NEXT_PUBLIC_LAUNCH_MODE=preview` flag that keeps the
site `noindex` until you flip it.

---

## 10. Build phases

| Phase | What ships | You see |
|---|---|---|
| **0** | Accounts + keys (you, ~60 min — see SETUP-KEYS.md) | — |
| **1** | Next.js scaffold, design tokens, fonts, layout, all 3D ported to React, homepage static | **roarrealty.in live with the design, SSL on** |
| **2** | Sanity Studio + all schemas + seeded with the design's own content | `/studio` — you can log in and edit |
| **3** | Homepage fully CMS-driven; every section editable | Change a stat in Studio → site updates |
| **4** | `/properties` search engine + detail pages + shortlist + compare | The real product |
| **5** | About, Standard, Process, Insights, Contact, legal pages | Complete site map |
| **6** | Lead pipeline: forms → DB → email → Turnstile; all 13 popups | Submit a test form, get the email |
| **7** | SEO (metadata, JSON-LD, sitemap, OG images), analytics, Lighthouse + accessibility pass | Search Console verified |
| **8** | Cross-browser/device QA, content load, go-live, handover guide | Launch |

Phases 1–3 can land in one working session once keys exist; 4–6 are the bulk; 7–8 is polish and QA.
I'll deploy continuously, so you can watch it take shape at a preview URL from phase 1 onward.

---

## 11. Decisions — LOCKED ✅

*(Confirmed 30 July 2026.)*

1. **Hosting — Vercel Hobby.** ₹0/month, accepting the non-commercial-ToS risk. I'll write the code
   host-agnostically (no Vercel-only APIs in business logic) so a move to Cloudflare Workers or
   Vercel Pro is a half-day job, not a rewrite. Repo goes under your **personal** GitHub account.
2. **Leads — private Neon Postgres**, never the public Sanity dataset. Schema: name, phone, email,
   message, budget, property ref, source page, UTM params, IP hash, status
   (New/Contacted/Qualified/Closed), notes, timestamps. Inbox is a custom panel inside `/studio`
   with search, status filter and **CSV export**, so it's one login and your data is portable.
3. **3D — auto-downgrade.** Full Three.js scenes by default; a hand-crafted static gold-gradient
   fallback when `prefers-reduced-motion`, `navigator.connection.saveData`, low
   `hardwareConcurrency`/`deviceMemory`, or no WebGL. Scenes lazy-load only when scrolled into view
   and pause when offscreen (the existing code already does the pausing — I'll keep that).
4. **Content — samples now, `noindex` until real.** The 9 designed listings and 3 testimonials ship
   as clearly-labelled illustrative content. Site-wide `noindex` via `NEXT_PUBLIC_LAUNCH_MODE=preview`
   until you flip it to `live` in Vercel's env vars — one setting, no redeploy needed on my side.
   Placeholder phone/RERA render as visible `TBC` markers so nothing fake goes out accidentally.

---

## 12. What "done" means

- [ ] Lighthouse ≥ 95 performance / 100 SEO / ≥ 95 accessibility on mobile
- [ ] Works on iOS Safari, Android Chrome, desktop Chrome/Safari/Firefox/Edge, 320 px → 2560 px
- [ ] Every form tested end-to-end; you receive the email; the lead is stored
- [ ] Every popup opens, closes on ESC/backdrop, traps focus, is keyboard-navigable
- [ ] Search returns correct results for every filter combination, shareable by URL
- [ ] `roarrealty.in` and `www.roarrealty.in` both work, HTTPS, correct redirect
- [ ] Sitemap submitted to Google Search Console, properties indexable
- [ ] You can add/edit/delete a property unaided in under 5 minutes
- [ ] A written admin guide + a short screen-recorded walkthrough

---

*Next step: work through `SETUP-KEYS.md`, then answer §11. I start building the moment I have both.*
