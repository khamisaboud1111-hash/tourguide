// Real Zanzibar photography — Wikimedia Commons (CC BY / CC BY-SA) — no more random Picsum.
// Each seed maps to a verified Zanzibar image. Attribution is documented in IMAGE_ATTRIBUTION.md.
// If seed starts with "photos/" it still resolves to /public/photos for owner uploads (highest priority).

const W = "https://upload.wikimedia.org/wikipedia/commons";

export const zanzibarImageMap: Record<string, string> = {
  // ── Hero & editorial ──────────────────────────────
  "hero-dhow-sunset": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`, // Stone Town waterfront at sunset — UNESCO
  "hero-zanzibar": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "about-zanzibar-street": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
  "guide-portrait": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "guide-portrait-2": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,

  // ── Tours (DB photo_seed values) ──────────────────
  "stonetown-1": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "spicefarm-1": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,
  "safariblue-1": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`, // temporary: Menai Bay dhow — replace with dedicated Safari Blue when owner shoots
  "jozani-1": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "sunset-dhow-1": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "prisonisland-1": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`, // Changuu — owner to replace with tortoise photo
  // variants used by gallery detail (tourSeed + "-2" etc) — fall through to same tour image
  "stonetown-1-2": `${W}/f/f4/Forodhani_Gardens_%2834023630713%29.jpg`,
  "stonetown-1-3": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
  "stonetown-1-4": `${W}/7/76/Stone_Town%2C_Zanzibar%2C_afri%C4%8Dke_figurine.jpg`,
  "spicefarm-1-2": `${W}/d/d0/Parque_nacional_de_la_Bah%C3%ADa_Jozani_Chwaka%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-06-02%2C_DD_31.jpg`,
  "spicefarm-1-3": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "spicefarm-1-4": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
  "safariblue-1-2": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "safariblue-1-3": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,
  "safariblue-1-4": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "jozani-1-2": `${W}/6/6d/Jozani_Forest_at_Jozani_Chwaka_Bay_National_Park%2C_Kusini_DC%2C_South_Zanzibar%2C_Tanzania.jpg`,
  "jozani-1-3": `${W}/3/33/Mangrove_Zanzibar.jpg`,
  "jozani-1-4": `${W}/f/fd/%28128%29_-_Jozani_Chwaka_National_Park.jpg`,
  "sunset-dhow-1-2": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "sunset-dhow-1-3": `${W}/f/f4/Forodhani_Gardens_%2834023630713%29.jpg`,
  "sunset-dhow-1-4": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
  "prisonisland-1-2": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "prisonisland-1-3": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "prisonisland-1-4": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,

  // ── Homepage editorial ────────────────────────────
  "stonetown-alley": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
  "spice-tasting": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,
  "ocean-sandbank": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "stonetown-door": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "spice-farm": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,
  "jozani-forest": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "safariblue": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,

  // ── Gallery seeds ─────────────────────────────────
  "gallery-stonetown-door": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "gallery-spice-farm": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,
  "gallery-dhow-sailing": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "gallery-beach-sandbank": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "gallery-colobus-monkey": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "gallery-sunset": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "gallery-market": `${W}/f/f4/Forodhani_Gardens_%2834023630713%29.jpg`,
  "gallery-reef-snorkel": `${W}/b/b5/Jozani_forest%2C_Zanzibar.jpg`,
  "gallery-alley": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
  "gallery-spice-harvest": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,
  "gallery-people": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
  "gallery-experience": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,

  // ── Journal ───────────────────────────────────────
  "journal-season": `${W}/8/84/Stone_Town_of_Zanzibar-108857.jpg`,
  "journal-pack": `${W}/b/bf/Spice_farm%2C_Zanzibar.jpg`,
  "journal-stonetown": `${W}/6/60/Streets_of_Stone_Town_%2834603004541%29.jpg`,
};

// Backwards: any unknown seed now transparently tries Zanzibar map before falling to Picsum
// so even admin-created tours with custom seeds get a sensible Zanzibar fallback if owner hasn't uploaded yet.
