# CONVENTIONS — read this before writing a line

Hebrew RTL lead-generation site for ארזי מיטב המהנדסים (certified lifting-equipment inspector).
Astro 5 static, Sveltia CMS, Netlify. Phase 0 is complete and **frozen**.

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

## File ownership during the parallel phase

Phase 0 files are **read-only**. You may *add* a file to a shared directory; you may not *edit*
an existing one. If you need a change to a frozen file, say so in your report instead.

| Stream | Owns |
|---|---|
| **A** | `components/chrome/*`, `components/form/*`, `src/scripts/*`, `pages/contact.astro`, `pages/toda.astro`, `pages/404.astro` |
| **B** | `pages/[...slug].astro`, `components/templates/*`, `components/blocks/*` (except `registry.ts`) |
| **C** | `pages/index.astro`, `pages/blog/*`, `components/home/*`, `components/blog/*`, `styles/prose.css` |
| **D** | all of `src/content/**`, all of `public/**`, `components/placeholders/*`, `docs/*` |

**Frozen, nobody edits:** `src/content.config.ts`, `src/components/blocks/registry.ts`,
`src/styles/tokens.css`, `src/site.config.ts`, `src/lib/*`, `src/layouts/*`, `src/components/ui/*`,
`src/components/seo/*`, `src/components/media/*`, `astro.config.mjs`, `netlify.toml`.

Streams A, B and C inherit working Phase 0 stubs in their own directories — those are yours to
replace. Only Phase 0 runs `npm install`. Build to `.tmp/dist-<stream>` so you do not race on `dist/`.

## Cross-stream contracts (frozen)

1. `document` dispatches `CustomEvent('equipment:change', { detail: { ids: string[] } })` —
   C's chip picker emits, A's form listens and preselects.
2. The `sections` discriminated union in `content.config.ts` — B consumes, D produces.
3. `PlaceholderVariant` (9 values) in `content.config.ts` — D supplies the art, B and C consume.
4. `data-track="phone_click|whatsapp_click|form_start|generate_lead"` — A listens via one
   delegated handler; everyone else just adds the attribute.

## Commands

```bash
npm run dev            # localhost:4321
npm run build
npm run verify         # check-rtl + check-html + check-links
npm run verify:all     # build then verify
```

`check-links` currently reports the 14 pages Stream D has not written yet. That is expected until
D lands; it must be green before launch.

## Known placeholders (see docs/launch-checklist.md)

Phone, WhatsApp, email, GA4 measurement ID and the production domain are all placeholders in
`src/content/settings/site.json`. The site must not go live with them.
