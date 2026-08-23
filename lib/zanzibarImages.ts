// Real Zanzibar photography — local owner shots from zanzibar_website_images.zip take priority.
// Fallback Wikimedia remains for seeds not covered, but all primary seeds now point to /public/photos.

export const zanzibarImageMap: Record<string, string> = {
  // ── Hero & editorial — local Zanzibar photos ─────
  "hero-dhow-sunset": `photos/zanzibar_nungwi_sunset.webp`, // Nungwi sunset — dhow silhouette, real Zanzibar
  "hero-zanzibar": `photos/zanzibar_nungwi_sunset.webp`,
  "about-zanzibar-street": `photos/zanzibar_stone_town.webp`,
  "guide-portrait": `photos/zanzibar_stone_town.webp`,
  "guide-portrait-2": `photos/zanzibar_stone_town.webp`,

  // ── Tours (DB photo_seed values) — local ───────────
  "stonetown-1": `photos/zanzibar_stone_town.webp`,
  "spicefarm-1": `photos/zanzibar_stone_town.webp`, // Stone Town closest local; spice farm fallback — owner can upload spice-specific later
  "safariblue-1": `photos/zanzibar_mnemba_island.jpg`, // Mnemba Island — turquoise ocean, Safari Blue
  "jozani-1": `photos/zanzibar_mnemba_island.jpg`, // Mnemba nature fallback — owner can add Jozani monkeys later
  "sunset-dhow-1": `photos/zanzibar_nungwi_sunset.webp`,
  "prisonisland-1": `photos/zanzibar_mnemba_island.jpg`, // Mnemba island fallback for Changuu — owner can add tortoise shot
  // variants used by gallery detail (tourSeed + "-2" etc)
  "stonetown-1-2": `photos/zanzibar_stone_town.webp`,
  "stonetown-1-3": `photos/zanzibar_mnemba_island.jpg`,
  "stonetown-1-4": `photos/zanzibar_nungwi_sunset.webp`,
  "spicefarm-1-2": `photos/zanzibar_stone_town.webp`,
  "spicefarm-1-3": `photos/zanzibar_mnemba_island.jpg`,
  "spicefarm-1-4": `photos/zanzibar_nungwi_sunset.webp`,
  "safariblue-1-2": `photos/zanzibar_mnemba_island.jpg`,
  "safariblue-1-3": `photos/zanzibar_stone_town.webp`,
  "safariblue-1-4": `photos/zanzibar_nungwi_sunset.webp`,
  "jozani-1-2": `photos/zanzibar_mnemba_island.jpg`,
  "jozani-1-3": `photos/zanzibar_stone_town.webp`,
  "jozani-1-4": `photos/zanzibar_nungwi_sunset.webp`,
  "sunset-dhow-1-2": `photos/zanzibar_nungwi_sunset.webp`,
  "sunset-dhow-1-3": `photos/zanzibar_mnemba_island.jpg`,
  "sunset-dhow-1-4": `photos/zanzibar_stone_town.webp`,
  "prisonisland-1-2": `photos/zanzibar_mnemba_island.jpg`,
  "prisonisland-1-3": `photos/zanzibar_stone_town.webp`,
  "prisonisland-1-4": `photos/zanzibar_nungwi_sunset.webp`,

  // ── Homepage editorial ────────────────────────────
  "stonetown-alley": `photos/zanzibar_stone_town.webp`,
  "spice-tasting": `photos/zanzibar_stone_town.webp`,
  "ocean-sandbank": `photos/zanzibar_mnemba_island.jpg`,
  "stonetown-door": `photos/zanzibar_stone_town.webp`,
  "spice-farm": `photos/zanzibar_stone_town.webp`,
  "jozani-forest": `photos/zanzibar_mnemba_island.jpg`,
  "safariblue": `photos/zanzibar_mnemba_island.jpg`,

  // ── Gallery seeds ─────────────────────────────────
  "gallery-stonetown-door": `photos/zanzibar_stone_town.webp`,
  "gallery-spice-farm": `photos/zanzibar_stone_town.webp`,
  "gallery-dhow-sailing": `photos/zanzibar_mnemba_island.jpg`,
  "gallery-beach-sandbank": `photos/zanzibar_mnemba_island.jpg`,
  "gallery-colobus-monkey": `photos/zanzibar_mnemba_island.jpg`,
  "gallery-sunset": `photos/zanzibar_nungwi_sunset.webp`,
  "gallery-market": `photos/zanzibar_stone_town.webp`,
  "gallery-reef-snorkel": `photos/zanzibar_mnemba_island.jpg`,
  "gallery-alley": `photos/zanzibar_stone_town.webp`,
  "gallery-spice-harvest": `photos/zanzibar_stone_town.webp`,
  "gallery-people": `photos/zanzibar_stone_town.webp`,
  "gallery-experience": `photos/zanzibar_mnemba_island.jpg`,

  // ── Journal ───────────────────────────────────────
  "journal-season": `photos/zanzibar_nungwi_sunset.webp`,
  "journal-pack": `photos/zanzibar_stone_town.webp`,
  "journal-stonetown": `photos/zanzibar_stone_town.webp`,
};

// Backwards: any unknown seed now transparently tries Zanzibar map before falling to Picsum
// so even admin-created tours with custom seeds get a sensible Zanzibar fallback if owner hasn't uploaded yet.
