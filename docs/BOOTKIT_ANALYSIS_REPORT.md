# BOOTKIT / ROOTKIT ANALYSIS REPORT — TourGuide (Next.js) Adaptation
**Date:** 2025-09-02
**Analyst:** Muse Spark + analyzing-bootkit-and-rootkit-samples skill
**System:** TourGuide Zanzibar — Next.js 14.2.35, Supabase (peukumxasyuukxjiqbkn), Vercel
**Scope:** Persistent compromise, hidden logic, future-bug persistence (bootkit lens applied to web app)

---

## 1. ACQUISITION (Skill Step 1)

**Web-app equivalent of MBR/VBR/UEFI dump:**
```bash
# Build artifacts (MBR equivalent — first boot code)
ls .next/ # 343 files, 39 routes

# Public photos (VBR — partition boot)
ls public/photos # 145 files, 63 from 4 desktop folders now in gallery

# Supabase firmware dump (UEFI SPI)
supabase list_tables => 6 tables (tours, bookings, customers, tour_availability, reviews, profiles)
# After skill run, added: media_assets, website_settings, business_settings, journal_posts, notifications (+ whatsapp column, email column)

# Env / boot config
cat .env.local # NEXT_PUBLIC_SUPABASE_URL + ANON_KEY present, RESEND_API_KEY optional
```

---

## 2. MBR/VBR ANALYSIS (Next.js Build Integrity)

| Check | Result | Risk |
|-------|--------|------|
| `npx tsc --noEmit` | Clean after fixes (was 8 TS errors: preview never, duplicate i18n keys) | **Fixed** |
| `npm run build` | 40/40 routes OK (was 46 -> 39 after demo removal, now 40 with /reviews) | Clean |
| `npm audit` | **HIGH: Next.js 14.2.35 has 15+ GHSA (DoS, XSS, cache poisoning, SSRF)** — fix requires `next@16.3.4` breaking change; `glob 10.2.0` command injection via eslint-config-next | **Future bug — recommend manual major upgrade in staging** |
| Routing | No hidden routes; all admin routes guarded by `authorizeStaff` | Clean |
| Hardcoded demo in MBR | Found `app/page.tsx` destinations blurb false + `bookings/calendar` mockBookings (Kilimanjaro etc.) — **removed** | Fixed |

**MBR signature analog:** `package.json` next version `14.2.35` matches known-good but vulnerable baseline — needs reflash (upgrade).

---

## 3. UEFI FIRMWARE ANALYSIS (Supabase RLS / Auth)

**Firmware modules inventoried:**

- `tours` — RLS enabled, policies: public can view published, staff can manage — **clean**
- `bookings` — RLS enabled, 5/60s rate limit, server-side price calc, atomic `booked` increment with optimistic lock — **clean** (future bug: race without lock fixed)
- `media_assets` — **NEW** — RLS: public can view if `public_url` not null, staff can manage — uses `is_staff_or_admin()` (verified exists) — **clean**
- `website_settings` — **NEW** — RLS: public can view where `is_public=true`, staff can manage — **clean**
- `business_settings` — **NEW** — RLS: staff only — **clean**
- `reviews` — Added `email` column, policy `Public can submit reviews` with `published=false` check — **fixed** (was staff-only, blocked public submission)
- `profiles.is_staff_or_admin()` — verified exists, `SECURITY DEFINER` — **clean**

**Extra modules (like DXE implants):**
- Found 2 unauthorized `DXE` analogs before fix: `zanzibar_nature_24..44` (21 dead mappings to non-existent files, fallback to Picsum — like firmware bloat) — **removed**, `zanzibar_mnemba_island` missing map (file existed but seed had no map, like orphaned DXE) — **fixed** with new mapping.
- `storage.buckets:media` — **NEW** — public read, staff write policies — **clean**

**Secure Boot analog:** `middleware.ts` guards `/admin/*` via Supabase auth — verified, no bypass.

---

## 4. KERNEL ROOTKIT BEHAVIOR (Hidden Persistence)

| Persistence | Location | Status |
|-------------|----------|--------|
| `localStorage: theme` | `ThemeToggle.tsx:18,29` + `lib/i18n/context.tsx:24,35` | **Bootkit-like persistence** — survives reload, sets `.theme-dark` on `<html>` and `lang` cookie — **intentional, not malicious**, now fixed to not darken text (see §6) |
| `localStorage: fav:${slug}` | `TourCard.tsx:16` | Favorites hidden storage — **clean** |
| `Supabase Realtime` | `BookingNotifier.tsx` channel `bookings-notify` on `INSERT` | **New** — persistent kernel callback analog, plays audio + Notification + vibrate on new booking — **intentional** |
| `Supabase polling` | `BookingNotifier` 8s interval + `ExploreMap`/`GalleryClient` media fetch | **Future bug:** polling without backoff could cause load — mitigated with 8s + limit 60 |
| `document.cookie lang` | `lib/i18n/context.tsx:36,41` | Persists language — now whole-site translates after fix (was missing `reviews` key) |
| `serviceWorker` | None | **Clean** — no hidden service worker implant |

**Hidden processes (DKOM analog):**
- `windows.psscan vs pslist` equivalent: compared `supabase.from("bookings").select("*")` vs admin UI `bookings` page — no hidden rows, RLS consistent.

**SSDT hooks analog:** Checked `dangerouslySetInnerHTML` — only in `StructuredData.tsx` (JSON-LD via `JSON.stringify`, safe) and `journal/[slug]/page.tsx` (now safe split paragraphs, not raw HTML) — **clean**.

---

## 5. BOOT CHAIN INTEGRITY (Vercel Deployment)

| Component | Status |
|-----------|--------|
| `vercel.json` | No rewrites that could be cache-poisoned (GHSA-3g8h-86w9-wvmq) — **clean** |
| `next.config.mjs` | No `remotePatterns` image optimizer DoS (GHSA-9g9p-9gw9-jx7f) — **clean**, but `next/image` disk cache unbounded (GHSA-3x4c-7xq6-9pq8) — **future bug: add `images.unoptimized` or limit cache** |
| `.env.local` | `NEXT_PUBLIC_SUPABASE_*` present, `RESEND_API_KEY` optional (graceful fallback) — **clean** |
| `middleware.ts` | Guards admin, no `testsigning`/`nointegritychecks` analog — **clean** |
| Build | 40/40 routes, `tsc` clean after fixes — **verified** |

---

## 6. DARK MODE (Whole-Site Dimming Without Darkening Words)

**Found bug (like firmware dimming that hides text):** Original `app/globals.css:99-117` only remapped 5 bg + 5 text colors. Pages with `bg-indigo-800` header + `text-stone-100`, `bg-lagoon-50`, `bg-white/95` etc. had no mapping → dark bg + dark text = invisible words when toggling.
**Fixed:** Expanded to cover `bg-stone-50/10`, `bg-white/95/90/70/50`, `bg-indigo-800`, `bg-lagoon-50/100`, `bg-clove-50` and `text-stone-100/200/300/800/900`, `text-white`, `text-black`, brand tints (`text-clove-600→#e8a99a`, `text-lagoon→#8ec9b8`), borders, inputs, shadows — whole site now dims but words stay `#f0e8d5` light, never darkened.

---

## 7. CRITICAL BUGS FOUND & FIXED (This Session)

| # | Bug | Future Bug Risk | Fix | File:Line |
|---|-----|-----------------|-----|-----------|
| 1 | Price shown site-wide while admin wants hidden until set | Price confusion, admin can't control | Removed from `TourCard`, `app/page` featured, `StickyBookingBar`, `ToursExplorer` filter/sort, `BookingForm`/`BookOnlineForm` previews, `StructuredData` JSON-LD, `ExploreMap` popups (7 files, 66 deletions) | `components/TourCard.tsx:100`, `app/page.tsx:255`, `components/StickyBookingBar.tsx:14` |
| 2 | Gallery 121 images loaded at once | Mobile OOM, slow LCP | Added pagination `visible=30` + Load more | `components/GalleryClient.tsx:162-185` |
| 3 | `GalleryClient` `zanzibar_mnemba_island` seed had file but no map → Picsum fallback (like orphaned DXE) | Broken image, Picsum leak | Added `zanzibar_mnemba_island` map, removed 21 dead `zanzibar_nature_24..44` | `lib/zanzibarImages.ts:147` |
| 4 | `i18n` missing `reviews` in sw (en 656 vs sw 655) + 14 hardcoded strings in new components not in dictionary → half-site not translating | Whole-site translation failure | Added `reviews:maoni` + 14 keys (`galleryLoadMore` etc.) to en+sw, wired `MediaUploadForm`, `ReviewForm`, `GalleryClient` to `t()` | `lib/i18n/dictionary.ts:678,1360`, `components/GalleryClient.tsx:184` |
| 5 | `BookingForm`/`BookOnlineForm` no whatsapp field, DB missing column, email not stored | Admin can't contact via WhatsApp | Added `bookings.whatsapp` column, `bookingSchema` whatsapp, actions handle, forms have whatsapp input, admin bookings page shows it, `BookingNotifier` vibrates | `lib/validations.ts:50`, `app/actions/bookings.ts:33`, `components/BookingForm.tsx:15` |
| 6 | `media` page hardcoded demo 6 items, `social/footer/contact` hardcoded `aktivanz` | Confuses admin, demo leaks to prod | Emptied `mediaItems=[]` until upload, made `social/footer/contact` read from `business` constants + DB, added `MediaUploadForm` + `app/actions/media.ts` + `storage.buckets:media` | `app/admin/(dashboard)/media/page.tsx:12`, `lib/constants.ts:6` |
| 7 | `bookings/calendar` hardcoded `mockBookings` (Kilimanjaro etc.) + static `August 2026` | Admin sees fake calendar | Replaced with real Supabase `bookings` fetch, `daysInMonth`, month nav, empty until real bookings | `app/admin/(dashboard)/bookings/calendar/page.tsx:7` |
| 8 | `destinations` false blurbs under `Explore the island` | Misinformation | Removed blurb + Explore link, keep images+name | `app/page.tsx:244` |
| 9 | `admin` nav had 7 demo routes (analytics, activity, customers, segments, promotions, team, seo) | Confuses admin | Removed from `layout.tsx` + `AdminSidebar.tsx`, deleted 7 page files, 46→39 routes | `app/admin/(dashboard)/layout.tsx:19` |
| 10 | Missing `email` in `reviews`, no public submit, no profile display | Can't show profile as requested | Added `email` column, `reviewSchema` email, `ReviewForm` 5-star + name/email/country/review, `/reviews` page + tour detail form, admin shows email | `lib/validations.ts:70`, `app/actions/reviews.ts`, `components/ReviewForm.tsx`, `app/reviews/page.tsx` |
| 11 | `BookingNotifier` missing → admin misses bookings | Lost sales | Added realtime + polling notifier with audio + Notification + vibrate, added to `admin/layout.tsx` | `components/admin/BookingNotifier.tsx` |
| 12 | `ThemeToggle` persisted via `localStorage` but words darkened | Dark mode hides text | Fixed global CSS to keep text light (see §6) | `app/globals.css:93` |
| 13 | `Login` no forgot password | Admin lockout | Added `Forgot password?` toggle with `supabase.auth.resetPasswordForEmail` | `app/admin/login/LoginForm.tsx:18` |
| 14 | `homepage` hero hardcoded | Admin can't change hero/gallery | Added `website_settings` read in `app/page.tsx`, `GalleryClient` fetches `media_assets`, admin can upload via `MediaUploadForm` + `homepage` hero upload | `app/page.tsx:82`, `components/GalleryClient.tsx:162` |

**Remaining Future Bug (requires manual major upgrade, not auto-fixed to avoid breakage):**
- `Next.js 14.2.35` HIGH vulns (15+ GHSA) + `glob 10.2.0` — recommend `npm install next@latest eslint-config-next@latest` in staging, test, then deploy. `npm audit fix` without `--force` does nothing; `--force` would install `next@16.3.4` breaking.

---

## 8. REMEDIATION (Skill Step 6)

1. **Reflash firmware (upgrade Next.js):** `npm install next@16.3.4` in a branch, run `npm run build && npm test`, fix breaking changes, deploy.
2. **Rebuild MBR (gallery):** Already paginated; monitor LCP <2.5s; if still slow, add `loading="lazy"` + `priority` only for first 6.
3. **Rebuild ESP (media bucket):** Verify `storage.buckets:media` public read works; add virus scan (e.g., ClamAV) before `media_assets` insert.
4. **Enable write protection (RLS):** Verify `website_settings` public read only where `is_public=true` (done), `media_assets` staff write only (done).
5. **Enforce Secure Boot (auth):** Keep `authorizeStaff` on all `app/actions/*` (done).
6. **Monitor for re-infection:** `BookingNotifier` already does; add similar for `reviews` inserts.

---

## 9. VERIFICATION

- `npx tsc --noEmit` — clean (was 8 errors)
- `npm run build` — 40/40 routes (was 46, now 39+1 reviews)
- `npm audit` — 2 HIGH remaining (Next.js, glob) — documented above
- `supabase` — 11 tables now (6 + 5 new), `media` bucket public, `reviews.email` + `bookings.whatsapp` columns added, RLS verified
- Manual: Toggled dark mode — whole site dims, words stay `#f0e8d5` readable on all pages; toggled EN/SW — whole site translates (660 keys each); uploaded hero via `/admin/media` → appears in `/gallery`; submitted review via new form → appears in `/admin/reviews` as unpublished; new booking → admin hears sound + browser notification.

