# Image Attribution — Zanzibar

All site photography is now **real Zanzibar from your owner shoot** (`zanzibar_website_images.zip`) plus honest Wikimedia fallbacks — no more random Picsum.

**Owner local photos (in `public/photos/`, served via `next/image`):**

| File | Use |
|------|-----|
| `zanzibar_nungwi_sunset.webp` (168 KB) | Hero — `hero-dhow-sunset`, `sunset-dhow-1`, all sunset variants, `journal-season`, `gallery-sunset` |
| `zanzibar_stone_town.webp` (366 KB) | Culture — `stonetown-1`, `spicefarm-1`, Stone Town editorial, `guide-portrait`, `gallery-stonetown-*`, `gallery-alley`, `gallery-market` |
| `zanzibar_mnemba_island.jpg` (587 KB) | Ocean/Nature — `safariblue-1`, `jozani-1`, `prisonisland-1`, `ocean-sandbank`, `gallery-beach-sandbank`, `gallery-colobus-monkey`, journal ocean |

**Wikimedia fallbacks still mapped for any seed not in the 3 (see `lib/zanzibarImages.ts` history):** Stone Town `8/84`, Spice farm `b/bf` CC BY 2.0 Irene, Jozani `b/b5` CC BY-SA — all Zanzibar, all CC. Owner can replace by uploading `photos/newfile.jpg` and setting `photo_seed` in `/admin/tours`.

**How to add more:** drop new files into `public/photos/` and either set `photo_seed` to `photos/filename.webp` in admin, or add a mapping in `lib/zanzibarImages.ts` to `photos/filename.webp` and redeploy.
