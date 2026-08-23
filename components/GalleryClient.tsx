"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { placeholderPhoto } from "@/lib/placeholder";

type Photo = { seed: string; tall?: boolean; cat: string; alt: string };

const photos: Photo[] = [
  { seed: "gallery-stonetown-door", tall: true, cat: "Stone Town", alt: "Carved Zanzibar door in Stone Town" },
  { seed: "gallery-spice-farm", cat: "Food", alt: "Spices laid out on a Zanzibar farm" },
  { seed: "gallery-dhow-sailing", cat: "Ocean", alt: "Dhow sailing off Zanzibar" },
  { seed: "gallery-beach-sandbank", tall: true, cat: "Ocean", alt: "White sandbank and turquoise water" },
  { seed: "gallery-colobus-monkey", cat: "Nature", alt: "Red colobus monkey in Jozani forest" },
  { seed: "gallery-sunset", cat: "Ocean", alt: "Sunset over the Indian Ocean" },
  { seed: "gallery-market", cat: "Culture", alt: "Busy market stall in Zanzibar" },
  { seed: "gallery-reef-snorkel", tall: true, cat: "Ocean", alt: "Snorkeling over a reef" },
  { seed: "gallery-alley", cat: "Stone Town", alt: "Narrow Stone Town alley in morning light" },
  { seed: "gallery-spice-harvest", cat: "Food", alt: "Harvesting spices in shade" },
  { seed: "gallery-people", cat: "People", alt: "Local guide speaking with guests" },
  { seed: "gallery-experience", cat: "Experiences", alt: "Guests tasting fruit on a tour" },
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
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            aria-pressed={activeCat === c}
            className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${activeCat === c ? "bg-clove-600 text-white border-clove-600 shadow-soft" : "bg-white border-stone-300 text-stone-700 hover:border-clove-300 hover:text-clove-700"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {filtered.map((p, idx) => (
          <button
            key={p.seed}
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
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-stone-500">Our Zanzibar journal is coming soon — no photos in this category yet.</p>
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
          <div className="px-6 pb-6 text-center text-xs text-stone-300">{current.cat} · Use arrow keys or swipe to navigate · Esc to close</div>
        </div>
      )}
    </>
  );
}
