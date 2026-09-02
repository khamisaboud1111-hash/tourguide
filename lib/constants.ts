// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE FIRST. Every placeholder below (name, numbers,
// bio) flows out to the whole site from this single file.
// ─────────────────────────────────────────────────────────────

export const business = {
  name: "Sitmeir Tours & Travel",
  tagline: "Zanzibar, Through Local Eyes",
  guideName: "Abdul Hamid", // owner — matches Facebook account; change here to rename site-wide
  guideBioShort:
    "Experience Zanzibar beyond the postcard.\n\nFrom the historic soul of Stone Town to spice-filled farms and vibrant coral reefs, our locally guided experiences bring you closer to the island's culture, nature, people, and stories.\n\nLicensed local guiding • Small groups • Flexible experiences\n\nNo rigid itineraries. No rushed sightseeing. Just a more personal way to discover Zanzibar.",
  whatsappNumber: "255674804477", // 0674804477 — digits only, country code first, no + or spaces
  phoneDisplay: "0674804477",
  email: "abdulhamidameir96@gmail.com",
  facebook: "https://www.facebook.com/Abdul Hamid",
  tiktok: "https://www.tiktok.com/@sitmeirtourtravel",
  instagram: "https://instagram.com/sitmeirtourtravel",
  location: "Stone Town, Zanzibar, Tanzania",
  mapCenter: { lat: -6.1659, lng: 39.2026 }, // Stone Town coordinates — replace with your actual meeting point
};

export function waLink(prefillText?: string) {
  const base = `https://wa.me/${business.whatsappNumber}`;
  return prefillText ? `${base}?text=${encodeURIComponent(prefillText)}` : base;
}
