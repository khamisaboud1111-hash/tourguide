"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { placeholderPhoto } from "@/lib/placeholder";
import { useLang } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

type Photo = { seed: string; tall?: boolean; cat: string; alt: string };

// Full Zanzibar gallery — owner photos (14 real shots + 3 + 40 AI), all real Zanzibar.
// Categories kept internally for the lightbox caption; no filter chips shown (per owner request).
const photos: Photo[] = [
  // ── Owner real photos (14) — beaches, Stone Town, resorts, sunset ──
  { seed: "sitmeir_real_01", tall: true, cat: "Ocean", alt: "Turquoise lagoon and thatched pier — Nungwi, Zanzibar" },
  { seed: "sitmeir_real_02", cat: "Ocean", alt: "White sand beach with leaning palms — Zanzibar" },
  { seed: "sitmeir_real_03", tall: true, cat: "Ocean", alt: "Palm grove over turquoise sea and beach umbrellas" },
  { seed: "sitmeir_real_04", cat: "Ocean", alt: "Swaying palms and wooden pier — Zanzibar coast" },
  { seed: "sitmeir_real_05", cat: "Experiences", alt: "Beach swing under the trees — Zanzibar resort" },
  { seed: "sitmeir_real_06", tall: true, cat: "Ocean", alt: "Wooden pier stretching over clear turquoise water" },
  { seed: "sitmeir_real_07", tall: true, cat: "People", alt: "Traveler walking a rocky cove beach — Zanzibar" },
  { seed: "sitmeir_real_08", cat: "Ocean", alt: "Aerial of a golden-hour beach with thatched resorts — Kendwa" },
  { seed: "sitmeir_real_09", cat: "Experiences", alt: "Resort pool and palms by the ocean — aerial view" },
  { seed: "sitmeir_real_10", tall: true, cat: "Stone Town", alt: "Stone Town waterfront with boats and old palaces" },
  { seed: "sitmeir_real_11", cat: "Stone Town", alt: "Stone Town street with old clock tower and whitewashed facades" },
  { seed: "sitmeir_real_12", cat: "Stone Town", alt: "Carved wooden Zanzibar door in a narrow alley" },
  { seed: "sitmeir_real_13", tall: true, cat: "Ocean", alt: "Rocky cliff coast meeting turquoise sea — Zanzibar" },
  { seed: "sitmeir_real_14", tall: true, cat: "Ocean", alt: "Palm silhouette over a golden beach sunset — Zanzibar" },

  // Stone Town
  { seed: "zanzibar_ai_01", tall: true, cat: "Stone Town", alt: "Hamamni Persian Baths — Stone Town arches and fountain" },
  { seed: "zanzibar_ai_02", cat: "Stone Town", alt: "Carved Zanzibar door in Stone Town alley" },
  { seed: "zanzibar_ai_03", tall: true, cat: "Stone Town", alt: "Narrow Stone Town alley in morning light" },
  { seed: "gallery-stonetown-door", tall: true, cat: "Stone Town", alt: "Historic Stone Town door and street" },
  { seed: "gallery-alley", cat: "Stone Town", alt: "Stone Town alley — daily life" },
  { seed: "zanzibar_ai_13", cat: "Stone Town", alt: "Stone Town rooftop and sea view" },
  { seed: "zanzibar_ai_14", cat: "Stone Town", alt: "Old Fort, Stone Town" },

  // Ocean
  { seed: "zanzibar_ai_06", cat: "Ocean", alt: "Dhow at sunset off Zanzibar" },
  { seed: "zanzibar_ai_08", tall: true, cat: "Ocean", alt: "Mnemba Island — turquoise water and white sandbank" },
  { seed: "zanzibar_ai_09", cat: "Ocean", alt: "Safari Blue — dhow sailing Menai Bay" },
  { seed: "zanzibar_ai_10", tall: true, cat: "Ocean", alt: "Reef snorkeling off Zanzibar" },
  { seed: "zanzibar_ai_12", cat: "Ocean", alt: "Traditional dhow on Indian Ocean" },
  { seed: "zanzibar_mnemba_island", tall: true, cat: "Ocean", alt: "Mnemba atoll — crystal water" },
  { seed: "gallery-beach-sandbank", tall: true, cat: "Ocean", alt: "White sandbank at low tide" },
  { seed: "zanzibar_ai_15", cat: "Ocean", alt: "Beach and palm — south coast Zanzibar" },
  { seed: "zanzibar_ai_20", cat: "Ocean", alt: "Ocean horizon — Kendwa beach" },

  // Culture
  { seed: "zanzibar_ai_23", cat: "Culture", alt: "Stone Town street — Swahili life" },
  { seed: "zanzibar_ai_24", tall: true, cat: "Culture", alt: "Forodhani night market — Zanzibar" },
  { seed: "zanzibar_ai_25", cat: "Culture", alt: "Old mosque and arch — Stone Town" },
  { seed: "zanzibar_ai_26", cat: "Culture", alt: "House of Wonders — Stone Town" },
  { seed: "zanzibar_ai_27", cat: "Culture", alt: "Taarab musician — Stone Town culture" },

  // Food
  { seed: "zanzibar_ai_04", cat: "Food", alt: "Zanzibar spice — clove and vanilla tasting" },
  { seed: "zanzibar_ai_05", tall: true, cat: "Food", alt: "Spice farm — harvest in Zanzibar" },
  { seed: "gallery-spice-farm", cat: "Food", alt: "Spice farm — see, smell, taste" },
  { seed: "gallery-spice-harvest", cat: "Food", alt: "Harvesting spices in Zanzibar" },
  { seed: "zanzibar_ai_28", cat: "Food", alt: "Spice selection — cinnamon, cardamom" },
  { seed: "zanzibar_ai_29", cat: "Food", alt: "Seafood lunch — Safari Blue beach" },

  // People
  { seed: "zanzibar_ai_35", cat: "People", alt: "Local guide with guests — Stone Town" },
  { seed: "zanzibar_ai_36", tall: true, cat: "People", alt: "Guide explaining — spice farm" },
  { seed: "zanzibar_ai_37", cat: "People", alt: "Fisherman — Nungwi beach" },
  { seed: "zanzibar_ai_38", cat: "People", alt: "Village children — Zanzibar" },

  // Experiences
  { seed: "zanzibar_ai_33", cat: "Experiences", alt: "Tour experience — dhow deck at sunset" },
  { seed: "zanzibar_ai_34", tall: true, cat: "Experiences", alt: "Guests on safari blue — sailing" },
  { seed: "zanzibar_ai_39", cat: "Experiences", alt: "Stone Town walking tour — group" },
  { seed: "zanzibar_ai_40", cat: "Experiences", alt: "Sunset dhow cruise — Stone Town coast" },
  { seed: "gallery-experience", cat: "Experiences", alt: "Guests tasting fruit — spice tour" },
  { seed: "zanzibar_ai_21", cat: "Experiences", alt: "Snorkeling — reef experience" },
  { seed: "zanzibar_ai_22", tall: true, cat: "Experiences", alt: "Island picnic — Safari Blue" },

  // Jozani Forest & Red Colobus Monkeys
  { seed: "zanzibar_jozani_01", tall: true, cat: "Jozani Forest & Red Colobus Monkeys", alt: "Jozani Forest — mangrove boardwalk" },
  { seed: "zanzibar_jozani_02", cat: "Jozani Forest & Red Colobus Monkeys", alt: "Red colobus monkey — Jozani Forest" },
  { seed: "zanzibar_jozani_03", cat: "Jozani Forest & Red Colobus Monkeys", alt: "Jozani Forest trail — Zanzibar" },
  { seed: "zanzibar_jozani_04", cat: "Jozani Forest & Red Colobus Monkeys", alt: "Red colobus monkeys in the trees" },
  { seed: "zanzibar_jozani_05", tall: true, cat: "Jozani Forest & Red Colobus Monkeys", alt: "Red colobus monkey — close up" },
  { seed: "zanzibar_jozani_06", cat: "Jozani Forest & Red Colobus Monkeys", alt: "Red colobus monkey baby" },

  // Spice Farm Tour — Culture & Nature (14 real photos) — from C:\Users\hp\OneDrive\Desktop\spices
  { seed: "zanzibar_spice_01", tall: true, cat: "Food", alt: "Spice farm — fresh clove and vanilla tasting, Zanzibar" },
  { seed: "zanzibar_spice_02", cat: "Food", alt: "Spice farm — cinnamon bark harvest" },
  { seed: "zanzibar_spice_03", cat: "Food", alt: "Spice farm — guide showing nutmeg fruit" },
  { seed: "zanzibar_spice_04", tall: true, cat: "Food", alt: "Spice farm — cardamom and pepper vines" },
  { seed: "zanzibar_spice_05", cat: "Food", alt: "Spice farm — turmeric roots freshly dug" },
  { seed: "zanzibar_spice_06", cat: "Food", alt: "Spice farm — lemongrass and vanilla vines" },
  { seed: "zanzibar_spice_07", tall: true, cat: "Food", alt: "Spice farm — tasting tropical fruit under the canopy" },
  { seed: "zanzibar_spice_08", cat: "Food", alt: "Spice farm — dried cloves in woven basket" },
  { seed: "zanzibar_spice_09", cat: "Food", alt: "Spice farm — guide explaining medicinal plants" },
  { seed: "zanzibar_spice_10", tall: true, cat: "Food", alt: "Spice farm — spice market display, Zanzibar" },
  { seed: "zanzibar_spice_11", cat: "Food", alt: "Spice farm — harvesting black pepper" },
  { seed: "zanzibar_spice_12", cat: "Food", alt: "Spice farm — ginger and galangal roots" },
  { seed: "zanzibar_spice_13", tall: true, cat: "Food", alt: "Spice farm — visitors smelling fresh spices" },
  { seed: "zanzibar_spice_14", cat: "Food", alt: "Spice farm — spice drying in the sun, Zanzibar" },

  // Sunset Dhow Cruise — Ocean & Sailing (20 real photos) — replaces previous AI dhow seeds
  { seed: "dhow_cruise_01", tall: true, cat: "Ocean", alt: "Sunset dhow cruise — wooden dhow at golden hour, Stone Town coast" },
  { seed: "dhow_cruise_02", cat: "Ocean", alt: "Sunset dhow cruise — sailing into the sunset, Zanzibar" },
  { seed: "dhow_cruise_03", cat: "Ocean", alt: "Sunset dhow cruise — dhow silhouette at dusk" },
  { seed: "dhow_cruise_04", tall: true, cat: "Ocean", alt: "Sunset dhow cruise — guests on deck at sunset" },
  { seed: "dhow_cruise_05", cat: "Ocean", alt: "Sunset dhow cruise — calm water and evening sky" },
  { seed: "dhow_cruise_06", cat: "Ocean", alt: "Sunset dhow cruise — sail detail at sunset" },
  { seed: "dhow_cruise_07", tall: true, cat: "Ocean", alt: "Sunset dhow cruise — horizon and dhow mast" },
  { seed: "dhow_cruise_08", cat: "Ocean", alt: "Sunset dhow cruise — Stone Town waterfront from the water" },
  { seed: "dhow_cruise_09", cat: "Ocean", alt: "Sunset dhow cruise — evening light on the Indian Ocean" },
  { seed: "dhow_cruise_10", tall: true, cat: "Ocean", alt: "Sunset dhow cruise — dhow sailing at twilight" },
  { seed: "dhow_cruise_11", cat: "Ocean", alt: "Sunset dhow cruise — guests watching the sunset" },
  { seed: "dhow_cruise_12", cat: "Ocean", alt: "Sunset dhow cruise — dhow on turquoise water before dusk" },
  { seed: "dhow_cruise_13", tall: true, cat: "Ocean", alt: "Sunset dhow cruise — sail and sky at golden hour" },
  { seed: "dhow_cruise_14", cat: "Ocean", alt: "Sunset dhow cruise — tranquil evening sail" },
  { seed: "dhow_cruise_15", cat: "Ocean", alt: "Sunset dhow cruise — dhow fleet at sunset, Zanzibar" },
  { seed: "dhow_cruise_16", tall: true, cat: "Ocean", alt: "Sunset dhow cruise — close-up of dhow deck at sunset" },
  { seed: "dhow_cruise_17", cat: "Ocean", alt: "Sunset dhow cruise — sea and sky colours" },
  { seed: "dhow_cruise_18", cat: "Ocean", alt: "Sunset dhow cruise — dhow returning at dusk" },
  { seed: "dhow_cruise_19", tall: true, cat: "Ocean", alt: "Sunset dhow cruise — evening panorama from the dhow" },
  { seed: "dhow_cruise_20", cat: "Ocean", alt: "Sunset dhow cruise — final light over Stone Town" },

  // Prison Island (Changuu) Tour — Ocean & Wildlife (18 real photos) — added, existing kept
  { seed: "prison_island_01", tall: true, cat: "Ocean", alt: "Prison Island — turquoise water and beach approach" },
  { seed: "prison_island_02", cat: "Ocean", alt: "Prison Island — historic quarantine building" },
  { seed: "prison_island_03", cat: "Ocean", alt: "Prison Island — Aldabra giant tortoise close-up" },
  { seed: "prison_island_04", tall: true, cat: "Ocean", alt: "Prison Island — tortoise sanctuary, Changuu" },
  { seed: "prison_island_05", cat: "Ocean", alt: "Prison Island — beach and dhow landing" },
  { seed: "prison_island_06", cat: "Ocean", alt: "Prison Island — giant tortoises grazing" },
  { seed: "prison_island_07", tall: true, cat: "Ocean", alt: "Prison Island — coastal view with palm shade" },
  { seed: "prison_island_08", cat: "Ocean", alt: "Prison Island — tortoise shell detail" },
  { seed: "prison_island_09", cat: "Ocean", alt: "Prison Island — guests with tortoises" },
  { seed: "prison_island_10", tall: true, cat: "Ocean", alt: "Prison Island — beach bar and turquoise sea" },
  { seed: "prison_island_11", cat: "Ocean", alt: "Prison Island — snorkeling off the island" },
  { seed: "prison_island_12", cat: "Ocean", alt: "Prison Island — historic prison ruins" },
  { seed: "prison_island_13", tall: true, cat: "Ocean", alt: "Prison Island — tortoise walking the grounds" },
  { seed: "prison_island_14", cat: "Ocean", alt: "Prison Island — island panorama from the water" },
  { seed: "prison_island_15", cat: "Ocean", alt: "Prison Island — palm-fringed beach" },
  { seed: "prison_island_16", tall: true, cat: "Ocean", alt: "Prison Island — giant tortoise feeding" },
  { seed: "prison_island_17", cat: "Ocean", alt: "Prison Island — boat approach, Changuu Island" },
  { seed: "prison_island_18", cat: "Ocean", alt: "Prison Island — sunset over the island" },

  // Safari Blue Sailing Tour — Ocean & Sailing (11 real photos) — added
  { seed: "safari_blue_01", tall: true, cat: "Ocean", alt: "Safari Blue — dhow sailing Menai Bay, turquoise water" },
  { seed: "safari_blue_02", cat: "Ocean", alt: "Safari Blue — sandbank at low tide, Zanzibar" },
  { seed: "safari_blue_03", cat: "Ocean", alt: "Safari Blue — snorkeling reef, clear water" },
  { seed: "safari_blue_04", tall: true, cat: "Ocean", alt: "Safari Blue — seafood lunch on Kwale Island beach" },
  { seed: "safari_blue_05", cat: "Ocean", alt: "Safari Blue — dhow fleet in the bay" },
  { seed: "safari_blue_06", cat: "Ocean", alt: "Safari Blue — guests swimming at the sandbank" },
  { seed: "safari_blue_07", tall: true, cat: "Ocean", alt: "Safari Blue — traditional dhow sail detail" },
  { seed: "safari_blue_08", cat: "Ocean", alt: "Safari Blue — coral reef from the boat" },
  { seed: "safari_blue_09", cat: "Ocean", alt: "Safari Blue — beach setup, fruit and grill" },
  { seed: "safari_blue_10", tall: true, cat: "Ocean", alt: "Safari Blue — sailing with guests, Menai Bay" },
  { seed: "safari_blue_11", cat: "Ocean", alt: "Safari Blue — Kwale Island mangrove and beach" },
];

function resolveSrc(seed: string, w: number, h: number): string {
  if (seed.startsWith("http://") || seed.startsWith("https://") || seed.startsWith("/")) return seed;
  return placeholderPhoto(seed, w, h);
}

export default function GalleryClient() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  const [dynamic, setDynamic] = useState<Photo[]>([]);
  const [visible, setVisible] = useState(30);

  // Load admin-uploaded media (Supabase storage) — appears in gallery after upload
  useEffect(() => {
    const supabase = createClient();
    supabase.from("media_assets").select("public_url, alt_text, original_filename").order("created_at", { ascending: false }).limit(60).then(({ data }) => {
      if (!data) return;
      const mapped: Photo[] = data
        .filter((r) => r.public_url)
        .map((r) => ({
          seed: r.public_url as string,
          cat: "Gallery",
          alt: (r.alt_text as string) || (r.original_filename as string) || "Gallery image",
        }));
      if (mapped.length) setDynamic(mapped);
    });
  }, []);

  const allPhotos = [...photos, ...dynamic];
  const shown = allPhotos.slice(0, visible);

  const next = () => setOpen((i) => (i === null ? 0 : (i + 1) % allPhotos.length));
  const prev = () => setOpen((i) => (i === null ? 0 : (i - 1 + allPhotos.length) % allPhotos.length));
  const current = open !== null ? allPhotos[open] : null;

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {shown.map((p, idx) => (
          <button
            key={`${p.seed}-${idx}`}
            onClick={() => setOpen(idx)}
            className={`relative w-full overflow-hidden rounded-2xl break-inside-avoid group text-left ${p.tall ? "aspect-[3/4]" : "aspect-square"}`}
            aria-label={t("openPhoto").replace("{alt}", p.alt)}
          >
            <Image
              src={resolveSrc(p.seed, 700, p.tall ? 900 : 700)}
              alt={p.alt}
              fill
              sizes="(min-width:768px) 33vw, 50vw"
              className="object-cover"
              unoptimized={p.seed.startsWith("http")}
            />
          </button>
        ))}
      </div>
      {visible < allPhotos.length && (
        <div className="text-center mt-8">
          <button onClick={() => setVisible((v) => Math.min(v + 30, allPhotos.length))} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium hover:border-clove-300 hover:text-clove-700 transition-colors">
            {t("galleryLoadMore")} — {t("galleryRemaining").replace("{n}", String(allPhotos.length - visible))}
          </button>
          <p className="text-xs text-stone-500 mt-2">{t("galleryShowing").replace("{shown}", String(shown.length)).replace("{total}", String(allPhotos.length))}</p>
        </div>
      )}

      <AnimatePresence>
      {open !== null && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur flex flex-col" role="dialog" aria-modal="true" aria-label={t("galleryLightbox")}>
          <div className="flex items-center justify-between px-4 md:px-6 py-4 text-white">
            <p className="text-sm">
              {current.alt} — {open + 1} / {allPhotos.length}
            </p>
            <button onClick={() => setOpen(null)} aria-label={t("close")} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center p-4">
            <Image src={resolveSrc(current.seed, 1600, 1200)} alt={current.alt} fill className="object-contain p-4 md:p-10" sizes="100vw" unoptimized={current.seed.startsWith("http")} />
            <button onClick={prev} aria-label={t("previous")} className="absolute left-4 md:left-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} aria-label={t("next")} className="absolute right-4 md:right-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="px-6 pb-6 text-center text-xs text-stone-300">{current.alt}</div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
