// Resolves a tour/page "photo seed" into an actual image URL.
//
// - Most values (e.g. "stonetown-1") are treated as a picsum.photos seed
//   and generate a stable placeholder — same seed always returns the same
//   image, so it doesn't reshuffle on every reload.
// - A value starting with "photos/" (e.g. "photos/my-real-photo.jpg") is
//   treated as a real file you've uploaded to /public/photos and is used
//   directly — no code editing needed, just change the field.
//
// See PLACEHOLDER-IMAGES.md in the project root for the full guide.
export function placeholderPhoto(seed: string, width = 1200, height = 900) {
  if (seed.startsWith("photos/")) {
    return `/${seed}`;
  }
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
