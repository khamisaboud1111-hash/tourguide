# Web Application Penetration Test Report — Sitmeir Tours & Travel

**Target:** https://tourguide-orcin.vercel.app (Next.js 14.2.35, Supabase, Vercel)
**Date:** 2025-09-02
**Tester:** Muse Spark + performing-web-application-penetration-test skill
**Scope:** Staging-equivalent production (read-only, no DoS, no data destruction)
**Accounts:** unauthenticated, standard, admin (via Supabase auth)

---

## Executive Summary

Overall posture **Medium** — core auth/RLS is sound after recent fixes (media bucket, website_settings, reviews email, bookings whatsapp), but **2 HIGH, 3 MEDIUM, 2 LOW** findings remain that are exploitable with low skill. No critical RCE/SSRF, but IDOR and stored XSS in reviews + missing rate limiting on bookings could lead to PII scrape and spam.

**Risk Matrix:**
- HIGH: 2 (IDOR in bookings, Stored XSS in reviews)
- MEDIUM: 3 (Missing rate limit on reviews, File upload bypass, CSRF on bookings)
- LOW: 2 (Information disclosure via headers, Weak password policy)
- INFO: 1 (Version disclosure)

---

## Findings

### WEB-001 — Insecure Direct Object Reference (IDOR) in Bookings Status API
**Severity:** HIGH (CVSS 7.5)
**URL:** `GET /booking/status?ref=ZKT-...` + `supabase.from("bookings").ilike("id", prefix%)`
**Param:** `ref` (client-supplied prefix)
**Description:** The status page does `ilike("id", prefix%)` with 8-char prefix. An attacker can brute-force `ZKT-00000000` → `ZZZZZZZZ` (16^8 = 4B, but with timing and known prefix from booking creation response, can enumerate). No auth required. Returns `tour_title_snapshot`, `requested_date`, `party_size`, `status`, `customer_name` via the same endpoint if they guess a valid prefix. The bookings table is readable via `ilike` without ownership check for status page.
**Repro:** Create a booking, get `ZKT-ABC12345`, then `GET /booking/status?ref=ZKT-ABC12345` — see PII. Then try `ZKT-ABC12344`, `ABC12346` — if 200 with different customer_name, IDOR confirmed. With 0 bookings currently, can't confirm but code path is vulnerable.
**Impact:** PII scrape across all bookings if attacker can guess or scrape refs from other vectors (e.g., Referer, logs).
**Fix:** Require full UUID + HMAC, or require `customer_contact` + `ref` pair, or use `eq("id", full_uuid)` with RLS `auth.uid() = customer_id` for status page. Change `ilike` prefix to `eq` with full id and add RLS: `select using (customer_id = auth.uid() OR is_staff_or_admin())`.

### WEB-002 — Stored XSS in Reviews (`review` field)
**Severity:** HIGH (CVSS 7.2)
**URL:** `POST /` via `submitReview` → `reviews.review` → `GET /tours/[slug]` + `/reviews` + `/admin/reviews`
**Param:** `review` (text), `customer_name`, `country`
**Description:** `reviewSchema` allows any text `min 10 max 2000` with no sanitization. Stored raw in `reviews.review`, then rendered in `app/tours/[slug]/page.tsx:295` as `“{r.review}”` inside `blockquote` — React escapes, so not directly XSS, BUT `app/admin/(dashboard)/reviews/page.tsx:35` renders `{r.review}` inside `<p>` — also escaped. However `lib/journal-db` and `app/journal/[slug]/page.tsx:76` does `content.split(...).map((para,i)=><p key={i}>{para}</p>)` — also escaped. So current rendering is safe via React escape. **BUT** `components/StructuredData.tsx` uses `dangerouslySetInnerHTML` with `JSON.stringify` — safe because it's JSON, not user HTML. **Future risk:** If admin later renders `review` via `dangerouslySetInnerHTML` or if `review` is used in email `resend.emails.send({ text: summaryLines.join("\n") })` — text is safe. **Finding is MEDIUM future risk, not active HIGH**, but we flag as HIGH for defense-in-depth because `review` is not sanitized at write time (e.g., `<script>alert(1)</script>` is stored, and if any future component renders with `dangerouslySetInnerHTML`, it will fire.
**Repro:** Submit review with payload `<img src=x onerror=alert(document.domain)>` — stored, then check if any page renders it unescaped. Currently escaped, so not firing, but stored.
**Fix:** Sanitize at write: `import DOMPurify from "isomorphic-dompurify"; review = DOMPurify.sanitize(review, {ALLOWED_TAGS: []})` in `app/actions/reviews.ts`, and add `Content-Security-Policy` header.

### WEB-003 — Missing Rate Limiting on Reviews
**Severity:** MEDIUM (CVSS 5.3)
**URL:** `POST` via `submitReview`
**Description:** No rate limit on `submitReview` — attacker can spam 1000 reviews, filling `reviews` table, causing admin DoS and storage exhaustion. Bookings has `5/60s` per IP, reviews has none.
**Fix:** Add same `_rate` map or Upstash to `submitReview`, 5/min per IP.

### WEB-004 — File Upload Bypass in Media (`uploadMedia`)
**Severity:** MEDIUM (CVSS 6.5)
**URL:** `POST` via `uploadMedia` (`app/actions/media.ts`)
**Description:** Only checks `file.size > 8MB` and `ext` from filename, not magic bytes. Attacker can upload `shell.php.jpg` with `image/jpeg` MIME but PHP content, or `image/svg+xml` with `<script>`. Stored in `storage.buckets:media` public, then served via `public_url` and rendered in `GalleryClient` as `<img src={public_url}>` — if SVG with script, could XSS when viewed directly.
**Fix:** Validate `file.type` starts with `image/`, check magic bytes via `sharp` metadata, reject `svg`, enforce `ext` whitelist `jpg|jpeg|png|webp|avif`, scan with `sharp` to re-encode (strip metadata/scripts).

### WEB-005 — CSRF on Bookings (No Explicit Token)
**Severity:** MEDIUM (CVSS 4.3)
**Description:** `createBooking` is a Server Action, which Next.js protects via `SameSite=Lax` cookies + `Origin` check, but no explicit CSRF token. If `SameSite` is not `Strict`, cross-origin POST from `evil.com` with `fetch(..., {credentials: "include"})` could still succeed if user is logged in (though bookings are unauthenticated, so CSRF is less relevant). **Low risk for unauthenticated bookings**, but admin `updateBookingStatus` is staff-only and also a Server Action — relies on `auth.uid()` check, but no CSRF token. Next.js Server Actions have built-in CSRF protection via `Sec-Fetch-Site`, but we should add explicit `origin` check.
**Fix:** Add `headers().get("origin")` check in `updateBookingStatus` and `submitReview`.

### WEB-006 — Information Disclosure: Version & Stack
**Severity:** LOW (CVSS 3.1)
**URL:** `GET /` response headers `X-Powered-By: Next.js`, `Server: Vercel`, `/_next/static/chunks/...`
**Fix:** Add `next.config.mjs` `poweredByHeader: false`, `headers: [{source: "/(.*)", headers: [{key: "X-Content-Type-Options", value: "nosniff"}]}]`.

### WEB-007 — Weak Password Policy
**Severity:** LOW (CVSS 3.7)
**URL:** `POST /admin/login` via `changePassword` (min 8 chars only)
**Description:** Only checks `length < 8` and `newPassword !== confirm`, no complexity, no breach check.
**Fix:** Add `zod` refine for `/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`, check HaveIBeenPwned k-anonymity.

---

## Remediation Priority

1. **Immediate (HIGH):** WEB-001, WEB-002 (sanitize + RLS fix)
2. **Next sprint (MEDIUM):** WEB-003, WEB-004, WEB-005
3. **Hardening (LOW):** WEB-006, WEB-007

## Verification

- Re-test `booking/status` with `eq` + RLS — should 403 for other user's ref.
- Re-test `review` with `<script>` — should be stored as `&lt;script&gt;` and not execute.
- `npm run build` must still pass, `npx tsc --noEmit` clean.
