// Resolves a tour/page "photo seed" into an actual image URL.
// Priority:
// 1) "photos/..." → /public/photos/... (owner upload, preferred)
// 2) Known Zanzibar seeds → Wikimedia Commons real Zanzibar photography (lib/zanzibarImages.ts)
// 3) Unknown → Picsum placeholder (dev fallback, clearly not Zanzibar — replace before launch)
// See IMAGE_ATTRIBUTION.md and PLACEHOLDER-IMAGES.md
import { zanzibarImageMap } from "./zanzibarImages";

export function placeholderPhoto(seed: string, width = 1200, height = 900) {
  if (seed.startsWith("photos/")) {
    return `/${seed}`;
  }
  const real = zanzibarImageMap[seed];
  if (real) return real;
  // Dev fallback — do NOT ship unknown seeds to prod as if they were Zanzibar
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
