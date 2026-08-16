# Responsive sweep

**Run:** 2026-08-16 · commit `c15ee82` · 35 routes × 10 widths = **350 checks**
**Result: 0 failures.**

Both review rounds said the same thing twice: *"it is not enough that the site
looks good on one computer."* This is the answer to that — a grid, not an
impression. Re-run it after any layout change.

## Method

Each route is loaded into an off-screen iframe of a fixed width and measured in
place. An iframe's media queries respond to the iframe's own width, so one pass
covers every breakpoint without resizing the browser 350 times.

Per check:

1. **Horizontal overflow** — `documentElement.scrollWidth` must equal
   `clientWidth`, and no element may extend past the viewport box.
2. **Text on images** — no `<p>`, `<h1>`, `<h2>` or `<h3>` may share screen
   space with a `.frame` it does not belong to.
3. **Layout actually happened** — `scrollHeight` and the element count are
   recorded so an empty measurement cannot pass as a clean one.

### Three things that make this measurement lie

Each of these produced a false result on the way to this table.

- **RTL puts the scrollbar on the inline-start edge.** Every full-width element
  therefore starts at `x = w - clientWidth`, not `0`. Comparing against `0`
  flags the header, the main, every section and the footer on every page — 350
  out of 350 "failures" on the first run. Compare against the scrollbar offset.
- **A wide table inside `overflow-x: auto` is not a page overflow.** The
  regulation table legitimately extends past the viewport inside its own scroll
  container. Walk the ancestors and skip anything already inside one, or the
  table reports as a bug on `/equipment`, `/faq` and `/forklift-inspection` at
  every width below 768.
- **`onload` fires before layout settles.** Measuring immediately returns
  `scrollHeight === iframe height` and zero sized elements, which passes every
  check by measuring nothing. Wait for the frame to settle and assert
  `docH > viewport` before trusting a row. Eleven rows in this run were also
  hit by a rebuild that rewrote `dist` mid-sweep; they were re-measured against
  a stable build and are included below.

## Widths

| Target | Why this one |
|---|---|
| 1440 | wide desktop |
| 1280 | the common laptop |
| 1080 | the footer's `@media (width >= 1080px)` boundary |
| 916 | just above the process ring's `>= 901px` breakpoint |
| 900 | just below it — the fallback column must look deliberate |
| 768 | tablet portrait |
| 600 | large phone landscape |
| 430 | iPhone Pro Max |
| 375 | the mobile baseline |
| 320 | the narrowest supported |

Note: the media-query `width` feature includes the scrollbar. A request for
900px yields a 885px content box but still evaluates `width: 900px`, so the
ring's real crossover in content-box terms sits near 886px. Both sides were
checked.

## Results

All 35 routes pass at all 10 widths: no horizontal overflow, no text over
images, no load errors.

| Route group | Routes | Result |
|---|---|---|
| Home | `/` | 10/10 |
| Services | `/services`, `/lifting-equipment-inspection`, `/lifting-accessories`, `/lifeline-inspection` | 40/40 |
| Equipment | `/equipment`, `/forklift-inspection`, `/crane-inspection`, `/bridge-crane-inspection`, `/gantry-crane-inspection`, `/jib-crane-inspection`, `/lift-platform-inspection`, `/lift-table-inspection`, `/vehicle-lift-inspection`, `/vehicle-jack-inspection`, `/tail-lift-inspection`, `/additional-lifting-equipment` | 120/120 |
| Regions | `/lifting-inspection-center`, `/lifting-inspection-sharon`, `/lifting-inspection-south` | 30/30 |
| Blog | `/blog` + 7 articles | 80/80 |
| Other | `/about`, `/contact`, `/faq`, `/toda`, `/404`, `/privacy`, `/accessibility` | 70/70 |

### Page height, homepage

| Width | Height |
|---|---|
| 1440 | 8256 |
| 1280 | 8242 |
| 916 | 9827 |
| 900 | 10710 |
| 768 | 10898 |
| 375 | 14335 |
| 320 | 14621 |

Desktop came down from 8414 to 8256 across this round, and the homepage went
from eleven sections to ten. **Mobile is still roughly seventeen screens**, and
CSS will not fix that — the remaining height is content: six equipment cards
with photographs, three article cards, the FAQ and the form. Cutting it further
is a content decision, not a spacing one, and round one §29 is explicit that
the goal is not a shorter page but a page where every scroll pays.

## Defects this sweep found

Both were invisible at desktop width on the developer's own machine, which is
exactly the failure mode the client described.

1. **`/blog` featured card — the two-column grid never applied.**
   `Card.astro` sets `.card { display: block }`. `ArticleCard`'s
   `.acard--featured { display: grid }` is the same specificity and loses on
   source order, while `grid-template-columns: 0.9fr 1.1fr` — which `Card.astro`
   never declares — still applied. A block box with two unusable column tracks:
   the media took the full 1096px and stretched to 1083px tall.
   Fixed in `55d4483` by raising the selector to `.card.acard--featured`.

2. **Article card bodies overflowed onto the row above.**
   `block-size: 100%` sat on every `.acard__media`. The stacked cards are grid
   items under `align-items: stretch`, so that percentage resolved against a
   height derived from the media itself. The figure painted at full card height,
   the body ran past the card's bottom edge, and one row's titles landed on top
   of the photographs above them — the "text on the pictures" note, on `/blog`
   and on the homepage's article row.
   Fixed in `55abcd1` by scoping the declaration to the featured card.

## Re-running it

Build, serve the built output, and run the sweep against the preview — not the
dev server, so what is measured is what ships:

```bash
npm run build && npx astro preview --port 4410
```

Then open the preview in the browser pane and run the sweep script from this
document's method section. **Do not rebuild while a sweep is running** — it
rewrites `dist` underneath the server and the in-flight rows measure a
half-written build. That happened here and cost eleven rows.
