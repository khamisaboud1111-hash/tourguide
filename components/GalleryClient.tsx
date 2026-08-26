"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { placeholderPhoto } from "@/lib/placeholder";

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
  { seed: "zanzibar_prison_45", cat: "Nature", alt: "Prison Island beach — Aldabra tortoise coast" },
  { seed: "zanzibar_ai_12", cat: "Ocean", alt: "Traditional dhow on Indian Ocean" },
  { seed: "zanzibar_mnemba_island", tall: true, cat: "Ocean", alt: "Mnemba atoll — crystal water" },
  { seed: "gallery-beach-sandbank", tall: true, cat: "Ocean", alt: "White sandbank at low tide" },
  { seed: "zanzibar_dhow_64", cat: "Ocean", alt: "Dhow sailing Safari Blue" },
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

  // Nature — Jozani Forest & Red Colobus Monkeys (Images 16-32)
  { seed: "zanzibar_nature_16", tall: true, cat: "Nature", alt: "Jozani Forest — mangrove boardwalk" },
  { seed: "zanzibar_nature_17", cat: "Nature", alt: "Red colobus monkey — Jozani" },
  { seed: "zanzibar_nature_18", cat: "Nature", alt: "Jozani forest canopy — green" },
  { seed: "zanzibar_nature_19", tall: true, cat: "Nature", alt: "Mangrove — Jozani Chwaka Bay" },
  { seed: "zanzibar_nature_30", cat: "Nature", alt: "Forest trail — Jozani" },
  { seed: "zanzibar_nature_31", cat: "Nature", alt: "Wildlife — Zanzibar forest" },
  { seed: "zanzibar_nature_32", tall: true, cat: "Nature", alt: "Baobab and coast — Zanzibar nature" },

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
];

export default function GalleryClient() {
  const [open, setOpen] = useState<number | null>(null);

  const next = () => setOpen((i) => (i === null ? 0 : (i + 1) % photos.length));
  const prev = () => setOpen((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));
  const current = open !== null ? photos[open] : null;

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((p, idx) => (
          <button
            key={`${p.seed}-${idx}`}
            onClick={() => setOpen(idx)}
            className={`relative w-full overflow-hidden rounded-2xl break-inside-avoid group text-left ${p.tall ? "aspect-[3/4]" : "aspect-square"}`}
            aria-label={`Open ${p.alt}`}
          >
            <Image
              src={placeholderPhoto(p.seed, 700, p.tall ? 900 : 700)}
              alt={p.alt}
              fill
              sizes="(min-width:768px) 33vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
      {open !== null && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur flex flex-col" role="dialog" aria-modal="true" aria-label="Gallery lightbox">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 text-white">
            <p className="text-sm">
              {current.alt} — {open + 1} / {photos.length}
            </p>
            <button onClick={() => setOpen(null)} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center p-4">
            <Image src={placeholderPhoto(current.seed, 1600, 1200)} alt={current.alt} fill className="object-contain p-4 md:p-10" sizes="100vw" />
            <button onClick={prev} aria-label="Previous" className="absolute left-4 md:left-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} aria-label="Next" className="absolute right-4 md:right-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
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
