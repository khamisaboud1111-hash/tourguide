# Premium Zanzibar Tour Guide — Implementation Plan

**Project:** Zanzibar Karibu Tours → Premium Boutique Zanzibar Travel Experience Platform  
**Stack:** Next.js 14.2.35 (App Router) · TypeScript 5 (strict) · Tailwind CSS 3.4 · Supabase (SSR) · Leaflet · Resend · Flutterwave · Lucide  
**Source audit date:** 2026-08-23  
**Original codebase:** `tourguide-website-main.zip` → `tour-guide-website/`

---

## Phase 0 — Repository Audit (COMPLETE)

### Current Architecture Findings

| Area | Finding |
|------|---------|
| **Framework** | Next.js 14.2.35, App Router, `force-dynamic` on data pages, no Pages Router usage |
| **TypeScript** | `strict: true`, `skipLibCheck: true`, `jsx: preserve`, path alias `@/*` → `./*` |
| **Tailwind** | 3.4.1, custom palette (stone, lagoon, clove, saffron, indigo), `font-display` / `font-body`, `container-page` utility |
| **Fonts** | `next/font/google` Fraunces (400/500/600/700 normal+italic, var `--font-fraunces`) + Work Sans (400/500/600, var `--font-work-sans`) |
| **Components** | 10 components: `Navbar`, `Footer`, `DoorMotifDivider`, `TourCard`, `BookingForm`, `ContactForm`, `TestimonialCard`, `TourMap`/`TourMapLoader`, `WhatsAppButton`, `admin/TourForm` + `AutoSubmitSelect` |
| **Pages / Routes** | `/(home)`, `/tours`, `/tours/[slug]`, `/about`, `/gallery`, `/contact`, `/booking/confirmed`, `/admin/(dashboard)`, `/admin/login`, `/api/webhooks/flutterwave` |
| **Supabase** | `@supabase/ssr` + `@supabase/supabase-js` via `lib/supabase/{client,server,service}.ts`, RLS enabled, 6 seed tours, `tours` + `bookings` tables |
| **Auth** | Supabase Auth email+password, middleware protects `/admin/*`, single admin account (no sign-up) |
| **Booking** | `app/actions/bookings.ts` → inserts `bookings`, sends Resend emails best-effort, revalidates `/admin/bookings`, then `BookingForm` offers optional `createPaymentLink` |
| **Payment** | Flutterwave Hosted Checkout (`createPaymentLink` + webhook verify + `/booking/confirmed` client verification), deposit = `price * depositPercent (0.2)`, RLS bypass via service client with `payment_ref` pin |
| **WhatsApp** | Central `waLink()` in `constants.ts`, `WhatsAppButton` fixed FAB, Navbar + ContactForm + Tour detail compose contextual messages |
| **Email** | `lib/email.ts` via Resend, guide notification always + customer confirm if contact is email |
| **Admin** | `/(dashboard)/layout` + `page` (overview), `/tours` (CRUD+publish toggle), `/tours/new`, `/tours/[id]/edit`, `/bookings` (status + payment selects) |
| **Map** | Leaflet 1.9 + react-leaflet 4.2 via dynamic `TourMapLoader` (SSR off), `business.mapCenter` Stone Town, per-tour `coords` |
| **Images** | `lib/placeholder.ts` → `picsum.photos/seed/{seed}` fallback, `photos/*` prefix → `/public/photos/*`, `next.config.mjs` allows `picsum.photos`, local `public/` does not exist yet |
| **Globals / Design** | `app/globals.css` has `@layer base` border + focus-visible outline, `container-page` = `mx-auto max-w-6xl px-6 md:px-10`, `text-balance`, `prefers-reduced-motion` guard |
| **Middleware** | Refreshes Supabase session, redirects unauthed `/admin/*` → `/admin/login` and authed login → `/admin` |
| **Deps** | 8 runtime deps, 7 dev deps, no `framer-motion`, no `shadcn`/`radix`, no test runner, no `next lint` custom config beyond `eslint-config-next` |
| **SEO** | `layout.tsx` `metadata.title/description` from `business`, per-page `metadata`, dynamic `d/tour` title/desc, no sitemap/robots/OG image/structured data |
| **A11y** | `focus-visible` outline exists, alt text present but gallery uses `alt=""`, no focus trap, no skip link, no aria for mobile menu |
| **Performance** | `next/image` with `fill`+`priority` on hero, Leaflet CDN icons (extra RTT), `force-dynamic` prevents ISR caching, no `loading.tsx` skeletons |
| **Debt / Gaps** | No design token system beyond Tailwind colors; hardcoded radii/borders/spacing; no reusable Button/Input/Card primitives; no Zod UI for tour filtering; placeholder images in production; mobile nav is basic dropdown (no full-screen, no focus trap); no tour search/sort/filters; tour detail is single-image header; no lightbox; no FAQ/reviews/data source; no i18n infra despite requirement |

### Reuse Decisions

- **Keep:** App Router structure, Supabase SSR pattern, RLS policies, seed migration approach, `lib/constants.ts` single-source business config, `lib/tours.rowToTour` translator, `lib/placeholder` `photos/*` convention, `DoorMotifDivider` SVG, Flutterwave+Resend flows.
- **Improve, don't replace:** `Navbar`, `Footer`, `TourCard`, `BookingForm`, `TourMap`, `globals.css`, `tailwind.config`, `next.config.mjs` image handling.
- **Do not introduce unless needed:** shadcn/Radix bulk install, framer-motion (only when micro-interactions justify it), new full CMS (Supabase admin + file upload suffices for Phase 12).
- **Do not duplicate:** `Button2`-style components, second map library, second auth system.

---

## Phase 1 — Design System

### Objective
Centralize every visual decision so Phases 2+ compose from tokens, not hardcoded values. Preserve Zanzibar identity (Deep Ocean `#0B2927` ≈ `indigo.900`/`lagoon.900`, Warm Ivory `#F7F3EA` ≈ `stone.50`, Clove `#8B3A2B` ≈ `clove.500`, Brass `#C08A2E` ≈ `saffron.500`) and Fraunces + Work Sans pairing.

### Files Affected
- `tailwind.config.ts` — extend with type scale, radii, shadows, transitions, breakpoints verification, container sizes, extended palettes (neutral/ivory/stone already aligned)
- `app/globals.css` — add CSS variables for tokens, `.container-page` refinement, type scale utilities, focus ring consistency, reduced-motion
- `lib/tokens.ts` (new) — TypeScript mirror of Tailwind tokens for JS usage (JS animation, map theming, email templates)
- `components/ui/Button.tsx` (new) — single Button primitive (variants: primary/clove, secondary/lagoon, ghost, outline; sizes: sm/md/lg)
- `components/ui/Badge.tsx` (new) — category/status badges
- `components/ui/Input.tsx` (new) — Input + Textarea + Select with shared focus/invalid states
- `components/ui/Card.tsx` (new) — Card shell (image overflow, border, hover)
- `components/ui/SectionHeading.tsx` (new) — editorial kicker + title + description pattern used across all sections
- `docs/DESIGN_SYSTEM.md` (new) — human-readable spec (palette swatches, type scale table, spacing, radii, shadows)

### Components Affected
All future pages consume these primitives — no direct page break in Phase 1, but `Navbar`/`Footer`/`TourCard`/`BookingForm` will be migrated to them in Phase 2+.

### Database Changes
None.

### Dependencies
None (no new runtime deps; optional `clsx` + `tailwind-merge` via tiny `cn()` util if not already vendored — prefer hand-rolled `cn` to avoid dep bloat).

### UX Objective
Restraint + premium editorial hierarchy even before page redesign: whitespace, contrast, and subtle shadows/borders set the tone.

### Technical Objective
Zero hardcoded hex/border/shadow/font-size outside tokens; `prefers-reduced-motion` honored; CSS vars enable runtime theming without rebuild.

### Acceptance Criteria
- [ ] `tailwind.config.ts` ships extended `fontSize`, `borderRadius`, `boxShadow`, `transitionDuration` tied to tokens
- [ ] `globals.css` defines CSS vars and utilities; `container-page` responsive padding matches spec
- [ ] `lib/tokens.ts` exports typed tokens and `cn()` helper
- [ ] `Button`, `Badge`, `Input`, `Card`, `SectionHeading` render in isolation, pass keyboard + focus-visible audit
- [ ] No existing page visual regression (side-by-side screenshot Δ < intentional)
- [ ] `npm run build` + `tsc --noEmit` pass

### Testing Requirements
- Typecheck + build
- Manual visual check at 320/768/1280/1920
- Keyboard tab through Button/Input/Cards

### Risks
- Extending Tailwind too aggressively could drift from existing `stone/lagoon/clove/saffron/indigo` ratios — mitigate by mapping new vars onto existing values, not replacing.

---

## Phase 2 — Global Navigation and Shell

### Files Affected
- `components/Navbar.tsx` → full rewrite (transparent overlay pre-scroll → solid/blur post-scroll, scroll-compact, mobile full-screen overlay with focus trap, body-scroll lock, Escape-to-close, aria)
- `components/Footer.tsx` → redesign (brand statement, Experiences/Destinations/About/Journal/Gallery/FAQs/Contact columns, legal, CTA band `Ready to discover Zanzibar?`)
- `components/WhatsAppButton.tsx` → contextual variant (homepage `Chat with your guide`, tour `Ask about this tour`, booking `Need help?`)
- `app/layout.tsx` → add `Skip to content`, `metadata` OG/canonical scaffolding, fine-tune `body` bg
- `components/DoorMotifDivider.tsx` — keep, tighten usage guard (only home transition + footer + one editorial section via lint comment)

### UX / Technical Objectives
- Hero-transparent navbar that compresses on scroll; mobile menu feels premium, not dropdown.

### Acceptance Criteria
- [ ] Desktop: transparent over hero, becomes `bg-stone-50/95 backdrop-blur` after ~40px scroll with smooth transition
- [ ] Mobile: full-screen overlay, focus trap, Escape + backdrop click close, `aria-expanded`/`aria-label`, body scroll lock
- [ ] Footer has all required link groups + CTAs, passes a11y landmarker
- [ ] WhatsApp FAB contextual, doesn't duplicate booking CTA on tour pages

### Testing
- Keyboard nav, screen reader labels, scroll behavior, responsive at 320/375/768/1024

### Risks
- Scroll listener performance → use passive + rAF or `useSyncExternalStore` + `IntersectionObserver` for hero sentinel.

---

## Phase 3 — Homepage

### Files Affected
- `app/page.tsx` → major restructure into 13-section editorial flow: hero (cinematic), discovery bar, why-local, signature experiences, destination exploration, interactive map, featured tour, meet guide, guest stories, journal teaser, travel-with-confidence, final CTA, footer
- `components/Hero.tsx` (new) + `components/DiscoveryBar.tsx` (new) + `components/WhyLocal.tsx` (new)
- `lib/constants.ts` — add optional `heroVideo`/`poster` slots
- `public/photos/` — document expected `hero-*.jpg` + poster

### Acceptance
- Story arc DISCOVER→DESIRE→TRUST→EXPLORE→BOOK legible in 10s; hero CTA + discovery bar stacked correctly on mobile; trust signals factual (no fabricated ratings).

### Risks
- Hero video weight → gated behind `prefers-reduced-motion` and viewport intersection, mobile falls back to image, encoded ≤2MB.

---

## Phase 4 — Tour Discovery

### Files Affected
- `app/tours/page.tsx` → add search (debounced) + category/duration/price/difficulty/group-size filters + sorting
- `components/TourCard.tsx` → premium redesign (badge, favorite, rating if present, metadata row, `From $35 / person`, hover subtle scale)
- `components/SearchInput.tsx`, `FilterPanel.tsx`, `EmptyState.tsx`, `Skeleton.tsx` (new)
- `lib/tours.ts` + `supabase/migrations/0002_...sql` — optional `rating`, `review_count` columns (nullable, no fake seeding)

### Acceptance
- Search hits title/category/summary/description/location; filters only render when data has that dimension; empty + loading + no-results states designed.

---

## Phase 5 — Tour Detail Experience

### Files Affected
- `app/tours/[slug]/page.tsx` → full 20-section structure (breadcrumb, gallery, quick facts, highlights, itinerary timeline, included/excluded, what-to-bring, meeting+map, booking card, cancellation, FAQ, reviews, related)
- `components/ImageGallery.tsx` + `Lightbox.tsx` (new)
- `components/BookingCard.tsx`, `StickyBookingBar.tsx` (new, mobile)
- `lib/tours.ts` — extend `Tour` with `highlights`, `itinerary`, `whatToBring`, etc. (all nullable)

### Acceptance
- Desktop: large primary + supporting images; mobile swipeable + lightbox keyboard nav; structured data `TouristAttraction`/`Service` emitted truthfully.

---

## Phase 6 — Booking Experience

### Files Affected
- `components/BookingForm.tsx` → multi-step flow (Date → Travelers → Customer info → Review → Confirmation) via `react-hook-form` + `zod` (already has `validations.ts`)
- `app/booking/confirmed/page.tsx` — enrich with booking reference `ZKT-XXXXX`, next-steps, contact actions
- `lib/validations.ts` — tighten email/phone/date/partySize rules + messages

### Acceptance
- Price transparency (total/deposit/remaining), no fake availability, validation messages, success state with WhatsApp/email/return actions, sticky mobile CTA not covering content.

---

## Phase 7 — About / Guide Experience

### Files Affected
- `app/about/page.tsx` → editorial portrait hero, credentials, languages, story (first-person slot), `Why book with me` 01-05, favorite places, CTA

### Acceptance
- Feels human, no invented biography — uses `constants.ts` + future `guide` table/JSON slot; photography slot documented.

---

## Phase 8 — Gallery

### Files Affected
- `app/gallery/page.tsx` → masonry, category filtering (Stone Town/Ocean/Culture/Food/Nature/People/Experiences), lightbox, meaningful alt

### Acceptance
- Categories only for present content, fullscreen lightbox keyboard nav, no empty alt for meaningful shots.

---

## Phase 9 — Zanzibar Destination Discovery

### Files Affected
- `components/TourMap.tsx` / `ExploreMap.tsx` → markers per real tour destinations only (no fabricated coords), click → image/desc/experience count/CTA
- Optional `app/zanzibar/[slug]/page.tsx` (only if clean) → destination story/photos/experiences/map/journal hooks

### Acceptance
- Markers derived from published tours' `lat/lng`; map accessible fallback list view.

---

## Phase 10 — Journal / Content

### Files Affected
- `app/journal/page.tsx` + `app/journal/[slug]/page.tsx` (new) → article scaffolding (title/excerpt/cover/author/date/category/readingTime/SEO); no fake articles seeded, structure only
- `supabase/migrations/000N_journal.sql` if DB-backed, otherwise `content/journal/*.md` pattern

### Acceptance
- SEO routes, metadata, structured `Article` schema when populated.

---

## Phase 11 — Reviews and Trust

### Files Affected
- `components/ReviewCard.tsx`, data source `lib/reviews.ts` or `reviews` table
- Homepage + tour detail reviews sections → verified indicator only when genuinely verified, external links (Google/TripAdvisor) only when configured

### Acceptance
- No fabricated testimonials; moves hardcoded `testimonials` array to data layer.

---

## Phase 12 — Admin / CMS Improvements

### Files Affected
- `app/admin/(dashboard)/tours/page.tsx`, `components/admin/TourForm.tsx`, `app/admin/(dashboard)/bookings/page.tsx`
- Pot’l new: image upload to Supabase Storage (`tour-images` bucket), gallery/highlights/itinerary editors

### Acceptance
- Admin can manage publish/feature, gallery, itinerary, inclusions, FAQs, without code; booking pipeline NEW→CONTACTED→CONFIRMED→COMPLETED (+CANCELLED) visually clear.

---

## Phase 13 — SEO

### Files Affected
- `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `next.config.mjs` metadata, per-route structured data components
- Image `alt`, semantic headings, breadcrumbs (`BreadcrumbList`), `LocalBusiness`/`TouristAttraction`/`FAQPage`/`Article` JSON-LD (truthful only)

### Acceptance
- Lighthouse SEO 95+, sitemap/robots/canonical/OG valid, no keyword-stuffed alts.

---

## Phase 14 — Accessibility (WCAG 2.2 AA)

### Files Affected
- All interactive components: keyboard, focus, dialogs, mobile menu trap, forms/labels/errors, alt, reduced-motion

### Acceptance
- axe audit 0 critical, tab order logical, contrast ≥ 4.5:1 for body text, dialogs announced correctly.

---

## Phase 15 — Performance

### Files Affected
- `next.config.mjs` image remote patterns + local `public/photos` priority controls, font `display: swap`, dynamic imports for Leaflet/Lightbox, `loading.tsx` skeletons, query tuning (select only needed columns, indexes)

### Acceptance
- LCP ≤ 2.5s, CLS 0, JS bundle not regressed; hero `priority` only; gallery lazy.

---

## Phase 16 — Mobile Optimization

### Files Affected
- All pages: hero, navbar, booking, cards, gallery, map, sticky CTA (safe-area insets, not covering browser chrome)

### Acceptance
- 320/375/390/414/768 layouts verified no overflow; tap targets ≥ 44px; map accessible without pinch-trap.

---

## Phase 17 — Testing

### Tools
- `npm run build` + `tsc --noEmit` + `npm run lint`
- Playwright or manual checklist per phase (no test runner currently — add `vitest` + `playwright` only if complexity justifies, otherwise scripted `npm run build` gate)

### Acceptance
- All existing features (auth, bookings, admin, payments, WhatsApp, maps, tour CRUD) still pass.

---

## Phase 18 — Final Polish & Visual QA

### Files Affected
- Global sweep: hierarchy, CTA visibility, photography, spacing, animation subtlety

### Checklist
- [ ] Premium Zanzibar identity, not generic template
- [ ] Visual hierarchy immediate, tour understood in 10s, bookable without confusion
- [ ] No fake claims, no production placeholder photography without label
- [ ] At 320/375/390/414/768/1024/1280/1440/1920: no overflow, broken images, shifts, focus loss

---

## Cross-Cutting Rules

1. **Inspect before modifying** — done in Phase 0.
2. **Work phase-by-phase**, re-running `npm run lint` / `typecheck` / `build` after each.
3. **Do not fabricate** reviews, ratings, traveler counts, destinations, availability.
4. **Image architecture:** `photos/*` prefix → `/public/photos/*` (documented in `PLACEHOLDER-IMAGES.md` + admin hint). No Picsum in production pages after media delivered.
5. **Design restraint:** No excessive glassmorphism/gradients/rounded-3xl/animations. Match Apple/Stripe/Linear restraint with Zanzibar warmth.
6. **Reuse > duplication** — search codebase before creating any component.

---

## Implementation Order (summarized)

0 Audit → 1 Tokens → 2 Shell → 3 Home → 4 Discovery → 5 Detail → 6 Booking → 7 About → 8 Gallery → 9 Map/Destinations → 10 Journal/FAQ/Reviews → 11 Admin → 12 SEO → 13 A11y → 14 Performance → 15 Mobile QA → 16 Testing → 17 Final Polish

After every phase: typecheck + lint + build + screenshot diff + update this plan's status.

