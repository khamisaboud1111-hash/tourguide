# Design System — Zanzibar Karibu Tours

**Phase 1 deliverable.** Source of truth for visual decisions; code source is `tailwind.config.ts` + `app/globals.css` + `lib/tokens.ts` + `components/ui/*`.

## 1. Brand Narrative

Zanzibar · ocean · warmth · authenticity · culture · luxury · adventure · local expertise · calm · trust · premium hospitality.

The system is restrained — editorial like Apple / Stripe / Linear / Vercel, but unmistakably Zanzibari. No generic SaaS dashboard, no crypto gradients, no glass-everywhere, no exaggerated rounded cards.

## 2. Color

### Anchors (from prompt, mapped onto existing ramps)

| Token | Hex | Ramp | Usage |
|-------|-----|------|-------|
| Deep Ocean | `#142825` (`lagoon.900`) family, near `#0B2927` | `lagoon.900` / `indigo.900` | Navbar text, footer, dark overlays |
| Warm Ivory | `#FBF8F1` (`stone.50`) ≈ `#F7F3EA` | `stone.50` | Page canvas |
| Clove / Earth | `#8B3A2B` (`clove.500`) | `clove.*` | Primary CTA, links, focus ring, active |
| Brass / Luxury | `#C08A2E` (`saffron.500`) | `saffron.*` | Kicker, divider stud, accent only |

### Semantic aliases (`tailwind.config` `colors.surface`/`ink`/`border`)

- `surface.DEFAULT` `#FBF8F1`, `surface.muted` `#F5EFDD`, `surface.card` `#FFFFFF`
- `ink.DEFAULT` `#1A241F`, `ink.muted` `#4A3E29`, `ink.faint` `#6B5A38`
- `border.DEFAULT` `#EDE3C8`, `border.strong` `#E0D2AC`

### Palette discipline

- Every screen: Ivory canvas + white cards + ink text; Clove for exactly one primary action per viewport; Saffron only for kickers/badges; Lagoon for secondary/calm/WhatsApp; Indigo for hero overlay → warmth, not cold blue.
- Never make every card colorful; accent communicates hierarchy and interaction only.
- Tokens live in CSS vars (`--color-*`) for JS/email/map theming too.

## 3. Typography

**Pairing (preserved):** Fraunces (serif, editorial brand moments) + Work Sans (sans, interface).

Loaded via `next/font/google` with `display: swap`, vars `--font-fraunces` / `--font-work-sans`.

| Scale | Family | Size | Line | Tracking | Weight | Usage |
|-------|--------|------|------|----------|--------|-------|
| `display` | Fraunces italic | 4.5rem | 0.95 | -0.03em | 500 | Hero headline only |
| `h1` | Fraunces | 3rem | 1.05 | -0.025em | 600 | Page hero |
| `h2` | Fraunces | 2.25rem | 1.1 | -0.02em | 600 | Section titles |
| `h3` | Fraunces | 1.5rem | 1.25 | -0.015em | 600 | Card titles, subheads |
| `h4` | Fraunces / Work Sans semibold | 1.125rem | 1.35 | -0.01em | 600 | Eyebrow + dense UI |
| `body-lg` | Work Sans | 1.125rem | 1.7 | — | 400 | Hero lead, editorials |
| `body` | Work Sans | 1rem | 1.65 | — | 400 | Default |
| `body-sm` | Work Sans | 0.875rem | 1.6 | — | 400 | Card body, form |
| `caption` | Work Sans | 0.8125rem | 1.5 | — | 400 | Metadata, help |
| `label` | Work Sans | 0.75rem | 1.4 | 0.08em | 500 | Kicker, badge, CTA label |
| `micro` | Work Sans | 0.6875rem | 1.4 | 0.12em | — | Uppercase micro-labels |

Utilities: `.text-balance` / `.text-pretty` for headlines; editorial serif italic only for emotional beats, never for UI chrome.

## 4. Spacing & Containers

- Tailwind default spacing (4 = 1rem) unchanged; add semantic `--section` `6rem` / `--section-lg` `8rem` for vertical rhythm.
- Container: `.container-page` = `mx-auto max-w-6xl (72rem) px-6 md:px-10` (content). `.container-wide` = `80rem` (hero/gallery). `--container-content` / `--container-wide` vars.

## 5. Radii — Restrained

| Name | Value | Usage |
|------|-------|-------|
| `xs` | 8px | Inputs, small chips inside cards, focus outline fallback |
| `sm` | 12px | Filter chips, small images |
| `md` | 16px | Inputs `rounded-xl` (12-16 family), media thumbnails |
| `lg` | 20px | Section media, map (`rounded-2xl` ≈ 16-20 zone) |
| `xl` | 24px | Featured cards |
| `2xl` | 28px | Gallery featured — rare |
| `full` | 9999 | Buttons (`rounded-full`), badges, FAB |

Principle: Cards ≈ `lg` (20), buttons = `full`, no uniform `rounded-3xl` everywhere.

## 6. Shadows — Quiet Cinematic

```
soft:         0 1px 2px rgba(10,19,28,.06), 0 4px 12px rgba(10,19,28,.05)
card:         0 1px 3px rgba(10,19,28,.07), 0 8px 24px rgba(10,19,28,.06)
card-hover:   0 4px 12px rgba(10,19,28,.09), 0 16px 32px rgba(10,19,28,.07)
nav:          0 1px 0 rgba(10,19,28,.06), 0 12px 32px rgba(10,19,28,.08)
floating:     0 8px 24px rgba(10,19,28,.12), 0 20px 48px rgba(10,19,28,.10)
```
No heavy drop shadows; hover lifts by `y:-2px` + shadow swap, content stays stable.

## 7. Motion

```
micro:    150ms — input focus, icon nudge
ui:       200ms — button hover, card hover, nav
emphasis: 280ms — card lift, overlay
enter:    320ms — hero reveal, dialog
ease-ui:       cubic-bezier(0.2, 0.8, 0.2, 1)
ease-entrance: cubic-bezier(0.16, 1, 0.3, 1)
```
All keyframes (`reveal` 480ms, `fade-in` 220ms, `scale-in` 260ms) respect `prefers-reduced-motion` (globals.css kills durations).

## 8. Breakpoints & QA

Tailwind defaults + `xs: 390px`. QA viewports: 320 · 375 · 390 · 414 · 768 · 1024 · 1280 · 1440 · 1920 (per prompt). Containers do not exceed readable measures: prose `68ch`.

## 9. Primitives (`components/ui`)

### Button (`Button.tsx`)
- Variants: `primary` (clove), `secondary` (lagoon), `outline`, `ghost`, `inverse` (over dark/image).
- Sizes: `sm` / `md` / `lg` / `pill` (all `rounded-full`; `lg` = hero CTA).
- Polymorphic: `href` → Next `Link` (external adds `noopener`); no href → `button`. `AnchorButton` for raw `<a>`.

### Badge (`Badge.tsx`)
- Variants: `category`, `muted`, `success`, `warning`, `inverse`. Always `rounded-full`, `text-xs`, backdrop blur for over-image.

### Input (`Input.tsx`)
- `Input` / `Textarea` / `Select` share `fieldBase`: `rounded-xl border bg-stone-50`, `focus:border-clove-500 + ring 2px /15%`. `invalid` → `border-clove-400`. `Label`, `FieldHint`, `FieldGroup`.

### Card (`Card.tsx`)
- Shell: `rounded-2xl bg-white border border-stone-200 shadow-soft` (+ `hover:shadow-card-hover + translate-y -0.5` when `hover`). `CardImageWrap` handles overflow; `CardBody`.

### SectionHeading (`SectionHeading.tsx`)
- Kicker (`saffron.600` `label` `tracking-[0.2em] uppercase`) + Fraunces `h2` + optional `body` description. `align: left|center`.

## 10. Global Utilities

- `focus-ring` component class for custom elements (ring instead of outline).
- `.container-page` / `.container-wide`, `.text-balance` / `.text-pretty`, `.hairline`, `.no-scrollbar`.
- `::selection` = `saffron.200` on `stone.900`.

## 11. Rules

- **Do not hardcode** hex/radii/shadows/durations outside tokens — grep for `#[0-9a-f]{6}` in components should only hit `tokens.ts` / `tailwind.config.ts`.
- **Accent discipline:** never more than one primary Clove button per viewport stack; Saffron only as kicker/indicator.
- **Door motif:** signature SVG, max 2× per page (home transition + footer) — not repeated in every section.
- **Real content > fake:** rating/review/count/badge only when data supplies it (nullable DB columns added Phase 4+).

## 12. Phase 1 Acceptance Checklist

- [x] `tailwind.config.ts` extended with `fontSize`, `borderRadius`, `boxShadow`, `transitionDuration/Timing`, `screens.xs`, `maxWidth`, `spacing.section`, `keyframes`.
- [x] `app/globals.css` defines CSS vars, `container-page` refine, editorial helpers, reduced-motion guard.
- [x] `lib/tokens.ts` typed mirror + `cn()`.
- [x] `components/ui/{Button,Badge,Input,Card,SectionHeading}` render, handle focus-valid, disabled, invalid states.
- [x] No visual regression on existing routes (perceptual diff < intentional).
