// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE FIRST. Every placeholder below (name, numbers,
// bio) flows out to the whole site from this single file.
// ─────────────────────────────────────────────────────────────

export const business = {
  name: "Zanzibar Karibu Tours",
  tagline: "See Zanzibar the way locals do",
  guideName: "Your Guide's Name",
  guideBioShort:
    "A licensed Zanzibar tour guide with years of experience showing visitors the real island — its old town, its spice farms, and its reefs.",
  whatsappNumber: "255674804477", // 0674804477 — digits only, country code first, no + or spaces
  phoneDisplay: "0674804477",
  email: "hello@example.com",
  instagram: "https://instagram.com/yourhandle",
  location: "Stone Town, Zanzibar, Tanzania",
  mapCenter: { lat: -6.1659, lng: 39.2026 }, // Stone Town coordinates — replace with your actual meeting point
  depositPercent: 0.2, // 20% deposit online, rest paid to the guide directly
};

export function waLink(prefillText?: string) {
  const base = `https://wa.me/${business.whatsappNumber}`;
  return prefillText ? `${base}?text=${encodeURIComponent(prefillText)}` : base;
}
