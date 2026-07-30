# Go-live checklist

The site is built, deployed and working — but deliberately **invisible to
Google** until you finish this list. Work top to bottom.

---

## 1. Your admin panel

Open **https://roarrealty.in/studio** and sign in with the Google account you
used to create the Sanity project.

The sidebar has:

- **Leads** — every enquiry, with New / Contacted / Qualified / Closed status,
  notes, one-click WhatsApp, and CSV export. Password: see the
  `LEADS_ADMIN_PASSWORD` value in Vercel's environment variables.
- **Properties** — your listings, plus saved views for Featured, Illustrative
  samples, and Missing photos.
- **Localities, Builders, Team, Testimonials, Insights, FAQs**
- **Homepage** — every headline, stat and paragraph on the front page
- **Site settings** — phone, WhatsApp, email, address, RERA number, socials,
  brand gold tone, 3D on/off, exit popup copy

Publishing anything updates the live site in about ten seconds.

---

## 2. Fill in Site settings — **required**

Studio → **Site settings**. These are blank on purpose: the design shipped with
invented values (`+91 98100 00000`, `HRERA-GGM-XXXX-2026`) and a fake phone
number that looks real is more dangerous than an obvious gap. Anywhere a value
is missing, the site shows a dashed ⚠ TBC marker instead.

- [ ] **Phone** — real number
- [ ] **WhatsApp number** — with country code, e.g. `+919810000000`. This powers
      the floating WhatsApp button, which is the single highest-converting
      element on the site.
- [ ] **Email**
- [ ] **Office address**
- [ ] **RERA agent registration number** ← the one that legally matters
- [ ] **Registered entity name** and CIN
- [ ] **Social profile links**
- [ ] **Logo** — upload an SVG or transparent PNG. The JPEG currently in use
      will look soft at large sizes.

---

## 3. Replace the sample content

Nine listings and three testimonials were seeded from the design so the site
isn't empty. **All are flagged `illustrative`**, which shows a "Sample" badge on
the card, a warning banner on the listing page, and keeps them out of Google.

- [ ] Add your real listings (Properties → **+**)
- [ ] Delete the samples, or untick "Illustrative sample" on any that are real
- [ ] Replace the three testimonials with real client quotes **you have written
      consent to publish**, and untick their illustrative flag
- [ ] Check Properties → **Missing photos** is empty

**On the numbers in the copy:** the homepage claims "12 years", "4,200 keys
handed over" and "100% escrow-protected". Confirm each is literally true, or
edit them in Studio → Homepage. Unverifiable advertising claims fall under the
ASCI code and the Consumer Protection Act's misleading-advertisement provisions.

---

## 4. Connect the Sanity webhook

Without this, content changes take up to an hour to appear instead of ten seconds.

1. https://www.sanity.io/manage → your project → **API** → **Webhooks** → Create
2. **URL**: `https://roarrealty.in/api/revalidate`
3. **Dataset**: `production`
4. **Trigger on**: Create, Update, Delete
5. **Filter**:
   ```
   _type in ["property","homepage","siteSettings","testimonial","insight","faq","locality","builder","teamMember"]
   ```
6. **Projection**:
   ```
   {"_type": _type, "slug": slug.current}
   ```
7. **Secret**: the `SANITY_REVALIDATE_SECRET` value from Vercel
8. **HTTP method**: POST

---

## 5. Add the CORS origins in Sanity

https://www.sanity.io/manage → project → **API** → **CORS origins**. Add, each
with "Allow credentials" ticked:

- `https://roarrealty.in`
- `https://www.roarrealty.in`
- `http://localhost:3000`

Without these the Studio won't load on your domain.

---

## 6. Flip the switch

Vercel → project → **Settings** → **Environment Variables** →
`NEXT_PUBLIC_LAUNCH_MODE` → change `preview` to `live` → **Redeploy**.

That single change removes the preview bar, allows indexing, publishes the
sitemap, and opens robots.txt.

---

## 7. Then, and only then, tell Google

1. **Search Console**: https://search.google.com/search-console → Add property →
   **Domain** → `roarrealty.in` → add the TXT record it gives you at your
   registrar → Verify.
2. Submit `https://roarrealty.in/sitemap.xml`.
3. Optional: **Analytics** at https://analytics.google.com — create a property,
   copy the `G-XXXXXXXXXX` Measurement ID, and send it to me to wire in. Vercel
   Analytics is already running and needs nothing.

---

## 8. Optional hardening

- [ ] **Cloudflare Turnstile** (§5 of SETUP-KEYS.md) — free, invisible bot
      protection. Add both keys in Vercel and the widget switches itself on with
      no code change. Until then the form is protected by a honeypot, a
      submit-timing check, and per-IP/per-phone rate limits.
- [ ] **Zoho Mail free plan** — so `hello@roarrealty.in` can *receive* mail.
      Resend only sends.
- [ ] **Change `LEADS_ADMIN_PASSWORD`** in Vercel if you want a password you
      chose yourself.

---

## What's already done

- ✅ Domain live with SSL, `www` redirecting
- ✅ Resend verified for `roarrealty.in` — lead alerts and buyer auto-replies send
      from your own domain
- ✅ Lead pipeline tested end to end: form → Neon → email → Studio inbox
- ✅ Rate limiting verified (3/min, 25/day per IP, 5/hour per phone)
- ✅ IP addresses stored hashed, never raw
- ✅ Privacy policy, terms, and RERA disclaimer written
- ✅ Structured data for Google (organisation, listings, breadcrumbs, FAQs)
- ✅ Mobile navigation drawer — the original design had none below 1000px
- ✅ Keyboard and screen-reader support on every modal, form and gallery
