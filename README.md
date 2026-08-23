# Zanzibar Karibu Tours — website (Phase 1 + 2)

A Next.js site for a Zanzibar tour guide business: public pages
(home, tours, gallery, about, contact) plus a Supabase-backed admin
dashboard so the guide can manage tours and bookings without touching
code. Booking requests save to a database and notify by email;
WhatsApp remains available everywhere as the zero-setup fallback.
Online deposit payment via Flutterwave is wired in and simply stays
hidden until you add the keys for it.

## 1. Get this into GitHub (no local setup needed)

1. Create a new, empty repository on GitHub — **do not** initialize it
   with a README/gitignore.
2. On the repo page: **Add file → Upload files**.
3. Unzip the downloaded project on your computer, then drag the
   *contents* of the folder (not the folder itself) into the upload
   box — this keeps `app/`, `components/`, etc. at the repo root.
4. Commit directly to `main`.

## 2. Create a free Supabase project

1. [supabase.com](https://supabase.com) → New project. Pick any name
   and a strong database password (save it somewhere).
2. Once it's ready, open **SQL Editor → New query**, paste in the
   entire contents of `supabase/migrations/0001_init.sql` from this
   project, and run it. This creates the tables, the security rules,
   and seeds your 6 example tours.
3. Go to **Authentication → Users → Add user** and create the one
   login your friend will use to manage the site (his real email +
   a password he chooses). This is the only account that can ever
   sign in to `/admin` — there's no public sign-up.
4. Go to **Project Settings → API** and copy two values, you'll need
   them in the next step:
   - Project URL
   - `anon` `public` key
   - (also copy the `service_role` key — keep this one extra private)

## 3. Connect it to Vercel

1. In Vercel: **Add New → Project** → import the GitHub repo.
2. Before deploying, open **Environment Variables** and add the ones
   listed in `.env.example` in this project — at minimum:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SITE_URL` (your
   Vercel URL, e.g. `https://your-project.vercel.app`).
3. Deploy. Every future push to `main` redeploys automatically.
4. Visit `/admin` on your live site and sign in with the account from
   step 2.3 — this is your friend's self-serve dashboard from now on.

## 4. Optional: turn on online deposit payments

Skip this section entirely and the site works fine without it — the
booking form and WhatsApp still both work, just without a "pay
online" button.

1. Create a Flutterwave account, then **Settings → API** for your
   `Secret key`.
2. **Settings → Webhooks**: set the URL to
   `https://your-domain.com/api/webhooks/flutterwave`, and set a
   "Secret hash" — any long random string you make up.
3. In Vercel, add `FLUTTERWAVE_SECRET_KEY` and
   `FLUTTERWAVE_WEBHOOK_SECRET_HASH` (the same string from step 2)
   as environment variables, then redeploy.
4. A "Pay deposit online" button (20% of the tour price by default —
   change `depositPercent` in `lib/constants.ts`) now appears after
   someone submits a booking request.

## 5. Optional: turn on booking-notification emails

Also skip-able — without it, bookings still save and show up in
`/admin/bookings`, they just won't trigger an email.

1. Create a free Resend account, verify a sending domain (or use
   their shared test domain to start).
2. In Vercel, add `RESEND_API_KEY` and `RESEND_FROM_EMAIL`, then
   redeploy.

## What to edit first

1. **`lib/constants.ts`** — business name, guide name, WhatsApp
   number, email, location, deposit percentage.
2. **Tours** — edit directly in `/admin/tours` once deployed, rather
   than in code.
3. **`PLACEHOLDER-IMAGES.md`** — how to swap in real photos.
4. **`app/about/page.tsx`** — replace the placeholder bio paragraphs
   with the guide's real story.

## How the booking flow works

A visitor can either message on WhatsApp directly, or fill in the
booking form on a tour page. The form always saves to the database
and shows up in `/admin/bookings` regardless of payment — Flutterwave
is an optional "pay a deposit now" step offered *after* that request
is already saved, never a requirement to submit one.
