# Accounts & API Keys — step-by-step

Everything here is **free** and needs **no credit card**. Budget ~60 minutes.

Work top to bottom. As you get each value, paste it into the block at the bottom of this file
(`ENV VALUES TO SEND ME`) and send me the whole block when you're done — or send them one at a time,
I can start with partial keys.

> ⚠️ **Never paste secrets into a public place.** These go in Vercel's encrypted Environment
> Variables, not into the code. Keys marked 🔒 are secret; keys marked 🌐 are safe to be public.

---

## 1. GitHub — the code lives here ⏱ 5 min

Vercel deploys automatically from GitHub every time I push.

1. Go to https://github.com/signup — sign up (free) if you don't have an account.
2. Verify your email.
3. Tell me your **GitHub username**.

> **Important Vercel quirk:** on the free Hobby plan, Vercel **cannot** deploy from a repo owned by a
> GitHub *Organization* — only from your **personal** account. So create the repo under your own
> username, not under a new org.

**→ Send me:** `GITHUB_USERNAME = ______`

I'll then send you an invite to the repo, or you create it empty and I push to it — your choice.

---

## 2. Vercel — hosting + your domain ⏱ 10 min

You're already logged in. Two things to do:

### 2a. Connect GitHub
1. https://vercel.com/account/login-connections → **Connect** GitHub → authorise.

### 2b. Add your domain
1. https://vercel.com/dashboard → your project (after I deploy) → **Settings → Domains**.
2. Add `roarrealty.in` **and** `www.roarrealty.in`.
3. Vercel shows DNS records. Go to **your registrar** (GoDaddy / Namecheap / Hostinger / BigRock —
   whichever you bought from) → DNS management → add:
   - `A` record, name `@`, value `76.76.21.21`
   - `CNAME` record, name `www`, value `cname.vercel-dns.com`
   - (Or point the nameservers to Vercel's — Vercel will tell you which is simpler for your registrar.)
4. Propagation takes 5 min – 2 hrs. SSL is issued automatically and free.

**→ Send me:**
- `DOMAIN = ______` (confirm the exact domain you bought — `roarrealty.in`? `.com`? something else?)
- `REGISTRAR = ______` (so I can give you exact click-by-click DNS steps for that panel)

---

## 3. Sanity — your admin backend 🔑 ⏱ 15 min

This is the CMS you'll log into daily.

1. Go to https://www.sanity.io/ → **Get started** → sign in **with Google** (use the Google account
   you want to be the admin — ideally a company one).
2. You'll land on https://www.sanity.io/manage → **Create new project**.
   - Project name: `Roar Realty`
   - Dataset: `production` (leave the default; keep "public")
   - Plan: **Free**
3. Open the project → **Settings** (or the project overview). Copy the **Project ID** — an
   8-character string like `x7k2m9p1`.

   **→ `NEXT_PUBLIC_SANITY_PROJECT_ID = ______`** 🌐
   **→ `NEXT_PUBLIC_SANITY_DATASET = production`** 🌐

4. Now create two API tokens. Go to **API** tab → **Tokens** → **Add API token**.

   **Token 1 — for reading unpublished drafts (preview):**
   - Name: `web-read`
   - Permissions: **Viewer**
   - Click Save → **copy the token immediately** (it is shown only once).

   **→ `SANITY_API_READ_TOKEN = sk...`** 🔒

   **Token 2 — for writing (leads, form submissions):**
   - Name: `web-write`
   - Permissions: **Editor**
   - Save → copy.

   **→ `SANITY_API_WRITE_TOKEN = sk...`** 🔒

5. Same **API** tab → **CORS origins** → **Add CORS origin**:
   - `http://localhost:3333` — allow credentials ✅
   - `http://localhost:3000` — allow credentials ✅
   - `https://roarrealty.in` — allow credentials ✅
   - `https://www.roarrealty.in` — allow credentials ✅

   (If your domain differs, use yours. I'll add the Vercel preview URLs myself later.)

6. **Invite your team** (optional, up to 20 free seats): project → **Members** → Invite by email.

---

## 4. Resend — sending lead emails 🔑 ⏱ 15 min

So you actually receive an email the second someone fills a form.

1. https://resend.com/signup → sign up (GitHub or email).
2. **API Keys** → **Create API Key** → name `roar-production`, permission **Sending access** → copy.

   **→ `RESEND_API_KEY = re_...`** 🔒

3. **Domains** → **Add Domain** → enter `roarrealty.in` → region **ap-south-1 (Mumbai)** if offered.
4. Resend shows 3–4 DNS records (MX, TXT for SPF, TXT for DKIM, optionally DMARC). Add every one of
   them at your registrar's DNS panel exactly as shown, then click **Verify**. Takes 5–30 min.
   - This is what stops your emails landing in spam. Don't skip it.
5. Once verified you can send from `hello@roarrealty.in`.

**→ Send me:**
- `LEAD_NOTIFY_EMAIL = ______` (where *you* want lead alerts — can be your Gmail)
- `LEAD_FROM_EMAIL = hello@roarrealty.in` (or whatever you prefer as the sender)

### 💡 Free business inbox
Resend *sends* mail but doesn't *receive* it. To actually read mail sent to `hello@roarrealty.in`
free: **Zoho Mail Forever Free plan** — https://www.zoho.com/mail/ → 5 users, 5 GB each, your own
domain. (Google Workspace has no free tier any more.) 15 min of DNS setup. Optional but recommended.

---

## 5. Cloudflare Turnstile — invisible spam protection 🔑 ⏱ 5 min

Free and unlimited. Stops bots without making real buyers solve puzzles.

1. https://dash.cloudflare.com/sign-up → free account (you do **not** need to move your domain to
   Cloudflare).
2. Left sidebar → **Turnstile** → **Add widget**.
   - Widget name: `roar-realty`
   - Hostnames: `roarrealty.in`, `www.roarrealty.in`, `localhost`
   - Widget mode: **Managed**
3. Create → you get two keys.

   **→ `NEXT_PUBLIC_TURNSTILE_SITE_KEY = 0x4...`** 🌐
   **→ `TURNSTILE_SECRET_KEY = 0x4...`** 🔒

---

## 6. Neon — the private lead database 🔑 ⏱ 5 min

Your customers' names and phone numbers live here, **not** in the public Sanity dataset. Free tier,
no credit card.

1. https://console.neon.tech/signup → sign in with Google or GitHub.
2. **Create project**:
   - Name: `roar-realty`
   - Postgres version: leave default
   - Region: **AWS ap-southeast-1 (Singapore)** — closest available to India
3. On the project dashboard, find **Connection string** → select the **Pooled connection** →
   click the eye icon to reveal the password → **Copy snippet**. It looks like
   `postgresql://user:password@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

   **→ `DATABASE_URL = postgresql://...`** 🔒

That's it — I create the tables myself from code.

---

## 7. Upstash Redis — rate limiting 🔑 ⏱ 5 min

Stops someone submitting your form 5,000 times. Free tier is plenty.

1. https://console.upstash.com/login → sign in with Google/GitHub.
2. **Create Database** → name `roar-realty` → type **Regional** → region **ap-south-1 (Mumbai)**
   → **Free** plan.
3. Open the database → scroll to **REST API** → copy both values.

   **→ `UPSTASH_REDIS_REST_URL = https://...upstash.io`** 🔒
   **→ `UPSTASH_REDIS_REST_TOKEN = A...`** 🔒

---

## 8. Google Search Console + Analytics ⏱ 10 min — *do after we're live*

Free. This is how Google finds and ranks your listings.

1. **Search Console:** https://search.google.com/search-console → Add property → **Domain** →
   `roarrealty.in` → it gives you a TXT record → add at your registrar → Verify.
   Then I submit the sitemap.
2. **Analytics (optional):** https://analytics.google.com → Admin → Create property →
   `Roar Realty` → India / INR → Web data stream for `https://roarrealty.in` → copy the
   **Measurement ID** (`G-XXXXXXXXXX`).

   **→ `NEXT_PUBLIC_GA_ID = G-______`** 🌐 *(optional — Vercel Analytics is already free and simpler)*

---

## 9. Optional extras — only if you want them

| Service | For | Free? | Notes |
|---|---|---|---|
| **Meta Pixel** | Facebook/Instagram ad retargeting | Free | business.facebook.com → Events Manager → copy Pixel ID |
| **Google Maps** | Google-branded maps instead of OpenStreetMap | Free tier, **needs a card on file** | Only if you specifically want Google's look — I'm defaulting to Leaflet/OSM which needs nothing |
| **Calendly / Cal.com** | Self-serve site-visit booking | Cal.com free | Otherwise the visit-request modal just emails you |
| **Sentry** | Error monitoring | Free 5k errors/mo | Nice-to-have; tells you if the site breaks for a user |

---

## 10. Content to send alongside the keys

Not keys, but I can't finish without them (see PLAN.md §9). **None of these block the build** — we
agreed to launch with illustrative samples behind a `noindex` flag — but the sooner they land, the
sooner you can flip the site public:

- [ ] Real phone number + WhatsApp number (with country code)
- [ ] Real email address
- [ ] Registered office address
- [ ] **RERA agent registration number** (HRERA Gurugram / UP-RERA) — or tell me it's genuinely pending
- [ ] Legal entity name + CIN (for the footer / terms)
- [ ] Confirmation that "12 years", "4,200 keys handed over", "100 % escrow-protected" are accurate
- [ ] Logo as **SVG or transparent PNG** (I have the JPEG; it will look soft at large sizes)
- [ ] Social profile links (Instagram / LinkedIn / YouTube)
- [ ] Real listings: name, location, price, beds, area, status, **and photos** — or a "launch with
      the 9 samples" instruction
- [ ] Real testimonials + consent, or "remove the testimonials section for now"

---

## ENV VALUES TO SEND ME

Copy this block, fill it in, send it back:

```env
# --- Accounts ---
GITHUB_USERNAME=
DOMAIN=
REGISTRAR=

# --- Sanity (CMS) ---
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=

# --- Resend (email) ---
RESEND_API_KEY=
LEAD_NOTIFY_EMAIL=
LEAD_FROM_EMAIL=

# --- Cloudflare Turnstile (spam) ---
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# --- Neon Postgres (private lead database) ---
DATABASE_URL=

# --- Upstash Redis (rate limiting) ---
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# --- Optional ---
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=

# --- Business details ---
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_WHATSAPP=
NEXT_PUBLIC_RERA_NUMBER=
```

---

### Minimum to start building

I don't need all of it at once. Do them in this order:

**Batch 1 — send these first (§1, §2, §3 ≈ 30 min).** GitHub username, domain + registrar, and
Sanity's four values. That unblocks phases 1–5: the entire site, all pages, the search engine and
the CMS.

**Batch 2 — grab these while I build (§4, §5, §6, §7 ≈ 30 min).** Resend, Turnstile, Neon, Upstash.
Needed for phase 6, the lead pipeline.

**Batch 3 — after we're live (§8).** Search Console and Analytics.
