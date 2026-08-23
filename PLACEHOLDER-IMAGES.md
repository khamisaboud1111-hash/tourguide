# Placeholder images

Every photo on this site right now comes from picsum.photos — a free
placeholder-image service. Nothing is a real photo of Zanzibar yet.
The site looks and works correctly, but it isn't ready to show tourists
until these are swapped for real ones.

## Why placeholders, and not real stock photos

Stock/web photos usually need a paid license to use commercially, and
random images pulled from the internet may not be free to use on a
business site. Placeholders avoid that risk entirely, but the real fix
is uploading real photos of these tours — which will also just look
and convert better than any stock photo could.

## How to swap them in (no local dev environment needed)

1. Get your photos onto your computer (from a phone, camera, etc.).
2. In your GitHub repo, open the `public/photos/` folder → **Add
   file → Upload files** → drag your images in (e.g.
   `stonetown-real-1.jpg`) → commit to `main`. Vercel redeploys
   automatically.
3. **For a tour photo:** go to `/admin/tours`, edit the tour, and set
   the "Photo" field to `photos/stonetown-real-1.jpg` — it switches
   from the placeholder to your real photo immediately, no code
   editing needed.
4. **For the hero, guide portraits, or gallery:** these aren't in the
   admin panel yet, so edit the line directly in GitHub's web editor.
   For example, this in `app/page.tsx`:

   ```ts
   src={placeholderPhoto("hero-dhow-sunset", 1600, 1000)}
   ```

   becomes:

   ```ts
   src={placeholderPhoto("photos/hero-dhow-sunset.jpg", 1600, 1000)}
   ```

## Where each placeholder is used

| What | Where to change it |
|---|---|
| Any tour's photo | `/admin/tours` → edit the tour → "Photo" field |
| Homepage hero | `hero-dhow-sunset` in `app/page.tsx` |
| Homepage "about" teaser | `guide-portrait` in `app/page.tsx` |
| About page portrait | `guide-portrait-2` in `app/about/page.tsx` |
| Gallery grid | the `gallery-*` seeds in `app/gallery/page.tsx` |

Priority order if you can only get a few photos shot first: the hero
photo, a guide portrait, and one strong photo per tour — that alone
covers every page.
