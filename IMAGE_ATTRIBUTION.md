# Image Attribution — Zanzibar

All site photography is now **real Zanzibar**, not Picsum placeholders. Sources are Wikimedia Commons under CC BY / CC BY-SA, free for commercial use with attribution. The site hotlinks via `upload.wikimedia.org` so no local copy is needed; Vercel optimizes via `next/image`.

| Seed | File on Wikimedia Commons | Author / License | Direct URL |
|------|---------------------------|------------------|------------|
| `hero-dhow-sunset`, `stonetown-1`, `sunset-dhow-1` | `Stone Town of Zanzibar-108857.jpg` | CC BY-SA — Wikimedia Commons (Category:Stone Town) | `https://upload.wikimedia.org/wikipedia/commons/8/84/Stone_Town_of_Zanzibar-108857.jpg` |
| `spicefarm-1`, `spice-farm`, `gallery-spice-farm` | `Spice farm, Zanzibar.jpg` | Irene — CC BY 2.0 (Flickr → Commons `b/bf`) | `https://upload.wikimedia.org/wikipedia/commons/b/bf/Spice_farm%2C_Zanzibar.jpg` |
| `jozani-1`, `gallery-colobus-monkey`, `jozani-forest` | `Jozani forest, Zanzibar.jpg` | CC BY-SA — Category:Jozani Chwaka Bay National Park (`b/b5`) | `https://upload.wikimedia.org/wikipedia/commons/b/b5/Jozani_forest%2C_Zanzibar.jpg` |
| `stonetown-1-2`, `gallery-market` | `Forodhani Gardens (34023630713).jpg` | CC BY 2.0 — Stone Town waterfront (`f/f4`) | `https://upload.wikimedia.org/wikipedia/commons/f/f4/Forodhani_Gardens_%2834023630713%29.jpg` |
| `stonetown-alley`, `gallery-alley` | `Streets of Stone Town (34603004541).jpg` | CC BY 2.0 — Streets in Stone Town (`6/60`) | `https://upload.wikimedia.org/wikipedia/commons/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg` |
| `jozani-1-2` etc. | `Jozani Forest at ...`, `Mangrove Zanzibar.jpg`, `Parque nacional ... DD 31.jpg` | CC BY / CC BY-SA — Jozani category | see `lib/zanzibarImages.ts` |

**How to replace with owner photos:** upload to `public/photos/` and set the tour `photo_seed` to `photos/filename.jpg` in `/admin/tours` — `lib/placeholder.ts:10` prefers `photos/*` over the Wikimedia map, so no code change needed.

**Remaining todos (honest):** `safariblue-1` and `prisonisland-1` currently reuse Jozani/Stone Town as honest temporary Zanzibar fallbacks — the owner should replace them with a Menai Bay sandbank/dhow shot and a Changuu tortoise shot before public launch. Picsum is now only used for truly unknown seeds (dev fallback) and never for the six seeded tours.
