# Launch checklist

The site is built and passing its own checks, but **must not go live** while the
values below are placeholders. Everything in section 1 is a real-world failure,
not a cosmetic one: a wrong `tel:` link is a lost lead, and an invented address
is a Google penalty.

---

## 1. Blocking — the site is broken for its purpose without these

| Item | Where | Current placeholder |
|---|---|---|
| Phone (display) | `src/content/settings/site.json` → `phone` | `050-000-0000` |
| Phone (dial) | `site.json` → `phoneE164` | `+972500000000` |
| WhatsApp number | `site.json` → `whatsapp` | `+972500000000` |
| Email | `site.json` → `email` | `info@example.co.il` |
| Production domain | `site.json` → `domain` **and** `astro.config.mjs` → `site` | `https://ardi-engineers.co.il` |
| Sitemap URL | `public/robots.txt` | same domain |

> The number supplied during the build — `050912660` — is **9 digits**. An
> Israeli mobile number is 10 (`05X` + 7). Get the full number before launch.

`phoneE164` must be bare international format, no spaces and no dashes. A single
dash breaks dialling on some Android handsets. The schema enforces the shape but
cannot know whether the digits are right.

## 2. Blocking — CMS access

| Item | Where |
|---|---|
| GitHub repo owner/name | `public/admin/config.yml` → `backend.repo` |
| OAuth worker URL | `public/admin/config.yml` → `backend.base_url` |
| Sveltia CMS version | `public/admin/index.html` — pinned to `0.106.0`, **confirm against the current release before launch** |

Netlify Identity / Git Gateway is not offered on new Netlify sites, so the CMS
authenticates through a self-hosted `sveltia-cms-auth` Cloudflare Worker:

1. Create a GitHub OAuth App. Callback URL = the worker URL.
2. Deploy `sveltia-cms-auth` to Cloudflare Workers (free tier).
3. Set the worker's env vars: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
   `ALLOWED_DOMAINS`.
4. Give the client's GitHub account write access to the repo.
5. Walk them through the first login on a screen share — this is the one piece
   of real friction in the whole setup.

## 3. Analytics and lead tracking

| Item | Where | Current |
|---|---|---|
| GA4 measurement ID | `site.json` → `ga4Id` | `G-XXXXXXXXXX` |

Tracking stays **off** while the placeholder is in place — `hasAnalytics` in
`src/site.config.ts` gates it. Once a real `G-` ID is in, verify these four
events fire: `phone_click`, `whatsapp_click`, `form_start`, `generate_lead`.

Also connect Google Search Console and submit `/sitemap-index.xml`.

## 4. Netlify Forms

- Deploy once, then **confirm the `lead` form appears in the Netlify dashboard**
  before trusting the AJAX path. Netlify's bot detects the form by parsing the
  built HTML; if it never sees it, submissions vanish silently.
- Send a real test submission and confirm the notification email arrives.
- Free tier caps at **100 submissions/month, spam included**. Watch it for the
  first 60 days.

## 5. Photography

Every image on the site is a branded geometric placeholder. Each one carries a
photography brief in its `note` field — that is the shot list for the photo day.
Required shots:

1. Inspector working on a forklift (mast, lifting system).
2. Inspection beside an overhead bridge crane.
3. Close-up of lifting accessories — slings, chains, shackles, markings.
4. Lifeline / anchor point on a roof.
5. General factory environment, large equipment in frame.
6. Office: computer with the tracking system, phone, preparing a quote.
7. An inspection report / documents (no sensitive details visible).

Replace by adding an `image` path to the block; `PhotoFrame` switches from the
placeholder to a real `<img>` with no other change. Compress before uploading —
CMS uploads bypass Astro's image pipeline by design.

## 6. Legal and business details

- `addressLocality` currently says `ישראל`. If the business has a real
  address, add it — it strengthens local SEO. **Do not invent one**; Google
  penalises fabricated NAP data. The schema deliberately ships country-only.
- Confirm the privacy policy text with the client before publishing.
- Confirm opening hours in `site.json` → `hoursSchema`.

## 7. Pre-launch verification

```bash
npm run build && npm run verify
```

All three must pass:

- `check-rtl` — no physical CSS properties, no raw values outside tokens
- `check-html` — one `<h1>` per page, unique titles and descriptions, canonical, valid JSON-LD
- `check-links` — every internal link and nav href resolves

Then, manually:

- [ ] Google Rich Results test on `/`, `/forklift-inspection`, `/faq`, one article
- [ ] Lighthouse mobile on 4 representative routes — target 95+ performance
- [ ] Tap the phone button on a real iPhone and a real Android; confirm it dials
- [ ] Tap WhatsApp; confirm the pre-filled message appears
- [ ] Submit the form from a phone; confirm the email arrives
- [ ] Keyboard-only pass: skip link, nav, dropdowns, accordion, form
- [ ] Check RTL on real iOS Safari — the chip row and the accordion marker are
      the two known Safari RTL trouble spots
- [ ] SSL active, `www` and apex both resolve
- [ ] `/admin` returns `noindex` and is disallowed in robots.txt

---

## 8. Accessibility (IS 5568 / WCAG 2.1 AA)

Built in, verified with axe-core 4.13 across every route: **zero WCAG 2.0/2.1
A + AA violations**, including with the accessibility menu active.

What is already done:

- Semantic landmarks, one `<h1>` per page, skip link, visible focus everywhere
- Contrast: the CTA orange was darkened to `#C25309` (4.63:1 with white) so
  buttons pass AA at any text size — `#E8620C` from the sketch is 3.40:1 and
  only passes as "large text", which our 17px button type does not qualify as
- Type scale is in `rem`, so the visitor's own browser font-size setting and
  the accessibility menu's text-resize both actually work
- 44px minimum touch targets, `prefers-reduced-motion` respected
- Accessibility menu (`ranbuch/accessibility`, MIT, loaded at idle, no external
  requests) with Hebrew labels, persistent across pages
- `/accessibility` — the accessibility statement, editable from the CMS

Still required before launch:

- [ ] **Name a רכז נגישות (accessibility coordinator)** and put their name,
      phone and email in `/accessibility`. The regulations require a named
      contact; the page currently points at the general contact details.
- [ ] Add the date of the last accessibility review to `/accessibility`
- [ ] Decide whether to enable the menu's text-to-speech / speech-to-text.
      They are off because Hebrew voice coverage is inconsistent and a button
      that silently does nothing is worse than no button. Test on the client's
      own devices before enabling in `AccessibilityMenu.astro`.
- [ ] Screen-reader pass with NVDA or VoiceOver in Hebrew
- [ ] If the client wants a formal accessibility audit certificate, that is a
      licensed accessibility surveyor (מורשה נגישות שירות), not something a
      developer can issue

Re-running the audit later:

```bash
npm i -D axe-core
cp node_modules/axe-core/axe.min.js public/_axe.min.js   # temporary
npm run dev
```

Then in the browser console on any page:

```js
const s = document.createElement('script'); s.src = '/_axe.min.js';
s.onload = async () => console.table((await axe.run()).violations);
document.head.appendChild(s);
```

Delete `public/_axe.min.js` afterwards — it must never ship.
