"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { placeholderPhoto } from "@/lib/placeholder";

type Photo = { seed: string; tall?: boolean; cat: string; alt: string };

// Full Zanzibar gallery — 40 AI + 3 owner shots, all real Zanzibar, categorized so each tab has fit.
const photos: Photo[] = [
  // Stone Town — doors, alleys, baths, markets, waterfront (8)
  { seed: "zanzibar_ai_01", tall: true, cat: "Stone Town", alt: "Hamamni Persian Baths — Stone Town arches and fountain" },
  { seed: "zanzibar_ai_02", cat: "Stone Town", alt: "Carved Zanzibar door in Stone Town alley" },
  { seed: "zanzibar_ai_03", tall: true, cat: "Stone Town", alt: "Narrow Stone Town alley in morning light" },
  { seed: "gallery-stonetown-door", tall: true, cat: "Stone Town", alt: "Historic Stone Town door and street" },
  { seed: "gallery-alley", cat: "Stone Town", alt: "Stone Town alley — daily life" },
  { seed: "zanzibar_stone_town", cat: "Stone Town", alt: "Stone Town waterfront — UNESCO alleys" },
  { seed: "zanzibar_ai_13", cat: "Stone Town", alt: "Stone Town rooftop and sea view" },
  { seed: "zanzibar_ai_14", cat: "Stone Town", alt: "Old Fort, Stone Town" },

  // Ocean — Mnemba, Nungwi, Safari Blue, dhows, sandbanks, reef (10)
  { seed: "zanzibar_ai_06", cat: "Ocean", alt: "Dhow at sunset off Zanzibar" },
  { seed: "zanzibar_ai_08", tall: true, cat: "Ocean", alt: "Mnemba Island — turquoise water and white sandbank" },
  { seed: "zanzibar_ai_09", cat: "Ocean", alt: "Safari Blue — dhow sailing Menai Bay" },
  { seed: "zanzibar_ai_10", tall: true, cat: "Ocean", alt: "Reef snorkeling off Zanzibar" },
  { seed: "zanzibar_ai_11", cat: "Ocean", alt: "Prison Island beach — Aldabra tortoise coast" },
  { seed: "zanzibar_ai_12", cat: "Ocean", alt: "Traditional dhow on Indian Ocean" },
  { seed: "zanzibar_mnemba_island", tall: true, cat: "Ocean", alt: "Mnemba atoll — crystal water" },
  { seed: "zanzibar_nungwi_sunset", cat: "Ocean", alt: "Nungwi sunset — beach and dhow silhouette" },
  { seed: "gallery-beach-sandbank", tall: true, cat: "Ocean", alt: "White sandbank at low tide" },
  { seed: "gallery-dhow-sailing", cat: "Ocean", alt: "Dhow sailing Safari Blue" },
  { seed: "zanzibar_ai_15", cat: "Ocean", alt: "Beach and palm — south coast Zanzibar" },
  { seed: "zanzibar_ai_20", cat: "Ocean", alt: "Ocean horizon — Kendwa beach" },

  // Culture — markets, mosques, history (6)
  { seed: "gallery-market", cat: "Culture", alt: "Darajani market — Stone Town" },
  { seed: "zanzibar_ai_23", cat: "Culture", alt: "Stone Town street — Swahili life" },
  { seed: "zanzibar_ai_24", tall: true, cat: "Culture", alt: "Forodhani night market — Zanzibar" },
  { seed: "zanzibar_ai_25", cat: "Culture", alt: "Old mosque and arch — Stone Town" },
  { seed: "zanzibar_ai_26", cat: "Culture", alt: "House of Wonders — Stone Town" },
  { seed: "zanzibar_ai_27", cat: "Culture", alt: "Taarab musician — Stone Town culture" },

  // Food / Spice — farms, tasting, harvest (6)
  { seed: "zanzibar_ai_04", cat: "Food", alt: "Zanzibar spice — clove and vanilla tasting" },
  { seed: "zanzibar_ai_05", tall: true, cat: "Food", alt: "Spice farm — harvest in Zanzibar" },
  { seed: "gallery-spice-farm", cat: "Food", alt: "Spice farm — see, smell, taste" },
  { seed: "gallery-spice-harvest", cat: "Food", alt: "Harvesting spices in Zanzibar" },
  { seed: "zanzibar_ai_28", cat: "Food", alt: "Spice selection — cinnamon, cardamom" },
  { seed: "zanzibar_ai_29", cat: "Food", alt: "Seafood lunch — Safari Blue beach" },

  // Nature — Jozani, mangroves, wildlife (7)
  { seed: "zanzibar_ai_16", tall: true, cat: "Nature", alt: "Jozani Forest — mangrove boardwalk" },
  { seed: "zanzibar_ai_17", cat: "Nature", alt: "Red colobus monkey — Jozani" },
  { seed: "zanzibar_ai_18", cat: "Nature", alt: "Jozani forest canopy — green" },
  { seed: "zanzibar_ai_19", tall: true, cat: "Nature", alt: "Mangrove — Jozani Chwaka Bay" },
  { seed: "zanzibar_ai_30", cat: "Nature", alt: "Forest trail — Jozani" },
  { seed: "zanzibar_ai_31", cat: "Nature", alt: "Wildlife — Zanzibar forest" },
  { seed: "zanzibar_ai_32", tall: true, cat: "Nature", alt: "Baobab and coast — Zanzibar nature" },

  // People — guide, guests, village (4)
  { seed: "zanzibar_ai_35", cat: "People", alt: "Local guide with guests — Stone Town" },
  { seed: "zanzibar_ai_36", tall: true, cat: "People", alt: "Guide explaining — spice farm" },
  { seed: "zanzibar_ai_37", cat: "People", alt: "Fisherman — Nungwi beach" },
  { seed: "zanzibar_ai_38", cat: "People", alt: "Village children — Zanzibar" },

  // Experiences — mixed, tour moments (5)
  { seed: "zanzibar_ai_33", cat: "Experiences", alt: "Tour experience — dhow deck at sunset" },
  { seed: "zanzibar_ai_34", tall: true, cat: "Experiences", alt: "Guests on safari blue — sailing" },
  { seed: "zanzibar_ai_39", cat: "Experiences", alt: "Stone Town walking tour — group" },
  { seed: "zanzibar_ai_40", cat: "Experiences", alt: "Sunset dhow cruise — Stone Town coast" },
  { seed: "gallery-experience", cat: "Experiences", alt: "Guests tasting fruit — spice tour" },
  { seed: "zanzibar_ai_21", cat: "Experiences", alt: "Snorkeling — reef experience" },
  { seed: "zanzibar_ai_22", tall: true, cat: "Experiences", alt: "Island picnic — Safari Blue" },
];

const cats = ["All", "Stone Town", "Ocean", "Culture", "Food", "Nature", "People", "Experiences"];

export default function GalleryClient() {
  const [activeCat, setActiveCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = activeCat === "All" ? photos : photos.filter((p) => p.cat === activeCat);
  const current = open !== null ? filtered[open] : null;

  const next = () => setOpen((i) => (i === null ? 0 : (i + 1) % filtered.length));
  const prev = () => setOpen((i) => (i === null ? 0 : (i - 1 + filtered.length) % filtered.length));

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {cats.map((c) => {
          const count = c === "All" ? photos.length : photos.filter((p) => p.cat === c).length;
          return (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              aria-pressed={activeCat === c}
              className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors inline-flex items-center gap-1.5 ${activeCat === c ? "bg-clove-600 text-white border-clove-600 shadow-soft" : "bg-white border-stone-300 text-stone-700 hover:border-clove-300 hover:text-clove-700"}`}
            >
              {c} <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCat === c ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {filtered.map((p, idx) => (
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
            <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-stone-700 border border-stone-200/60">{p.cat}</span>
            <span className="absolute bottom-2 left-2 right-2 text-xs text-white/90 bg-indigo-900/30 backdrop-blur px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity line-clamp-1">{p.alt}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-stone-500">No photos in this category yet.</p>
      )}

      {open !== null && current && (
        <div className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur flex flex-col" role="dialog" aria-modal="true" aria-label="Gallery lightbox">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 text-white">
            <p className="text-sm">
              {current.alt} — {open + 1} / {filtered.length}
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
          <div className="px-6 pb-6 text-center text-xs text-stone-300">{current.cat} · {current.alt}</div>
        </div>
      )}
    </>
  );
}
