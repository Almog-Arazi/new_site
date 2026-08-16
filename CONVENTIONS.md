# CONVENTIONS — read this before writing a line

Hebrew RTL lead-generation site for ארזי מיטב המהנדסים (certified lifting-equipment inspector).
Astro 5 static, Sveltia CMS, deployed on **Vercel**. The initial build is complete; the site is
live and in a review-and-refine phase.

The lead form does **not** post anywhere. It composes the fields into a Hebrew WhatsApp message
and opens wa.me; see `src/scripts/form.ts`. There is no inbox, no honeypot and no spam surface.

## The five rules

1. **No raw values in components.** Every colour, radius, shadow, spacing and duration is a
   `var(--…)` from `src/styles/tokens.css`. `npm run verify` fails the build on a violation.
2. **No physical CSS properties.** `margin-inline-start`, not `margin-left`. `inset-inline-end`,
   not `right`. `text-align: start`, not `left`. The `border-radius` **shorthand with more than
   one value is physical** — the asymmetric photo frame uses `border-start-start-radius` and
   friends. Same linter enforces this.
3. **`PageHead.astro` is the only component that may emit `<h1>`.** One per page, always.
4. **FAQ data lives once.** `FaqSection.astro` takes one array and emits both the accordion and
   the `FAQPage` JSON-LD. Never hand-write FAQ schema anywhere else.
5. **JSON-LD is emitted via `<JsonLd data={…} />`** (which uses `set:html`). Never interpolate
   `{JSON.stringify(x)}` into a script tag — Astro HTML-escapes the quotes and the JSON breaks.

## Hebrew / RTL specifics

- `letter-spacing: 0` everywhere. Positive tracking visually shatters Hebrew words.
- Body `line-height: 1.75`. Do not tighten.
- No `text-transform: uppercase` — a no-op in Hebrew that mangles mixed Latin.
- Every phone number, email, URL and Latin fragment goes inside `<bdi class="ltr">` (or the
  `Bdi.astro` component). Without isolation, `+972…` reorders and the `+` lands at the wrong end.
- `tel:` / `wa.me` hrefs are bare E.164 with no formatting characters. Use `telHrefFor()` /
  `waHrefFor()` from `src/lib/format.ts`.
- Directional icons (arrow, chevron) pass `flip` to `Icon.astro` so they mirror.
- `smartypants: false` in `astro.config.mjs` is load-bearing: it keeps `בע"מ` — the company name —
  from being rewritten with curly quotes.

## Accessibility floor (WCAG AA)

- **`#E8620C` on white is 3.40:1 and fails AA for normal text.** Orange is a *surface* colour
  with a white 700-weight label at `--fs-btn` (clears AA-Large). For orange **as text** on a light
  background use `--c-action-ink`.
- `--c-text-muted` is 3.12:1 — decorative or ≥19px only. Never body copy, never form hints.
- Touch targets ≥ `var(--tap)` (44px); primary CTAs `var(--tap-lg)` (52px).
- Visible focus on everything: `:focus-visible` with `--ring`. Never remove an outline without
  replacing it.
- State is never colour-only — the selected chip also shows a check mark.
- Everything respects `prefers-reduced-motion` (the motion tokens collapse to 1ms automatically).

## Visual language — what makes this *not* look AI-generated

- **Sections are inset rounded slabs floating on white**, not edge-to-edge stripes. Use
  `Section.astro` with `tone`.
- **Cards carry a hairline + tint, no resting shadow.** Shadow appears on hover only. Elevation is
  reserved for things that genuinely float: the desktop CTA rail, the mobile bar, hover states.
- **Max two elevation levels visible in a viewport.** Shadows are tinted by their own surface hue,
  never neutral black.
- **Zero gradients.** The single exception is the 4px amber rule on the dark CTA band.
- No `backdrop-filter`. No uniform "rounded card + shadow" grid.
- Amber is small marks and checks on navy only.
- One stroke-icon language: 24px grid, 1.75px strokes, from `IconSprite.astro`.

## File ownership when running parallel agents

The table below is the *current* split, rewritten after the first review round. The original
build-phase streams (A–D by component directory) no longer exist.

When several agents run at once, give each a disjoint set and say so in the brief. What matters is
that no two agents write the same file, not which letter they are called.

**Genuinely frozen — changing these breaks contracts elsewhere:**
`src/content.config.ts` (the 12-block union — the CMS `config.yml` mirrors it field by field, and a
mismatch saves cleanly in the CMS then fails the build, stranding the client),
`src/components/blocks/registry.ts`, `astro.config.mjs`.

**Change with care, and tell the other agents:** `src/styles/tokens.css` (one edit moves the whole
site — that is the point of it), `src/components/ui/*`, `src/components/media/PhotoFrame.astro`,
`src/lib/*`, `src/layouts/*`, `src/site.config.ts`.

Nothing else is frozen. `netlify.toml` is a leftover from an abandoned host; `vercel.json` is live.

Build to `dist/` — `npm run verify` hardcodes it. If two agents build at once, re-run
`npm run verify:all` before trusting the result.

## Cross-stream contracts (frozen)

1. `document` dispatches `CustomEvent('equipment:change', { detail: { ids: string[] } })` —
   C's chip picker emits, A's form listens and preselects.
2. The `sections` discriminated union in `content.config.ts` — B consumes, D produces.
3. `PlaceholderVariant` (9 values) in `content.config.ts` — D supplies the art, B and C consume.
4. `data-track="phone_click|whatsapp_click|form_start|generate_lead"` — A listens via one
   delegated handler; everyone else just adds the attribute.

## Commands

```bash
npm run dev            # localhost:4399 (see .claude/launch.json)
npm run images         # regenerate responsive variants + the image manifest
npm run build          # runs `images` first, then astro build
npm run verify         # check-rtl + check-html + check-links
npm run verify:all     # build then verify
```

All three verify scripts are green and must stay that way.

`scripts/gen-images.mjs` writes 480/800/1200 variants into `public/uploads` and records each
original's intrinsic size in `src/lib/image-manifest.json`. The variants are gitignored: they are
derived from the originals beside them. `PhotoFrame` reads the manifest for `srcset`, `width` and
`height` — an image missing from the manifest still renders, it just ships one file.

For accessibility checks, `axe-core` is already a devDependency. Copy it into `public/` briefly,
eval it in the page, run it, then **delete it** — do not leave `public/_axe.js` behind. The browser
tab must be fronted or rendering is throttled and the measurements silently lie; wait ~600ms after
navigating before running, or you will get phantom contrast violations.

## Known placeholders (see docs/launch-checklist.md)

Still placeholders in `src/content/settings/site.json`: the GA4 measurement ID, the production
domain, and `accessibility.coordinatorName` (which renders on an orange mark on `/accessibility`
until it is filled — the regulations name a coordinator explicitly). Phone and WhatsApp are real.
Email was removed from the site entirely at the client's request.

`public/admin/config.yml` still holds `REPLACE-ME` for the GitHub repo and the auth worker. Until
those are set the CMS cannot open, which also means the client cannot edit anything.
