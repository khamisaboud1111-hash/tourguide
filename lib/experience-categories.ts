// Experience categories — single source of truth for the /tours filter,
// the category cards on /tours, and anywhere else categories are listed.
//
// `value` must EXACTLY match the `category` string stored on tours in the DB
// (admin TourForm category field is free text).
//
// `image` is the card photo seed. The owner will supply the exact image for
// each new category — when they arrive, swap just this field (local
// "photos/..." path, Supabase https URL, or existing seed) and cards update
// everywhere. Current images are temporary stand-ins.
export type ExperienceCategory = {
  value: string;
  labelKey: string;
  image: string;
};

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  // Existing categories
  { value: "Culture & History", labelKey: "catCultureHistory", image: "sitmeir_real_11" },
  { value: "Culture & Nature", labelKey: "catCultureNature", image: "zanzibar_spice_07" },
  { value: "Ocean & Sailing", labelKey: "catOceanSailing", image: "safari_blue_01" },
  { value: "Nature & Wildlife", labelKey: "catNatureWildlife", image: "zanzibar_jozani_02" },
  { value: "Ocean & Wildlife", labelKey: "catOceanWildlife", image: "prison_island_03" },
  // New categories (card images = stand-ins until owner supplies exact images)
  { value: "Beach & Relaxation", labelKey: "catBeachRelaxation", image: "sitmeir_real_02" },
  { value: "Diving & Watersports", labelKey: "catDivingWatersports", image: "zanzibar_ai_10" },
  { value: "Food & Culinary", labelKey: "catFoodCulinary", image: "zanzibar_ai_04" },
  { value: "Village & Community", labelKey: "catVillageCommunity", image: "zanzibar_ai_37" },
  { value: "Farms & Local Life", labelKey: "catFarmsLocalLife", image: "zanzibar_spice_05" },
  { value: "Caves & Underground Exploration", labelKey: "catCavesUnderground", image: "zanzibar_ai_03" },
  { value: "Fishing Tourism", labelKey: "catFishingTourism", image: "zanzibar_ai_12" },
  { value: "Architecture & Urban Exploration", labelKey: "catArchitectureUrban", image: "zanzibar_ai_02" },
  { value: "Religious Tourism", labelKey: "catReligiousTourism", image: "zanzibar_ai_25" },
  { value: "Shopping & Local Crafts", labelKey: "catShoppingCrafts", image: "zanzibar_spice_10" },
  { value: "Wellness & Spa Tourism", labelKey: "catWellnessSpa", image: "sitmeir_real_09" },
];
