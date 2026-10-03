# edlei.dev — design system

Governing principle: **Swiss / International Typographic Style** (Müller-Brockmann,
*Grid Systems in Graphic Design*), inverted to a dark ground.

Nothing on this site is placed by eye. Every horizontal position resolves to a
column on a 12-column grid; every vertical measure is a multiple of the 8px
baseline unit; every type size comes from one modular scale. If a value in the
CSS is not derived from a token below, that is a bug.

## 1. Grid

- 12 columns, gutter `--gutter` (24px), max measure `--measure-max` (1280px).
- Page margins are columns, not padding: content starts at column 1 and the
  right rail (hero portrait, project cards, cup) starts at column 7.
- Text blocks never exceed 66ch (`--measure-text`). Swiss reading measure.
- Flush left, ragged right. No justified text, no centered body copy.
  The only centered element on the site is nothing.

## 2. Baseline

- `--baseline: 8px`. All margins, padding, gaps, and line-heights are
  `calc(var(--baseline) * n)`.
- Section rhythm: `--space-section: 96px` (12 units) between major sections.

## 3. Type scale

One ratio — minor third (1.2) — from a 16px body, clamped for fluidity.

| Token | Role | Face |
|---|---|---|
| `--t-display` | "I'm Edward L" | Archivo Black |
| `--t-h2` | Section headings | Archivo Black |
| `--t-h3` | Card / timeline titles | Roboto 700 |
| `--t-body` | Body copy | Roboto 400 |
| `--t-meta` | Labels, captions, `<In progress>` | Roboto 400, tracked +0.08em, uppercase |

Faces, per the sketch's own annotations:
- **Roboto Bold** — site header wordmark and the "Hey there," line.
- **Archivo Black** — every heading from the display line downward.
- **Roboto** — all body copy.
- **Libre Barcode 39 Extended** — the two full-bleed rules only. Never for reading.

## 4. Color

Near-achromatic. Black ground, white figure, and a single teal accent used
sparingly for interactive affordance.

- `--ink-0` #FFFFFF — display type
- `--ink-1` #E6E6E6 — body
- `--ink-2` #9A9A9A — meta, captions
- `--ink-3` #5A5A5A — rules, dormant timeline dots
- `--ground` #0A0A0A — page
- `--ground-1` #141414 — raised surfaces (project cards)
- `--accent` #2D9FAE — links, focus rings, active states (your colour)
- `--accent-hi` #4CADBA — hover/pressed lift of the accent

Contrast: `--ink-2` on `--ground` is 7.0:1; `--accent` on `--ground` is 6.9:1
and 6.6:1 on `--ground-1`. All pass WCAG AA at body size. The accent is the
only chromatic value on the site — it appears on interaction, never as
decoration, so its rarity is what makes it legible as "this does something".

## 5. Rules (lines)

Hairlines are 1px `--ink-3`. Structural separators are the barcode strips:
full-bleed, white bars on the page's own black ground. They segment the page
the way a Swiss rule does — a band of pure texture with no competing colour —
while encoding the site's "Construction in progress..." status in Code 39.

## 6. Motion

- Duration tokens: `--dur-fast` 120ms, `--dur` 240ms, `--dur-slow` 640ms.
- Easing: `--ease` cubic-bezier(0.2, 0, 0, 1). No bounce, no spring.
- Every non-decorative transition is ≤240ms. The cup sequence is decorative and
  therefore allowed to run long.
- `prefers-reduced-motion: reduce` removes the cup sequence entirely and
  collapses all transitions to 0ms. Nothing depends on motion to be legible.

## 7. Components

Hand-written. No component library, no utility framework, no generated markup.
Each component owns its CSS in its own `.astro` file; shared values live only in
`src/styles/tokens.css`.
