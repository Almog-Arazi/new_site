# Review Round Two — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every open item from the client's two review rounds so the site reads as one engineering company across every screen width, then expand.

**Architecture:** Astro 5 static, Hebrew RTL, tokens-first CSS. Nothing here introduces a framework or a dependency. Most fixes are surgical edits inside existing components; the content and SEO work edits markdown and JSON under `src/content/`. Tasks are grouped into four phases matching the client's own priority order, and inside each phase into disjoint file-ownership streams so several agents can run at once without touching the same file.

**Tech Stack:** Astro 5, vanilla CSS with custom properties (`src/styles/tokens.css`), Sveltia CMS, Vercel.

**Backup point:** `origin/main` at `862a468` — pushed to `https://github.com/Almog-Arazi/new_site` on 2026-08-16. Any task can be reverted with `git revert`, and the whole round with `git reset --hard 862a468`.

---

## 0. What the audit found before anything was written

This matters more than any single task below, so it goes first.

**Round-one work landed today at 17:14 (`951c86c`), with deploy fixes at 18:05–18:07.** The second feedback document was written against a build that predates it. Measured against the current repo:

| Feedback #2 item | Claimed state | Measured state in repo |
|---|---|---|
| 1 — process is a vertical list, not a circle | not done | **ring is live** — `.cycle--ring` renders a 3×3 grid, `grid-template-areas: "q1 l12 q2" "l41 hub l23" "q4 l34 q3"`, four steps at the corners, arrows between them |
| 6 — "ניסיון, מקצועיות ושירות" cards still white/grey | not done | **cards are navy** — `rgb(20, 34, 74)` |
| 7 — "ציוד שאנחנו בודקים" heading + cards | not done | **heading already "ציוד שאנחנו בודקים"; cards navy** |
| 8 — "בדיקות מקצועיות עם אחריות ושירות אישי" cards | not done | **cards navy** |
| §4 (round 1) — "30 שניות" on the form | removed? | **gone** — no occurrence anywhere in `src/` |
| §5 (round 1) — "נחזור אליכם עם זמינות ומחיר" | reword | **already "נחזור אליכם לתיאום ולמתן הצעת מחיר"** |
| §8/§10 (round 1) — section headings | rename | **already "השירותים שלנו" and "ציוד שאנחנו בודקים"** |

**So the first action is not a code change — it is a deploy and a re-review.** Task 1 handles that. Roughly a quarter of feedback #2 evaporates once the client sees the current build.

**But item 1 is not fully a false alarm.** The client saw the numbers 5–9. There is a real structural bug behind that, found in the DOM: the `<ol class="cycle">` has **nine `<li>` children** — four steps, four arrow connectors, one hub. The connectors and hub are decorative but they are list items, so any stylesheet that restores `list-style` (the `accessibility` widget injects its own CSS; so does a print stylesheet, a reader mode, or forced-colors) renders markers 5–9 and the words "מחזור מתמשך" as a fifth through ninth step. Task 2 fixes the structure so that cannot happen in any rendering mode.

**Genuinely open, confirmed by measurement:**

| # | Finding | Evidence |
|---|---|---|
| A | Nine `<li>` in the four-step `<ol>` | DOM: `ol.cycle.children.length === 9` |
| B | Form's only action is WhatsApp | `LeadForm.astro:131` — `<Button type="submit" variant="primary" size="lg" full>שליחה בוואטסאפ</Button>`; no phone, no "תיאום בדיקה" |
| C | Mobile hero is 1672px with no CTA button in it | measured at 375×812; the only CTAs are in the fixed bottom bar |
| D | Section rhythm is asymmetric | measured `padding-block-start: 44px` / `padding-block-end: 80px` on four light sections at 1440px |
| E | Mobile page is 14,028px — 17 screens | measured at 375×812 (desktop 1440px: 8,414px) |
| F | Header lists 11 equipment pages flat; footer lists 5 | `src/content/settings/navigation.json`; cranes are siblings, not children of עגורנים |
| G | "מאשר" used of a תסקיר in three files | `what-is-certified-inspector.md:67`, `forklift-inspection-guide.md:37`, `lifting-inspection-center.md:56` |
| H | One article is a 183-word stub | `lifting-equipment-inspection-frequency.md` |
| I | Hub/service pages are half the depth of the equipment pages | `services.md` 278w, `equipment.md` 342w, `lifeline-inspection.md` 442w vs `forklift-inspection.md` 1428w |
| J | Launch placeholders still in | GA4 `G-XXXXXXXXXX`, `coordinatorName: REPLACE-ME`, `public/admin/config.yml` REPLACE-ME, domain unverified (`ardi-engineers.co.il` does not resolve) |
| K | Eleven `<section>` on the homepage | client's round-1 §30 asked for ten; `EquipmentPicker` is the extra one |

---

## File structure

Who owns what. Two agents must never hold the same row.

| Stream | Files owned | Phase |
|---|---|---|
| **S1 — motion & structure** | `src/components/home/HomeProcess.astro` | 1 |
| **S2 — conversion** | `src/components/form/LeadForm.astro`, `src/components/home/Hero.astro`, `src/scripts/form.ts` | 1 |
| **S3 — rhythm** | `src/styles/tokens.css`, `src/components/ui/Section.astro`, `src/pages/index.astro`, `src/components/home/EquipmentPicker.astro`, `src/components/home/HomeEquipment.astro` | 1 |
| **S4 — navigation** | `src/content/settings/navigation.json`, `src/lib/nav.ts` | 2 |
| **S5 — regulatory copy** | every `src/content/pages/*.md`, every `src/content/faq/*.json` | 2 |
| **S6 — articles** | every `src/content/articles/*.md` | 2 |
| **S7 — SEO** | `src/lib/seo.ts`, `src/lib/schema.ts`, frontmatter of `src/content/**` | 3 |
| **S8 — media** | `public/uploads/*`, `src/lib/image-manifest.json`, `docs/image-brief.md` | 3 |

S3 touches `tokens.css`, which moves the whole site. Run S3 **alone** or first; never in parallel with S1 or S2.

---

## Verification matrix — run for every visual task

The client's single loudest complaint across both rounds is that the site behaves differently on different screens. So this is not a per-task afterthought; it is the definition of done.

**Widths to check (the browser pane reserves ~15px for a scrollbar — request 15px more than the width you mean to test):**

| Target | Request | Why this one |
|---|---|---|
| 1440 | 1455 | wide desktop |
| 1280 | 1295 | the common laptop |
| 1080 | 1095 | footer's `@media (width >= 1080px)` boundary |
| 916 | 931 | just **above** the ring breakpoint (`>= 901`) |
| 900 | 915 | just **below** it — the fallback column must look deliberate |
| 768 | 783 | tablet portrait |
| 600 | 615 | large phone landscape |
| 430 | 445 | iPhone Pro Max |
| 375 | 390 | the mobile baseline |
| 320 | 335 | the narrowest supported |

**At each width, this snippet must return an empty `over` array:**

```js
(() => {
  const de = document.documentElement, vw = de.clientWidth, over = [];
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    if (getComputedStyle(el).position === 'fixed') return;
    if (r.right > vw + 1 || r.left < -1)
      over.push(`${el.tagName.toLowerCase()}.${(el.className||'').toString().split(' ')[0]} L=${Math.round(r.left)} R=${Math.round(r.right)}`);
  });
  return JSON.stringify({ vw, scrollW: de.scrollWidth, docH: de.scrollHeight, over: [...new Set(over)] }, null, 1);
})()
```

`scrollW` must equal `vw`. Any entry in `over` is a failure.

**Two traps, both already hit during the audit:**
1. After `resize_window`, **reload the page** — media queries re-evaluate but JS-measured layout and lazy media do not.
2. The browser pane must be **fronted** or rendering is throttled and screenshots come back blank. Wait ~600ms after navigating. This is already written down in `CONVENTIONS.md`; it is repeated here because it silently wasted time in the audit.

**Also run for every task, no exceptions:**

```bash
npm run verify:all
```

All three scripts (`check-rtl`, `check-html`, `check-links`) are green today and must stay green.

---

# PHASE 1 — the fixes the client is waiting on

## Task 1: Deploy the current build and re-review

**Files:** none — this is a deploy and a message.

- [ ] **Step 1: Confirm the working tree is clean and pushed**

```bash
cd "/Users/almog_pumba/Desktop/claude code workspace/ardi-site"
git status --short && git log --oneline -1 && git rev-parse HEAD origin/main
```

Expected: no output from `status`, and the two hashes identical.

- [ ] **Step 2: Build and verify locally**

```bash
npm run verify:all
```

Expected: build succeeds, then three lines of green from check-rtl / check-html / check-links.

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --prod
```

Expected: a production URL printed. Record it — the audit could not find it, `ardi-engineers.co.il` does not currently resolve, and `ardi-site.vercel.app` belongs to an unrelated React project.

- [ ] **Step 4: Confirm the deploy carries round one**

```bash
curl -s "<PRODUCTION_URL>" | grep -c 'cycle--ring'
curl -s "<PRODUCTION_URL>" | grep -o 'ציוד שאנחנו בודקים\|השירותים שלנו\|30 שניות' | sort | uniq -c
```

Expected: `1` for the ring; one match each for the two headings; zero for "30 שניות".

- [ ] **Step 5: Send the client the table from §0 with the new URL**

Point at items 1, 6, 7 and 8 specifically, and ask them to re-check on the new URL before any further work is scoped. This is the cheapest task in the plan and it retires four of sixteen items.

- [ ] **Step 6: Commit nothing** — no code changed.

---

## Task 2: The four-step cycle must be four list items in every rendering mode

**Files:**
- Modify: `src/components/home/HomeProcess.astro` (lines 50–92 markup, 98–105 and 155–194 and 204–294 CSS)

The ring geometry is correct and stays. What changes is that the decorative arrows and the hub stop being `<li>`. Today the `<ol>` holds nine children; a stylesheet that restores `list-style` — the `accessibility` widget's injected CSS, print, reader mode, forced-colors — numbers all nine, which is exactly what the client saw.

- [ ] **Step 1: Write the failing check**

Create `scripts/check-cycle.mjs`:

```js
// The four-step cycle must contain exactly four list items. The arrows and
// the hub are decoration; if they live inside the <ol> then any stylesheet
// that restores list markers numbers them 5-9, which is what the client
// reported seeing.
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const ol = html.match(/<ol[^>]*class="[^"]*\bcycle\b[^"]*"[\s\S]*?<\/ol>/);

if (!ol) {
  console.error('check-cycle: no <ol class="cycle"> found in dist/index.html');
  process.exit(1);
}

const items = ol[0].match(/<li\b/g) ?? [];
if (items.length !== 4) {
  console.error(`check-cycle: the cycle <ol> holds ${items.length} <li>, expected exactly 4`);
  process.exit(1);
}

console.log('check-cycle: ok — 4 list items');
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm run build && node scripts/check-cycle.mjs
```

Expected: `check-cycle: the cycle <ol> holds 9 <li>, expected exactly 4`, exit 1.

- [ ] **Step 3: Move the decoration out of the list**

The grid moves from the `<ol>` to a wrapping `<div>`; the `<ol>` becomes `display: contents` on wide screens so its four `<li>` still land in their own grid cells. Replace lines 50–92 of `HomeProcess.astro` with:

```astro
  <div class:list={['cycle', isRing && 'cycle--ring']}>
    <ol role="list" class="cycle__list">
      {
        steps.map((step, i) => (
          <li
            class:list={[
              'cycle__step',
              isRing && `cycle__step--${QUADRANT[i]}`,
              i === steps.length - 1 && 'cycle__step--loop',
            ]}
          >
            <span class="cycle__mark" aria-hidden="true">
              <span class="cycle__num">{i + 1}</span>
              <Icon name={STEP_ICON[step.data.id] ?? 'check'} size={20} class="cycle__glyph" />
            </span>
            <h3 class="cycle__title">{step.data.title}</h3>
            <p class="t-body cycle__text">{step.data.text}</p>
          </li>
        ))
      }
    </ol>

    {/* Decoration, and now genuinely outside the list. The recurrence these
        arrows draw is stated in words in the section intro above, which is
        where a screen-reader user actually gets it. */}
    {
      isRing &&
        LINKS.map((link) => (
          <div class:list={['cycle__link', `cycle__link--${link}`]} aria-hidden="true">
            <Icon name="arrow" size={22} />
          </div>
        ))
    }

    {
      isRing && (
        <div class="cycle__hub" aria-hidden="true">
          <Icon name="refresh" size={26} />
          <span>מחזור מתמשך</span>
        </div>
      )
    }
  </div>
```

- [ ] **Step 4: Make the CSS match the new box**

Replace the `.cycle` rule (lines 98–105) with these two:

```css
  .cycle {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-5);
  }

  .cycle__list {
    display: contents;
  }
```

`display: contents` on the `<ol>` lets the four `<li>` participate in `.cycle`'s grid directly, in both the column and the ring layout, so no placement rule below needs to change.

Change the `.cycle__link` default (line 158) from `display: none` — a `<div>` is `display: block`, so the column layout would show four stray arrows:

```css
  /* Connectors are the ring's own vocabulary — in the column they would be
     four arrows stranded at the bottom, since they follow all four steps in
     source order. */
  .cycle__link {
    display: none;
  }
```

(unchanged in text; confirm it still applies to the `<div>` — it does, and it is listed here so the agent does not delete it while editing around it.)

Inside `@media (width >= 901px)`, change the ring rule (line 205) to target the wrapper, and keep every `grid-area` assignment exactly as it is:

```css
    .cycle--ring {
      grid-template-columns: 1fr var(--cycle-hub) 1fr;
      grid-template-rows: auto var(--cycle-hub) auto;
      grid-template-areas:
        'q1  l12 q2'
        'l41 hub l23'
        'q4  l34 q3';
      gap: var(--grid-gap);
    }

    /* `display: contents` means the <ol> is not itself a grid item, so the
       min-inline-size reset has to reach the four <li> and the decoration. */
    .cycle--ring > *,
    .cycle--ring > .cycle__list > * {
      min-inline-size: 0;
    }
```

- [ ] **Step 5: Confirm the check passes**

```bash
npm run build && node scripts/check-cycle.mjs
```

Expected: `check-cycle: ok — 4 list items`.

- [ ] **Step 6: Confirm the ring still draws**

Reload at 1455px and run:

```js
(() => {
  const w = document.querySelector('.cycle');
  const steps = [...w.querySelectorAll('.cycle__step')].map(s => {
    const r = s.getBoundingClientRect();
    return `${s.querySelector('.cycle__num').textContent} x=${Math.round(r.left)} y=${Math.round(r.top)}`;
  });
  return JSON.stringify({ listItems: w.querySelectorAll('li').length, steps }, null, 1);
})()
```

Expected: `listItems: 4`, and four steps at four distinct corners (two share a `y`, two share an `x`, mirrored under RTL so step 1 is top-right).

- [ ] **Step 7: Confirm markers never appear even when list-style comes back**

```js
(() => {
  const s = document.createElement('style');
  s.textContent = 'ol, ul, li { list-style: decimal outside !important; }';
  document.head.appendChild(s);
  const n = document.querySelectorAll('.cycle li').length;
  s.remove();
  return 'numbered items under forced list-style: ' + n;
})()
```

Expected: `4`. Before the fix this returns `9` — that is the client's bug, reproduced and then closed.

- [ ] **Step 8: Wire the check into verify**

In `package.json`, extend the `verify` script:

```json
    "verify": "node scripts/check-rtl.mjs src && node scripts/check-html.mjs dist && node scripts/check-links.mjs dist && node scripts/check-cycle.mjs",
```

Then add `scripts/check-cycle.mjs` to `.vercelignore` beside the other verify scripts, matching the pattern established in `9765d3c`.

- [ ] **Step 9: Run the full verification and the width matrix**

```bash
npm run verify:all
```

Then the matrix at 931 and 915 specifically — the ring's two boundary widths.

- [ ] **Step 10: Commit**

```bash
git add src/components/home/HomeProcess.astro scripts/check-cycle.mjs package.json .vercelignore
git commit -m "fix(process): the cycle is four list items, not nine

The arrows and the hub were <li> inside the <ol>, so any stylesheet that
restores list markers - the accessibility widget's injected CSS, print,
reader mode - numbered them 5 through 9. The client saw exactly that.
They are <div> now, outside the list; the <ol> is display:contents so the
ring geometry is untouched. check-cycle.mjs holds the line."
```

---

## Task 3: CTA hierarchy — phone first, booking second, WhatsApp third

**Files:**
- Modify: `src/components/form/LeadForm.astro` (line 131 and the styles below it)
- Modify: `src/scripts/form.ts`

Both review rounds asked for this and it is untouched. Today the form's only action is a full-width orange **"שליחה בוואטסאפ"**. For maintenance managers, safety officers and procurement, the phone is the primary channel.

The order the client specified: **1. תיאום בדיקה · 2. התקשרו עכשיו · 3. WhatsApp** (round 1 §6), sharpened in round 2 §2 to phone and booking both primary, WhatsApp secondary.

- [ ] **Step 1: Replace the single submit button with a three-action group**

In `LeadForm.astro`, replace line 131:

```astro
    <Button type="submit" variant="primary" size="lg" full>שליחה בוואטסאפ</Button>
```

with:

```astro
    <div class="lead-form__actions">
      <Button type="submit" variant="primary" size="lg" class="lead-form__go">
        שליחת הפרטים
      </Button>

      <Button
        href={tel}
        variant="on-dark"
        size="lg"
        track="phone_click"
        class="lead-form__call"
      >
        <Icon name="phone" size={20} />
        <span>התקשרו עכשיו</span>
        <bdi class="ltr num">{phone}</bdi>
      </Button>
    </div>

    <p class="lead-form__alt">
      <a href={waHref} data-track="whatsapp_click" target="_blank" rel="noopener">
        <Icon name="whatsapp" size={18} />
        <span>או שלחו הודעה בוואטסאפ</span>
      </a>
    </p>
```

Add the icon import to the frontmatter, beside the existing `Button` import:

```astro
import Icon from '../ui/Icon.astro';
```

- [ ] **Step 2: Style the group**

Append to the `<style>` block:

```css
  /* Two equal primaries side by side on wide screens, stacked on narrow.
     The phone sits first in the visual order under RTL because it is the
     channel this audience actually uses. */
  .lead-form__actions {
    display: grid;
    gap: var(--s-3);
  }

  @media (width >= 560px) {
    .lead-form__actions {
      grid-template-columns: 1fr 1fr;
    }
  }

  .lead-form__actions :global(.lead-form__call) {
    order: -1;
  }

  .lead-form__actions :global(.lead-form__call bdi) {
    font-size: var(--fs-sm);
    opacity: 0.85;
  }

  /* WhatsApp demoted to a text link. Still one tap, no longer the default. */
  .lead-form__alt {
    display: flex;
    justify-content: center;
    font-size: var(--fs-sm);
  }

  .lead-form__alt a {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    min-block-size: var(--tap);
    color: var(--c-on-dark);
    text-decoration: underline;
    text-underline-offset: 0.22em;
  }

  .lead-form__alt a:hover {
    color: var(--c-accent-dark);
  }
```

- [ ] **Step 3: Reword the consent line**

The form still composes a WhatsApp message on submit — that is the whole transport, per `CONVENTIONS.md`. The button now says "שליחת הפרטים", so line 133–136 must stop promising WhatsApp is the only route while still being honest about what happens:

```astro
    <p class="lead-form__consent">
      הפרטים ייפתחו כהודעה מוכנה לשליחה. אפשר גם פשוט להתקשר ·
      <a href="/privacy">מדיניות פרטיות</a>
    </p>
```

- [ ] **Step 4: Check the script still binds**

`src/scripts/form.ts` listens on the form's submit event, not on the button — confirm that by reading it, and only change it if it queries the button by its text or by a selector that just moved. Run:

```bash
grep -n "querySelector\|addEventListener\|submit" src/scripts/form.ts
```

If it binds to `form[data-lead-form]` on `'submit'`, nothing changes. If it binds to a button selector, retarget it at `.lead-form__go`.

- [ ] **Step 5: Verify all three actions**

At 390px and at 1455px, reload, then:

```js
(() => {
  const f = document.querySelector('.lead-form');
  const call = f.querySelector('.lead-form__call');
  const go = f.querySelector('.lead-form__go');
  const wa = f.querySelector('.lead-form__alt a');
  const box = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.left)},${Math.round(r.top)}`; };
  return JSON.stringify({
    call: call.getAttribute('href') + ' ' + box(call),
    submit: go.textContent.trim() + ' ' + box(go),
    whatsapp: wa.getAttribute('href').slice(0, 40) + ' ' + box(wa),
    callHeight: Math.round(call.getBoundingClientRect().height),
    goHeight: Math.round(go.getBoundingClientRect().height),
  }, null, 1);
})()
```

Expected: `call` href starts `tel:+972`; both button heights ≥ 52 (`--tap-lg`); at 1455px the two buttons share a row with the phone on the right (RTL start); at 390px they stack with the phone on top.

- [ ] **Step 6: Full verification**

```bash
npm run verify:all
```

- [ ] **Step 7: Commit**

```bash
git add src/components/form/LeadForm.astro src/scripts/form.ts
git commit -m "feat(form): phone and booking are both primary, WhatsApp is not

Both review rounds asked for this. The form's only action was a full-width
orange 'send on WhatsApp', which is the wrong default for maintenance
managers and safety officers. Phone is now a peer of submit, and WhatsApp
is a text link under them."
```

---

## Task 4: Give the mobile hero its own call to action

**Files:**
- Modify: `src/components/home/Hero.astro`

Measured at 375×812 the hero is **1672px** — two full screens before the visitor reaches anything but the form panel, and the only CTAs are in the fixed bottom bar, which reads as chrome rather than as the page's offer. Round 1 §3 asked for **תיאום בדיקה | דברו איתנו עכשיו** in the hero itself.

- [ ] **Step 1: Add a button pair to the hero's main column**

In `Hero.astro`, after the `</ul>` that closes `.hero__trust` (line 82), insert:

```astro
    <div class="hero__cta">
      <Button href="#lead" variant="primary" size="lg" track="form_start">
        תיאום בדיקה
      </Button>
      <Button href={tel} variant="on-dark" size="lg" track="phone_click">
        דברו איתנו עכשיו
      </Button>
    </div>
```

Add to the frontmatter imports:

```astro
import Button from '../ui/Button.astro';
import site from '../../site.config';
import { telHrefFor } from '../../lib/format';
```

and below the destructured props:

```astro
const tel = telHrefFor(site.phoneE164);
```

- [ ] **Step 2: Style it, and hide it where it would duplicate**

```css
  .hero__cta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    margin-block-start: var(--s-5);
  }

  /* On wide screens the form panel is already beside the headline and the
     desktop CTA rail is on screen, so a third pair of buttons is noise. */
  @media (width >= 900px) {
    .hero__cta {
      display: none;
    }
  }
```

- [ ] **Step 3: Shorten the narrow hero**

The lead paragraph is the tallest single block on mobile. Cap it and tighten the stack:

```css
  @media (width <= 560px) {
    .hero__lead {
      font-size: var(--fs-body);
    }

    .hero__trust {
      gap: var(--s-3);
    }
  }
```

- [ ] **Step 4: Measure the result**

At 390px, reload, then:

```js
(() => {
  const h = document.querySelector('.hero');
  const cta = h.querySelector('.hero__cta');
  return JSON.stringify({
    heroHeight: Math.round(h.getBoundingClientRect().height),
    ctaVisible: !!cta && getComputedStyle(cta).display !== 'none',
    ctaTop: cta ? Math.round(cta.getBoundingClientRect().top + window.scrollY) : null,
    viewport: window.innerHeight,
  }, null, 1);
})()
```

Expected: `ctaVisible: true`; `ctaTop` under 1000 so the first action is reachable within roughly one and a half screens; `heroHeight` measurably below the 1672 baseline.

At 1455px the same snippet must report `ctaVisible: false`.

- [ ] **Step 5: Full width matrix + verification**

Run the matrix at every width in the table. Then:

```bash
npm run verify:all
```

- [ ] **Step 6: Commit**

```bash
git add src/components/home/Hero.astro
git commit -m "feat(hero): a call to action inside the narrow hero

At 375px the hero ran 1672px with no button in it - the only CTAs were in
the fixed bottom bar, which reads as chrome, not as the offer. Booking and
phone now sit under the trust ticks on narrow screens and stay hidden on
wide ones, where the form panel and the desktop rail already cover it."
```

---

## Task 5: One vertical rhythm, and one section fewer

**Files:**
- Modify: `src/styles/tokens.css` (lines 145–149)
- Modify: `src/components/ui/Section.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/home/HomeEquipment.astro`
- Delete: `src/components/home/EquipmentPicker.astro` (after folding it in)

**Run this task alone.** `tokens.css` moves every page.

Measured at 1440px, four light sections carry `padding-block-start: 44px` with `padding-block-end: 80px` — the `clamp()` resolves differently at the two ends because `--section-y-adjacent` is applied on one side only. That asymmetry is the "each area got its own design" feeling the client described in round 1 §2 and repeated in round 2 §4. And the homepage renders **eleven** `<section>` where round 1 §30 asked for ten.

- [ ] **Step 1: Record the baseline**

At 1455px:

```js
JSON.stringify([...document.querySelectorAll('main > section')].map((s,i) => {
  const cs = getComputedStyle(s);
  const h = s.querySelector('h1,h2');
  return `${i+1}. pt=${cs.paddingBlockStart} pb=${cs.paddingBlockEnd} h=${Math.round(s.getBoundingClientRect().height)} :: ${h ? h.textContent.trim().slice(0,30) : '?'}`;
}), null, 1)
```

Save the output. Today it shows `pt=44px pb=80px` on sections 5, 8, 10 and 12, and eleven sections in total.

- [ ] **Step 2: Make the adjacent-section collapse symmetric**

In `src/styles/tokens.css`, replace lines 145–149 with:

```css
  --section-y: clamp(44px, 6.2vw, 80px);
  --section-y-lg: clamp(56px, 8.4vw, 112px);

  /* When two sections of the same tone meet, the seam between them gets one
     collapsed gap rather than two full ones. Applied to BOTH sides of the
     seam, or the section ends up with 44px above and 80px below and the page
     reads as a stack of unrelated slabs — which is exactly the note the
     client gave twice. */
  --section-y-adjacent: calc(var(--section-y) * 0.55);
```

In `src/components/ui/Section.astro`, find every rule that applies `--section-y-adjacent` and make sure each one sets `padding-block` (both sides), never `padding-block-start` alone. Read the file first, then correct in place. If a rule needs to collapse only the seam side, it must have a matching sibling rule for the other side, e.g.:

```css
  .section + .section {
    padding-block-start: var(--section-y-adjacent);
  }

  .section:has(+ .section) {
    padding-block-end: var(--section-y-adjacent);
  }
```

- [ ] **Step 3: Fold the equipment picker into the equipment section**

`EquipmentPicker` ("איזה ציוד צריך בדיקה?") is its own `<section>` immediately after `HomeEquipment` ("ציוד שאנחנו בודקים"). Two headings, two slabs, one subject. Move the picker's chip row inside `HomeEquipment` under its card grid.

In `HomeEquipment.astro`, import the picker's markup as a sub-block rather than a `Section`: copy the chip list and its styles across, drop the `<Section>` and `<SectionHeader>` wrappers, and introduce it with a plain `<h3>` — for example `בחרו את הציוד שלכם ונחזור אליכם`. The `equipment:change` CustomEvent contract in `CONVENTIONS.md` §"Cross-stream contracts" is frozen: the chips must still dispatch it and the form must still listen.

Then in `src/pages/index.astro` remove both the import and the `<EquipmentPicker />` element, and delete `src/components/home/EquipmentPicker.astro`.

- [ ] **Step 4: Confirm the chip → form contract survived**

At 1455px, reload, then:

```js
(() => {
  let got = null;
  document.addEventListener('equipment:change', e => { got = e.detail; }, { once: true });
  const chip = document.querySelector('[data-equipment-chip], .chip');
  if (!chip) return 'no chip found';
  chip.click();
  return JSON.stringify({ fired: got, selectValue: document.querySelector('#lead-equipment')?.value });
})()
```

Expected: `fired` carries an `ids` array, and the form's `<select>` reflects it.

- [ ] **Step 5: Re-measure the rhythm**

Re-run the Step 1 snippet. Expected: **ten** sections, and every `pt` equal to its own `pb`.

- [ ] **Step 6: Confirm the page got shorter, on both ends**

At 1455px and at 390px:

```js
document.documentElement.scrollHeight
```

Baselines to beat: **8414** at 1440px and **14028** at 375px. Both must drop. The goal is not "shorter at any cost" — round 1 §29 is explicit that every scroll should deliver new information — so check the screenshots too: nothing should look cramped.

- [ ] **Step 7: Full width matrix + verification**

```bash
npm run verify:all
```

- [ ] **Step 8: Commit**

```bash
git add src/styles/tokens.css src/components/ui/Section.astro src/pages/index.astro src/components/home/HomeEquipment.astro
git rm src/components/home/EquipmentPicker.astro
git commit -m "style(rhythm): one vertical gap, and ten sections instead of eleven

The adjacent-section collapse was applied to one side of the seam only, so
four sections carried 44px above and 80px below at 1440px - the 'every area
has its own design' note, twice given. The equipment picker was its own slab
directly under the equipment grid; it is now a row inside it."
```

---

## Task 6: Sweep the whole site at every width

**Files:** none unless a failure turns up — then the owning component.

Tasks 2–5 each verified their own area. This task verifies the pages nobody edited, which is where round 1 §1 and round 2 §3 actually live: *"not enough that the site looks good on one computer."*

- [ ] **Step 1: Enumerate the routes**

```bash
npm run build && find dist -name '*.html' | sed 's|^dist||; s|/index.html$|/|' | sort
```

- [ ] **Step 2: Run the overflow snippet on every route at 1455, 1295, 1095, 931, 915, 783, 615, 445, 390 and 335**

For each: navigate, **reload**, wait ~600ms with the pane fronted, run the snippet from the verification matrix. Record every failure as `route | width | selector | left | right`.

Highest-suspicion routes, from round 1 §14 and the structure of the templates:
- `/` — "פתרון מקצועי למפעלים וחברות", the section where the client saw an image ride over the text. Commit `933bc8d` claims a fix; confirm it at 915 and 783, which is where a two-column grid usually gives out.
- every `PhotoBand` and `PhotoFrame` on the equipment pages — same failure mode, same component.
- `/faq` — the accordion.
- `/blog` and each article — long prose plus a sidebar.

- [ ] **Step 3: Check text never lands on an image**

On each route carrying a `PhotoFrame`, at 915 and 783:

```js
(() => {
  const hits = [];
  document.querySelectorAll('.frame, [class*="photo"]').forEach(img => {
    const a = img.getBoundingClientRect();
    document.querySelectorAll('p, h2, h3, li').forEach(t => {
      const b = t.getBoundingClientRect();
      if (!b.width || !a.width) return;
      const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      if (overlap) hits.push(`${(img.className||'').toString().split(' ')[0]} over "${t.textContent.trim().slice(0,30)}"`);
    });
  });
  return JSON.stringify([...new Set(hits)], null, 1);
})()
```

Expected: `[]`.

- [ ] **Step 4: Fix what turns up, one commit per component**

Each fix re-runs Steps 2 and 3 for its route before committing.

- [ ] **Step 5: Write the sweep down**

Create `docs/responsive-sweep.md`: the route list, the ten widths, pass/fail per cell, and the date. This is the artefact to send the client — round 2 §3 asks for a system, and a filled grid is the evidence that one exists.

- [ ] **Step 6: Commit**

```bash
git add docs/responsive-sweep.md
git commit -m "docs: the responsive sweep grid - 10 widths across every route"
```

---

# PHASE 2 — content

Phase 2 tasks may run in parallel with each other (S4, S5, S6 own disjoint files). None may start before Phase 1 is committed.

## Task 7: One hierarchy for cranes, in the menu and in the footer

**Files:**
- Modify: `src/content/settings/navigation.json`
- Modify: `src/lib/nav.ts` (only if it cannot render a third level)

Round 1 §12 and round 2 §16, both open. The header lists eleven equipment pages as flat siblings — עגורנים sits beside עגורני גשר, עגורני שער and עגורני זרוע as though they were peers. The footer lists five of the eleven. The homepage groups them under one עגורנים card. Three different hierarchies for one set of pages.

- [ ] **Step 1: Restructure the header's equipment group**

In `navigation.json`, replace the eleven flat children of `"ציוד שאנו בודקים"` with a two-level shape. The crane pages become children of the crane hub:

```json
    {
      "label": "ציוד שאנו בודקים",
      "href": "/equipment",
      "children": [
        { "label": "בדיקות מלגזות", "href": "/forklift-inspection" },
        {
          "label": "בדיקות עגורנים",
          "href": "/crane-inspection",
          "children": [
            { "label": "עגורני גשר", "href": "/bridge-crane-inspection" },
            { "label": "עגורני שער", "href": "/gantry-crane-inspection" },
            { "label": "עגורני זרוע", "href": "/jib-crane-inspection" }
          ]
        },
        { "label": "בדיקות במות הרמה", "href": "/lift-platform-inspection" },
        { "label": "בדיקות שולחנות הרמה", "href": "/lift-table-inspection" },
        { "label": "מגבהים וליפטים לרכב", "href": "/vehicle-lift-inspection" },
        { "label": "בדיקת ג'ק לרכב", "href": "/vehicle-jack-inspection" },
        { "label": "דפנות הרמה למשאיות", "href": "/tail-lift-inspection" },
        { "label": "ליפטים ומתקנים נוספים", "href": "/additional-lifting-equipment" }
      ]
    }
```

- [ ] **Step 2: Make the footer mirror it**

Replace the footer's `"ציוד שאנו בודקים"` group with the same eight top-level entries, flattened one level (the three crane sub-pages listed under the crane link, indented by label or shown as a nested `<ul>` — pick one and apply it to every column). No page in the header may be missing from the footer.

- [ ] **Step 3: Teach `nav.ts` the third level if it does not know it**

```bash
grep -n "children" src/lib/nav.ts src/components/chrome/Nav.astro src/components/chrome/MobileNav.astro
```

If the type or the template only handles two levels, extend both. The mobile menu must stay operable with the keyboard and every target must stay ≥ `var(--tap)`.

- [ ] **Step 4: Verify no link is orphaned**

```bash
npm run build && node scripts/check-links.mjs dist
```

Then confirm parity:

```js
(() => {
  const head = new Set([...document.querySelectorAll('header a[href^="/"]')].map(a => a.getAttribute('href')));
  const foot = new Set([...document.querySelectorAll('footer a[href^="/"]')].map(a => a.getAttribute('href')));
  return JSON.stringify({
    inHeaderNotFooter: [...head].filter(h => !foot.has(h)),
    inFooterNotHeader: [...foot].filter(f => !head.has(f)),
  }, null, 1);
})()
```

Expected: `inHeaderNotFooter` empty. `inFooterNotHeader` may legitimately hold `/privacy` and `/accessibility`.

- [ ] **Step 5: Check the menu at every width**

Run the width matrix on `/`, opening the menu at each. At 390px the equipment group with its nested crane list must scroll inside the menu, not push the page.

- [ ] **Step 6: Commit**

```bash
git add src/content/settings/navigation.json src/lib/nav.ts src/components/chrome/
git commit -m "fix(nav): cranes nest under cranes, and the footer mirrors the menu

The header listed eleven equipment pages as flat siblings - the crane hub
beside its own three sub-pages - and the footer listed five of them. Three
hierarchies for one set of pages, in the menu, the footer and the homepage."
```

---

## Task 8: A תסקיר documents; it does not approve

**Files:**
- Modify: `src/content/articles/what-is-certified-inspector.md:67`
- Modify: `src/content/articles/forklift-inspection-guide.md:37`
- Modify: `src/content/pages/lifting-inspection-center.md:56`
- Modify: any `src/content/faq/*.json` entry that repeats the claim

Round 1 §21 and round 2 §12. **This is a regulatory-accuracy item, not a copy preference.** A report that "approves" equipment states a legal conclusion the document does not carry.

- [ ] **Step 1: Find every occurrence**

```bash
grep -rn "מאשר\|מאשרת\|אישור הציוד\|תקין לשימוש" src/content/
```

Three known hits. Treat anything else the grep returns as in scope.

- [ ] **Step 2: Replace with the documenting formulation**

The agreed wording, from round 1 §21 — the report records: the inspection performed, its findings, any defects, the results, and the conclusions per the relevant requirements.

At `what-is-certified-inspector.md:67`, replace:

> תסקיר הבדיקה הוא מסמך מקצועי המאשר את תוצאות הבדיקה בהתאם לדרישות החוק, ויש

with:

> תסקיר הבדיקה הוא מסמך מקצועי המתעד את הבדיקה שבוצעה, את פרטי הציוד, את הממצאים, ליקויים ככל שנמצאו, ואת המסקנות בהתאם לדרישות הרלוונטיות. יש

Apply the same substitution at the other two locations, adapted to their sentences. Do not merely swap the verb — the point is that the sentence lists what the document contains.

- [ ] **Step 3: Confirm no occurrence survives**

```bash
grep -rn "מאשר את\|מאשרת את" src/content/ && echo "STILL PRESENT" || echo "clean"
```

Expected: `clean`. (`forklift-inspection-guide.md:37` uses "מאשר" in an unrelated sense — read the sentence before editing it; if it does not concern the report, leave it and note that in the commit.)

- [ ] **Step 4: Flag every page for the client's sign-off**

Create `docs/regulatory-review.md` listing each claim the site makes about: inspection frequency, who may inspect, what triggers an inspection, first-use inspection of new equipment, inspection after repair or modification, what the report means, and when equipment may not stay in service. One row per claim: page, line, exact sentence, and a **status column that starts at `ממתין לאישור`**.

Round 1 §20 and round 2 §13 are both unambiguous: **nothing professional or legal goes live without the client's approval.** This file is how that approval gets tracked.

- [ ] **Step 5: Verify and commit**

```bash
npm run verify:all
git add src/content/ docs/regulatory-review.md
git commit -m "content: a report documents an inspection, it does not approve equipment

'מאשר' states a legal conclusion the document does not carry. Every
occurrence now lists what the report actually contains. regulatory-review.md
tracks every remaining professional claim awaiting the client's sign-off."
```

---

## Task 9: Rewrite the three homepage articles, and fill the stub

**Files:**
- Modify: `src/content/articles/*.md` (all seven)

Round 1 §17 and round 2 §9. `HomeArticles.astro` shows the three most recent by `publishDate`, so which three appear on the homepage is a consequence of the dates, not a separate list.

Measured lengths: `lifting-equipment-inspection-frequency.md` **183 words** — a stub. The rest run 455–747.

- [ ] **Step 1: Confirm which three the homepage shows**

```bash
grep -H "publishDate" src/content/articles/*.md | sort -t: -k3 -r | head -3
```

- [ ] **Step 2: Set the bar**

Every article must carry: a direct answer in its first paragraph (40–60 words — this is what AI search extracts and what a skimming maintenance manager reads); H2s phrased the way people actually search; a source for every regulatory claim; internal links to the matching service page, the matching equipment page and the FAQ; and one CTA.

Target 900–1400 words, matching the depth already achieved on `forklift-inspection.md` (1428w) and `tail-lift-inspection.md` (1404w).

- [ ] **Step 3: Rewrite the 183-word stub first**

`lifting-equipment-inspection-frequency.md` is the worst offender and its subject — inspection frequency — is the single most-searched question in this category and the most legally sensitive. It must not ship at 183 words and it must not ship without sign-off.

- [ ] **Step 4: Rewrite the other two homepage articles, then the remaining four**

One commit per article, so any single one can be reverted after the client reads it.

- [ ] **Step 5: Route every regulatory claim through Task 8's file**

Each new claim about frequency, authority, or what a report means gets a row in `docs/regulatory-review.md` at `ממתין לאישור`. **Do not publish an article whose claims are unapproved** — set `draft: true` in its frontmatter until the row flips.

- [ ] **Step 6: Verify links resolve**

```bash
npm run verify:all
```

`check-links` catches internal links to pages that do not exist.

- [ ] **Step 7: Commit per article**

```bash
git add src/content/articles/<name>.md docs/regulatory-review.md
git commit -m "content: rewrite <name> - sourced, linked, and at depth"
```

---

## Task 10: Bring the hub pages up to the equipment pages' depth

**Files:**
- Modify: `src/content/pages/services.md` (278w), `equipment.md` (342w), `lifeline-inspection.md` (442w), `lifting-accessories.md` (494w), `crane-inspection.md` (543w), `lifting-equipment-inspection.md` (567w), `additional-lifting-equipment.md` (574w), `vehicle-jack-inspection.md` (607w)

Round 2 §11. The five newest equipment pages run 966–1428 words on the agreed structure. The hubs and the three older service pages did not get that treatment, so the site's depth depends on which page you land on.

The structure, from round 2 §11: הסבר → מתי נדרשת בדיקה → סוגי ציוד → מה בודקים → איך מתבצעת הבדיקה → ליקויים → תסקיר → הכנה לבדיקה → חברות/מפעלים → למה אנחנו → FAQ → CTA.

- [ ] **Step 1: Take `forklift-inspection.md` as the reference**

Read it. It is the fullest expression of the agreed structure; the others are being brought level with it, not rewritten to a new pattern.

- [ ] **Step 2: `crane-inspection.md` first — it is now a parent**

After Task 7 it is the parent of three crane sub-pages, so it needs a section that introduces each and links to it, and each sub-page needs a link back. Without that the new menu hierarchy exists only in the menu.

- [ ] **Step 3: Then the two remaining service pages, then the hubs**

`lifting-accessories.md` and `lifeline-inspection.md` are service pages carrying only ~450–500 words. `services.md` and `equipment.md` are hubs — they need less prose but must link to every child.

- [ ] **Step 4: Confirm the depth gap closed**

```bash
for f in src/content/pages/*.md; do printf "%-46s %5s\n" "$(basename $f)" "$(wc -w < $f)"; done | sort -k2 -n
```

Expected: nothing except `privacy.md`, `accessibility.md` and the three region pages under 800 words.

- [ ] **Step 5: Verify and commit, one page per commit**

```bash
npm run verify:all
git add src/content/pages/<name>.md
git commit -m "content: <name> to full depth"
```

---

# PHASE 3 — SEO

## Task 11: Topic clusters — service ↔ equipment ↔ article ↔ FAQ

**Files:**
- Modify: frontmatter and `RelatedLinks` blocks across `src/content/pages/*.md` and `src/content/articles/*.md`

Round 1 §19 and round 2 §10.

- [ ] **Step 1: Map what exists**

```bash
grep -roh 'href="/[a-z-]*"' src/content/ | sort | uniq -c | sort -rn
```

- [ ] **Step 2: Draw the intended graph**

Write `docs/topic-clusters.md`. Three clusters, each with one hub, its equipment pages, its articles and its FAQ group:

- **מתקני הרמה** — hub `/lifting-equipment-inspection`; equipment: מלגזות, עגורנים (+ גשר/שער/זרוע), במות הרמה, שולחנות הרמה, מגבהים, ג'ק, דפנות הרמה, נוספים
- **אביזרי הרמה** — hub `/lifting-accessories`
- **קווי חיים** — hub `/lifeline-inspection`

Every child links up to its hub and sideways to at least two siblings. Every hub links down to every child. Every article links to its cluster hub and to one equipment page. Every equipment page links to its FAQ group and to `/contact`.

- [ ] **Step 3: Implement the links**

Use the existing `RelatedLinks` and `LinkCards` blocks — do not invent a component. The block union in `content.config.ts` is frozen.

- [ ] **Step 4: Verify every page has both directions**

```js
(() => {
  const links = [...document.querySelectorAll('main a[href^="/"]')].map(a => a.getAttribute('href'));
  return JSON.stringify({ count: links.length, unique: [...new Set(links)] }, null, 1);
})()
```

Run per route. No content page may finish with fewer than four distinct internal links in `<main>`.

- [ ] **Step 5: Verify and commit**

```bash
npm run verify:all
git add src/content/ docs/topic-clusters.md
git commit -m "seo: wire the three topic clusters both ways"
```

---

## Task 12: Make תסקיר a first-class entity

**Files:**
- Modify: `src/content/pages/*.md` frontmatter and body
- Modify: `src/content/faq/*.json`

Round 1 §18 and round 2 §14. The word appears; the entity does not. Natural placement only — round 2 §14 says explicitly this must not read as keyword stuffing.

- [ ] **Step 1: Count today's coverage**

```bash
grep -rc "תסקיר" src/content/pages/*.md | sort -t: -k2 -n
```

- [ ] **Step 2: Give each cluster its own תסקיר section**

Each equipment page gets a section explaining what its report contains — תסקיר מלגזה, תסקיר עגורן, תסקיר אביזרי הרמה, תסקיר מתקני הרמה — using Task 8's documenting formulation. Never the approving one.

- [ ] **Step 3: One FAQ entry per cluster on what a report contains and how long it is kept**

Round 2 §13 gates retention claims: if the client has not approved a retention period, ask the question and answer only what is certain.

- [ ] **Step 4: Verify and commit**

```bash
npm run verify:all
git add src/content/
git commit -m "seo: תסקיר as an entity, per cluster, in the documenting formulation"
```

---

## Task 13: Per-page metadata sweep

**Files:**
- Modify: frontmatter across `src/content/**`
- Modify: `src/lib/seo.ts`, `src/lib/schema.ts` only if a defect turns up

Round 2 §15.

- [ ] **Step 1: Dump what ships today**

```bash
npm run build
for f in $(find dist -name '*.html'); do
  echo "=== ${f#dist} ==="
  grep -o '<title>[^<]*' "$f" | head -1
  grep -o 'name="description" content="[^"]*' "$f" | head -1
  grep -o '<h1[^>]*>[^<]*' "$f" | head -1
  grep -c 'rel="canonical"' "$f"
done
```

- [ ] **Step 2: Check every row**

Title unique and under ~60 characters; description unique and 140–160; exactly one `<h1>` (`PageHead.astro` is the only component allowed to emit one — `CONVENTIONS.md` rule 3); exactly one canonical.

- [ ] **Step 3: Kill the near-duplicates**

`/crane-inspection` vs `/bridge-crane-inspection` vs `/gantry-crane-inspection` vs `/jib-crane-inspection` are the highest cannibalisation risk on the site. After Task 10 the parent is a hub and the three children are specific; the titles and descriptions must say so.

- [ ] **Step 4: Check the alt text**

```bash
grep -o '<img[^>]*>' dist/**/*.html | grep -v 'alt="' | head -20
```

Expected: no output. Then read the alts that exist — they must describe the equipment and the setting, not repeat the page title.

- [ ] **Step 5: Validate the structured data**

```bash
grep -o 'application/ld+json' dist/index.html | wc -l
node -e "const fs=require('fs');const h=fs.readFileSync('dist/index.html','utf8');const m=[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];m.forEach((x,i)=>{try{const j=JSON.parse(x[1]);console.log(i,j['@type'])}catch(e){console.log(i,'PARSE FAIL',e.message)}})"
```

Expected: `LocalBusiness` and `FAQPage` on the homepage, no parse failures. Never hand-write FAQ schema — `FaqSection.astro` owns it (`CONVENTIONS.md` rule 4).

- [ ] **Step 6: Check the sitemap covers everything**

```bash
grep -c '<loc>' dist/sitemap-0.xml
find dist -name '*.html' | wc -l
```

The counts should match, less the 404.

- [ ] **Step 7: Verify and commit**

```bash
npm run verify:all
git add src/content/ src/lib/
git commit -m "seo: unique title, description, canonical and alt on every route"
```

---

## Task 14: Replace the imagery

**Files:**
- Modify: `public/uploads/*`
- Modify: `src/lib/image-manifest.json` (regenerated)
- Modify: `docs/image-brief.md`

Round 1 §9, §11, §25, §26 and round 2 §5. **This one is blocked on the client** — it needs a photo day. Everything else in the plan can finish without it.

- [ ] **Step 1: Turn `docs/image-brief.md` into a shot list**

Seven shots, from round 1 §26: hero (an inspector in a working plant with lifting equipment), a forklift inspection, a bridge crane in a production hall, lifting accessories close up (straps, chains, shackles), a real lifeline system on a roof or structure, the office, and a close-up of an inspection in progress. Each row: subject, setting, orientation, crop, and where on the site it lands.

- [ ] **Step 2: Send it and get a date**

Nothing here can be simulated. Round 2 §5 asks for photographs that look like the company's actual work — the whole point is that they are not stock and not generated.

- [ ] **Step 3: When the photos arrive**

```bash
npm run images && npm run verify:all
```

`scripts/gen-images.mjs` writes the 480/800/1200 variants and records intrinsic sizes in the manifest. The variants are gitignored; the originals are committed.

- [ ] **Step 4: Re-run the width matrix**

New aspect ratios reflow. The whole matrix runs again.

- [ ] **Step 5: Commit**

```bash
git add public/uploads src/lib/image-manifest.json docs/image-brief.md
git commit -m "media: real photographs from the field"
```

---

## Task 15: Clear the launch placeholders

**Files:**
- Modify: `src/content/settings/site.json`
- Modify: `public/admin/config.yml`

Blocked on the client for the values, not for the work.

- [ ] **Step 1: List what is outstanding**

- `ga4Id: "G-XXXXXXXXXX"` — no analytics until this is real
- `accessibility.coordinatorName: "REPLACE-ME"` — renders on an orange mark on `/accessibility`; the regulations require a named coordinator
- `domain: "https://ardi-engineers.co.il"` — **does not currently resolve.** Canonicals, the sitemap and the JSON-LD all point at it. Confirm the client owns it and when DNS lands.
- `public/admin/config.yml` — `REPLACE-ME` for the GitHub repo and the auth worker. Until set, the CMS cannot open and the client cannot edit anything.

- [ ] **Step 2: Ask for all four in one message**

- [ ] **Step 3: Fill them in, then verify**

```bash
npm run verify:all
grep -rn "REPLACE-ME\|G-XXXXXXXXXX" src/ public/ && echo "STILL PRESENT" || echo "clean"
```

- [ ] **Step 4: Confirm the domain resolves**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -L --max-time 12 https://ardi-engineers.co.il
```

Expected: `200`.

- [ ] **Step 5: Commit**

```bash
git add src/content/settings/site.json public/admin/config.yml
git commit -m "chore: real GA4 id, coordinator, domain and CMS backend"
```

---

# PHASE 4 — expansion

Round 1 closes with the client's own instruction: **finish this round before building dozens more pages**, so every new page inherits one design language, one hierarchy and one content standard. Phase 4 does not start until Phases 1–3 are committed and the client has signed off on `docs/regulatory-review.md`.

## Task 16: Decide the page names before building any

**Files:** `docs/page-names.md` (new)

Round 1 §13. Every service and equipment page name gets reviewed for whether it reads naturally to a person, not just to a search engine. One table: current URL, current title, proposed title, and the reason. The client picks. Renames after launch cost redirects; renames now cost nothing.

## Task 17: Build the remaining equipment pages

Only pages that clear round 1 §12's four tests: real search volume, enough genuine professional content, a real user need, and an SEO case. A thin page for a keyword is worse than no page.

## Task 18: Extend the clusters

Each new page joins its cluster in both directions on the day it ships. `docs/topic-clusters.md` is updated in the same commit, never afterwards.

---

## Running this with parallel agents

Per `CONVENTIONS.md` §"File ownership when running parallel agents": what matters is that no two agents write the same file.

**Phase 1, wave 1 — Task 5 alone.** It edits `tokens.css`, which moves every page.

**Phase 1, wave 2 — Tasks 2, 3 and 4 in parallel:**

| Agent | Task | Files |
|---|---|---|
| A | 2 | `HomeProcess.astro`, `scripts/check-cycle.mjs`, `package.json`, `.vercelignore` |
| B | 3 | `LeadForm.astro`, `scripts/form.ts` |
| C | 4 | `Hero.astro` |

B and C both touch the hero region visually but not the same file. C must rebase on B before its final measurement, since the form sits inside the hero.

**Phase 1, wave 3 — Task 6 alone**, after A, B and C merge. It is the sweep; it must see the merged result.

**Phase 2 — Tasks 7, 8, 9 and 10 in parallel:**

| Agent | Task | Files |
|---|---|---|
| D | 7 | `navigation.json`, `nav.ts`, `chrome/*` |
| E | 8 | `content/pages/*.md`, `content/faq/*.json`, `docs/regulatory-review.md` |
| F | 9 | `content/articles/*.md` |
| G | 10 | `content/pages/*.md` |

**E and G collide on `content/pages/*.md`.** Run E first — it is a targeted grep-and-replace across three files and finishes fast — then G. Or split by filename and say which files each owns in the brief.

**Phase 3 — Tasks 11, 12 and 13 are sequential.** All three rewrite frontmatter and internal links across the same content tree.

Every agent's brief must carry: its file list, the verification matrix, `npm run verify:all`, and the instruction to commit its own work.

---

## Definition of done for the round

- [ ] Every width in the matrix, on every route, returns an empty `over` array
- [ ] `npm run verify:all` green, including the new `check-cycle`
- [ ] The cycle holds four list items under a forced `list-style`
- [ ] Phone, booking and WhatsApp in that order of weight, in the form and in the hero
- [ ] Ten sections on the homepage, every one with symmetric block padding
- [ ] Header and footer expose the same pages, cranes nested under cranes
- [ ] No occurrence of a report "approving" equipment
- [ ] `docs/regulatory-review.md` has no row left at `ממתין לאישור`
- [ ] No page under 800 words except privacy, accessibility and the region pages
- [ ] Every route: unique title, unique description, one `<h1>`, one canonical, alt on every image
- [ ] No `REPLACE-ME` and no `G-XXXXXXXXXX` anywhere
- [ ] `docs/responsive-sweep.md` filled and sent

---

## Open decisions — needed from the client

1. **Which URL did the second review look at?** The audit could not find a live deploy: `ardi-engineers.co.il` does not resolve and `ardi-site.vercel.app` serves an unrelated React app. Task 1 is blocked on this.
2. **The photo day** — Task 14 cannot start without it, and it is the largest single lever on the "this looks AI-generated" note.
3. **GA4 id, accessibility coordinator's name, the production domain, and the CMS GitHub repo + auth worker** — Task 15.
4. **Regulatory sign-off** on every claim in `docs/regulatory-review.md` — gates Tasks 9, 10 and 12, and the whole of Phase 4.
5. **Which equipment pages are actually worth building** — Task 17, against round 1 §12's four tests.
