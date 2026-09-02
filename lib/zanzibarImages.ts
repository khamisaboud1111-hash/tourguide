// Real Zanzibar photography — owner AI pack (40 images) + original 3 local shots.
// Every seed now points to a real Zanzibar image in public/photos.
// Generated from zanzibar_website_images.zip (3) + openai pack (40) — all Zanzibar, all local.

export const zanzibarImageMap: Record<string, string> = {
  // ── Owner real photos (14 from owner shoot) ────────
  "sitmeir_real_01": `photos/sitmeir_real_01.jpg`,
  "sitmeir_real_02": `photos/sitmeir_real_02.jpg`,
  "sitmeir_real_03": `photos/sitmeir_real_03.jpg`,
  "sitmeir_real_04": `photos/sitmeir_real_04.jpg`,
  "sitmeir_real_05": `photos/sitmeir_real_05.jpg`,
  "sitmeir_real_06": `photos/sitmeir_real_06.jpg`,
  "sitmeir_real_07": `photos/sitmeir_real_07.jpg`,
  "sitmeir_real_08": `photos/sitmeir_real_08.jpg`,
  "sitmeir_real_09": `photos/sitmeir_real_09.jpg`,
  "sitmeir_real_10": `photos/sitmeir_real_10.jpg`,
  "sitmeir_real_11": `photos/sitmeir_real_11.jpg`,
  "sitmeir_real_12": `photos/sitmeir_real_12.jpg`,
  "sitmeir_real_13": `photos/sitmeir_real_13.jpg`,
  "sitmeir_real_14": `photos/sitmeir_real_14.jpg`,

  // ── Stone Town culture/history set (19 owner photos) ──
  "stonetown_real_01": `photos/stonetown_real_01.jpg`, // carved arch door, kids playing
  "stonetown_real_02": `photos/stonetown_real_02.jpg`, // market stall at carved door
  "stonetown_real_03": `photos/stonetown_real_03.jpg`, // Gizenga Street alley shops
  "stonetown_real_04": `photos/stonetown_real_04.jpg`, // Old Fort entrance + clock tower
  "stonetown_real_05": `photos/stonetown_real_05.jpg`, // Old Fort walls + gardens
  "stonetown_real_06": `photos/stonetown_real_06.jpg`, // Old Fort courtyard shops
  "stonetown_real_07": `photos/stonetown_real_07.jpg`, // Old Fort amphitheatre aerial
  "stonetown_real_08": `photos/stonetown_real_08.jpg`, // rooftops aerial with fort
  "stonetown_real_09": `photos/stonetown_real_09.jpg`, // Forodhani beach boats aerial
  "stonetown_real_10": `photos/stonetown_real_10.jpg`, // moody alley
  "stonetown_real_11": `photos/stonetown_real_11.jpg`, // rooftop café sunset
  "stonetown_real_12": `photos/stonetown_real_12.jpg`, // rooftop restaurant, cathedral towers
  "stonetown_real_13": `photos/stonetown_real_13.jpg`, // St. Joseph's Cathedral tower
  "stonetown_real_14": `photos/stonetown_real_14.jpg`, // cathedral facade
  "stonetown_real_15": `photos/stonetown_real_15.jpg`, // cathedral with passers-by
  "stonetown_real_16": `photos/stonetown_real_16.jpg`, // carved door brass spikes closeup
  "stonetown_real_17": `photos/stonetown_real_17.jpg`, // waterfront palm promenade
  "stonetown_real_18": `photos/stonetown_real_18.jpg`, // old cannons on waterfront
  "stonetown_real_19": `photos/stonetown_real_19.jpg`, // fort courtyard wide

  // ── Hero & editorial — owner local ──────────────────
  "hero-dhow-sunset": `photos/sitmeir_real_14.jpg`, // real palm-sunset beach shot
  "hero-zanzibar": `photos/sitmeir_real_01.jpg`, // turquoise lagoon aerial
  "about-zanzibar-street": `photos/sitmeir_real_11.jpg`, // Stone Town clock tower street
  "guide-portrait": `photos/sitmeir_real_07.jpg`,
  "guide-portrait-2": `photos/sitmeir_real_07.jpg`,

  // ── Tours (DB photo_seed values) ───────────────────
  "stonetown-1": `photos/stonetown_real_01.jpg`, // carved arch door — Culture & History
  "spicefarm-1": `photos/zanzibar_spice_01.jpg`,
  "safariblue-1": `photos/safari_blue_01.jpg`,
  "jozani-1": `photos/zanzibar_jozani_01.jpg`,
  "sunset-dhow-1": `photos/dhow_cruise_01.jpg`,
  "prisonisland-1": `photos/prison_island_01.jpg`,
  // variants used by gallery detail (tourSeed + "-2" etc)
  "stonetown-1-2": `photos/stonetown_real_02.jpg`,
  "stonetown-1-3": `photos/stonetown_real_03.jpg`,
  "stonetown-1-4": `photos/stonetown_real_04.jpg`,
  "spicefarm-1-2": `photos/zanzibar_spice_02.jpg`,
  "spicefarm-1-3": `photos/zanzibar_spice_03.jpg`,
  "spicefarm-1-4": `photos/zanzibar_spice_04.jpg`,
  "safariblue-1-2": `photos/safari_blue_02.jpg`,
  "safariblue-1-3": `photos/safari_blue_03.jpg`,
  "safariblue-1-4": `photos/safari_blue_04.jpg`,
  "jozani-1-2": `photos/zanzibar_jozani_02.jpg`,
  "jozani-1-3": `photos/zanzibar_jozani_03.jpg`,
  "jozani-1-4": `photos/zanzibar_jozani_04.jpg`,
  "sunset-dhow-1-2": `photos/dhow_cruise_02.jpg`,
  "sunset-dhow-1-3": `photos/dhow_cruise_03.jpg`,
  "sunset-dhow-1-4": `photos/dhow_cruise_04.jpg`,
  "prisonisland-1-2": `photos/prison_island_02.jpg`,
  "prisonisland-1-3": `photos/prison_island_03.jpg`,
  "prisonisland-1-4": `photos/prison_island_04.jpg`,

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
  // Nature — Jozani Forest & Red Colobus Monkeys — 6 real photos
  "zanzibar_jozani_01": `photos/zanzibar_jozani_01.jpg`,
  "zanzibar_jozani_02": `photos/zanzibar_jozani_02.jpg`,
  "zanzibar_jozani_03": `photos/zanzibar_jozani_03.jpg`,
  "zanzibar_jozani_04": `photos/zanzibar_jozani_04.jpg`,
  "zanzibar_jozani_05": `photos/zanzibar_jozani_05.jpg`,
  "zanzibar_jozani_06": `photos/zanzibar_jozani_06.jpg`,
  "zanzibar_mnemba_island": `photos/zanzibar_mnemba_island.jpg`,
  // Culture & Nature — Spice Farm Tour — 14 real photos
  "zanzibar_spice_01": `photos/zanzibar_spice_01.jpg`,
  "zanzibar_spice_02": `photos/zanzibar_spice_02.jpg`,
  "zanzibar_spice_03": `photos/zanzibar_spice_03.jpg`,
  "zanzibar_spice_04": `photos/zanzibar_spice_04.jpg`,
  "zanzibar_spice_05": `photos/zanzibar_spice_05.jpg`,
  "zanzibar_spice_06": `photos/zanzibar_spice_06.jpg`,
  "zanzibar_spice_07": `photos/zanzibar_spice_07.jpg`,
  "zanzibar_spice_08": `photos/zanzibar_spice_08.jpg`,
  "zanzibar_spice_09": `photos/zanzibar_spice_09.jpg`,
  "zanzibar_spice_10": `photos/zanzibar_spice_10.jpg`,
  "zanzibar_spice_11": `photos/zanzibar_spice_11.jpg`,
  "zanzibar_spice_12": `photos/zanzibar_spice_12.jpg`,
  "zanzibar_spice_13": `photos/zanzibar_spice_13.jpg`,
  "zanzibar_spice_14": `photos/zanzibar_spice_14.jpg`,
  // Ocean — Prison Island (Changuu) Tour — 18 real photos
  "prison_island_01": `photos/prison_island_01.jpg`,
  "prison_island_02": `photos/prison_island_02.jpg`,
  "prison_island_03": `photos/prison_island_03.jpg`,
  "prison_island_04": `photos/prison_island_04.jpg`,
  "prison_island_05": `photos/prison_island_05.jpg`,
  "prison_island_06": `photos/prison_island_06.jpg`,
  "prison_island_07": `photos/prison_island_07.jpg`,
  "prison_island_08": `photos/prison_island_08.jpg`,
  "prison_island_09": `photos/prison_island_09.jpg`,
  "prison_island_10": `photos/prison_island_10.jpg`,
  "prison_island_11": `photos/prison_island_11.jpg`,
  "prison_island_12": `photos/prison_island_12.jpg`,
  "prison_island_13": `photos/prison_island_13.jpg`,
  "prison_island_14": `photos/prison_island_14.jpg`,
  "prison_island_15": `photos/prison_island_15.jpg`,
  "prison_island_16": `photos/prison_island_16.jpg`,
  "prison_island_17": `photos/prison_island_17.jpg`,
  "prison_island_18": `photos/prison_island_18.jpg`,
  // Ocean — Sunset Dhow Cruise — 20 real photos
  "dhow_cruise_01": `photos/dhow_cruise_01.jpg`,
  "dhow_cruise_02": `photos/dhow_cruise_02.jpg`,
  "dhow_cruise_03": `photos/dhow_cruise_03.jpg`,
  "dhow_cruise_04": `photos/dhow_cruise_04.jpg`,
  "dhow_cruise_05": `photos/dhow_cruise_05.jpg`,
  "dhow_cruise_06": `photos/dhow_cruise_06.jpg`,
  "dhow_cruise_07": `photos/dhow_cruise_07.jpg`,
  "dhow_cruise_08": `photos/dhow_cruise_08.jpg`,
  "dhow_cruise_09": `photos/dhow_cruise_09.jpg`,
  "dhow_cruise_10": `photos/dhow_cruise_10.jpg`,
  "dhow_cruise_11": `photos/dhow_cruise_11.jpg`,
  "dhow_cruise_12": `photos/dhow_cruise_12.jpg`,
  "dhow_cruise_13": `photos/dhow_cruise_13.jpg`,
  "dhow_cruise_14": `photos/dhow_cruise_14.jpg`,
  "dhow_cruise_15": `photos/dhow_cruise_15.jpg`,
  "dhow_cruise_16": `photos/dhow_cruise_16.jpg`,
  "dhow_cruise_17": `photos/dhow_cruise_17.jpg`,
  "dhow_cruise_18": `photos/dhow_cruise_18.jpg`,
  "dhow_cruise_19": `photos/dhow_cruise_19.jpg`,
  "dhow_cruise_20": `photos/dhow_cruise_20.jpg`,
  // Ocean — Safari Blue Sailing Tour — 11 real photos
  "safari_blue_01": `photos/safari_blue_01.jpg`,
  "safari_blue_02": `photos/safari_blue_02.jpg`,
  "safari_blue_03": `photos/safari_blue_03.jpg`,
  "safari_blue_04": `photos/safari_blue_04.jpg`,
  "safari_blue_05": `photos/safari_blue_05.jpg`,
  "safari_blue_06": `photos/safari_blue_06.jpg`,
  "safari_blue_07": `photos/safari_blue_07.jpg`,
  "safari_blue_08": `photos/safari_blue_08.jpg`,
  "safari_blue_09": `photos/safari_blue_09.jpg`,
  "safari_blue_10": `photos/safari_blue_10.jpg`,
  "safari_blue_11": `photos/safari_blue_11.jpg`,
};
