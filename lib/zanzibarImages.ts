// Real Zanzibar photography — owner AI pack (40 images) + original 3 local shots.
// Every seed now points to a real Zanzibar image in public/photos.
// Generated from zanzibar_website_images.zip (3) + openai pack (40) — all Zanzibar, all local.

export const zanzibarImageMap: Record<string, string> = {
  // ── Hero & editorial — owner local ──────────────────
  "hero-dhow-sunset": `photos/zanzibar_ai_06.jpg`, // sunset dhow — AI but Zanzibar-authentic
  "hero-zanzibar": `photos/zanzibar_ai_06.jpg`,
  "about-zanzibar-street": `photos/zanzibar_ai_01.jpg`, // Stone Town arch/fountain
  "guide-portrait": `photos/zanzibar_ai_35.jpg`, // guide/person
  "guide-portrait-2": `photos/zanzibar_ai_35.jpg`,

  // ── Tours (DB photo_seed values) ───────────────────
  "stonetown-1": `photos/zanzibar_ai_01.jpg`, // Hamamni baths / Stone Town arches
  "spicefarm-1": `photos/zanzibar_ai_04.jpg`, // spice / food
  "safariblue-1": `photos/zanzibar_ai_08.jpg`, // turquoise ocean, sandbank
  "jozani-1": `photos/zanzibar_ai_16.jpg`, // Jozani forest / mangrove
  "sunset-dhow-1": `photos/zanzibar_nungwi_sunset.webp`, // real Nungwi sunset
  "prisonisland-1": `photos/zanzibar_ai_11.jpg`, // island / beach

  // variants used by gallery detail (tourSeed + "-2" etc)
  "stonetown-1-2": `photos/zanzibar_stone_town.webp`,
  "stonetown-1-3": `photos/zanzibar_ai_02.jpg`,
  "stonetown-1-4": `photos/zanzibar_ai_03.jpg`,
  "spicefarm-1-2": `photos/zanzibar_ai_05.jpg`,
  "spicefarm-1-3": `photos/zanzibar_mnemba_island.jpg`,
  "spicefarm-1-4": `photos/zanzibar_ai_07.jpg`,
  "safariblue-1-2": `photos/zanzibar_ai_09.jpg`,
  "safariblue-1-3": `photos/zanzibar_ai_10.jpg`,
  "safariblue-1-4": `photos/zanzibar_ai_12.jpg`,
  "jozani-1-2": `photos/zanzibar_ai_17.jpg`,
  "jozani-1-3": `photos/zanzibar_ai_18.jpg`,
  "jozani-1-4": `photos/zanzibar_ai_19.jpg`,
  "sunset-dhow-1-2": `photos/zanzibar_ai_13.jpg`,
  "sunset-dhow-1-3": `photos/zanzibar_ai_14.jpg`,
  "sunset-dhow-1-4": `photos/zanzibar_ai_15.jpg`,
  "prisonisland-1-2": `photos/zanzibar_ai_20.jpg`,
  "prisonisland-1-3": `photos/zanzibar_ai_21.jpg`,
  "prisonisland-1-4": `photos/zanzibar_ai_22.jpg`,

  // ── Homepage editorial ────────────────────────────
  "stonetown-alley": `photos/zanzibar_ai_02.jpg`,
  "spice-tasting": `photos/zanzibar_ai_04.jpg`,
  "ocean-sandbank": `photos/zanzibar_mnemba_island.jpg`,
  "stonetown-door": `photos/zanzibar_ai_03.jpg`,
  "spice-farm": `photos/zanzibar_ai_05.jpg`,
  "jozani-forest": `photos/zanzibar_ai_16.jpg`,
  "safariblue": `photos/zanzibar_ai_08.jpg`,

  // ── Gallery seeds (category fit) ──────────────────
  "gallery-stonetown-door": `photos/zanzibar_ai_01.jpg`, // Stone Town
  "gallery-spice-farm": `photos/zanzibar_ai_04.jpg`, // Food/Spice
  "gallery-dhow-sailing": `photos/zanzibar_ai_08.jpg`, // Ocean
  "gallery-beach-sandbank": `photos/zanzibar_ai_09.jpg`, // Ocean
  "gallery-colobus-monkey": `photos/zanzibar_ai_16.jpg`, // Nature
  "gallery-sunset": `photos/zanzibar_nungwi_sunset.webp`, // Ocean sunset
  "gallery-market": `photos/zanzibar_stone_town.webp`, // Culture/Market
  "gallery-reef-snorkel": `photos/zanzibar_ai_10.jpg`, // Ocean
  "gallery-alley": `photos/zanzibar_ai_02.jpg`, // Stone Town
  "gallery-spice-harvest": `photos/zanzibar_ai_05.jpg`, // Food
  "gallery-people": `photos/zanzibar_ai_35.jpg`, // People
  "gallery-experience": `photos/zanzibar_ai_23.jpg`, // Experiences

  // ── Journal ───────────────────────────────────────
  "journal-season": `photos/zanzibar_ai_06.jpg`,
  "journal-pack": `photos/zanzibar_ai_04.jpg`,
  "journal-stonetown": `photos/zanzibar_ai_01.jpg`,

  // ── Extra AI pack — direct access for gallery expansion ─
  // (GalleryClient now enumerates these directly, but mapping allows placeholderPhoto to resolve any)
  "zanzibar_ai_01": `photos/zanzibar_ai_01.jpg`,
  "zanzibar_ai_02": `photos/zanzibar_ai_02.jpg`,
  "zanzibar_ai_03": `photos/zanzibar_ai_03.jpg`,
  "zanzibar_ai_04": `photos/zanzibar_ai_04.jpg`,
  "zanzibar_ai_05": `photos/zanzibar_ai_05.jpg`,
  "zanzibar_ai_06": `photos/zanzibar_ai_06.jpg`,
  "zanzibar_ai_07": `photos/zanzibar_ai_07.jpg`,
  "zanzibar_ai_08": `photos/zanzibar_ai_08.jpg`,
  "zanzibar_ai_09": `photos/zanzibar_ai_09.jpg`,
  "zanzibar_ai_10": `photos/zanzibar_ai_10.jpg`,
  "zanzibar_ai_11": `photos/zanzibar_ai_11.jpg`,
  "zanzibar_ai_12": `photos/zanzibar_ai_12.jpg`,
  "zanzibar_ai_13": `photos/zanzibar_ai_13.jpg`,
  "zanzibar_ai_14": `photos/zanzibar_ai_14.jpg`,
  "zanzibar_ai_15": `photos/zanzibar_ai_15.jpg`,
  "zanzibar_ai_16": `photos/zanzibar_ai_16.jpg`,
  "zanzibar_ai_17": `photos/zanzibar_ai_17.jpg`,
  "zanzibar_ai_18": `photos/zanzibar_ai_18.jpg`,
  "zanzibar_ai_19": `photos/zanzibar_ai_19.jpg`,
  "zanzibar_ai_20": `photos/zanzibar_ai_20.jpg`,
  "zanzibar_ai_21": `photos/zanzibar_ai_21.jpg`,
  "zanzibar_ai_22": `photos/zanzibar_ai_22.jpg`,
  "zanzibar_ai_23": `photos/zanzibar_ai_23.jpg`,
  "zanzibar_ai_24": `photos/zanzibar_ai_24.jpg`,
  "zanzibar_ai_25": `photos/zanzibar_ai_25.jpg`,
  "zanzibar_ai_26": `photos/zanzibar_ai_26.jpg`,
  "zanzibar_ai_27": `photos/zanzibar_ai_27.jpg`,
  "zanzibar_ai_28": `photos/zanzibar_ai_28.jpg`,
  "zanzibar_ai_29": `photos/zanzibar_ai_29.jpg`,
  "zanzibar_ai_30": `photos/zanzibar_ai_30.jpg`,
  "zanzibar_ai_31": `photos/zanzibar_ai_31.jpg`,
  "zanzibar_ai_32": `photos/zanzibar_ai_32.jpg`,
  "zanzibar_ai_33": `photos/zanzibar_ai_33.jpg`,
  "zanzibar_ai_34": `photos/zanzibar_ai_34.jpg`,
  "zanzibar_ai_35": `photos/zanzibar_ai_35.jpg`,
  "zanzibar_ai_36": `photos/zanzibar_ai_36.jpg`,
  "zanzibar_ai_37": `photos/zanzibar_ai_37.jpg`,
  "zanzibar_ai_38": `photos/zanzibar_ai_38.jpg`,
  "zanzibar_ai_39": `photos/zanzibar_ai_39.jpg`,
  "zanzibar_ai_40": `photos/zanzibar_ai_40.jpg`,
};
