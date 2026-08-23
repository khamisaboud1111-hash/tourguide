"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Heart, Gauge, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Tour } from "@/lib/tours";
import { placeholderPhoto } from "@/lib/placeholder";

function useFavorite(slug: string) {
  const key = `fav:${slug}`;
  const [fav, setFav] = useState(false);
  useEffect(() => {
    try {
      setFav(localStorage.getItem(key) === "1");
    } catch {}
  }, [key]);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    try {
      if (next) localStorage.setItem(key, "1");
      else localStorage.removeItem(key);
    } catch {}
  };
  return { fav, toggle };
}

export default function TourCard({ tour, featured = false }: { tour: Tour; featured?: boolean }) {
  const { fav, toggle } = useFavorite(tour.slug);

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 hover:border-stone-300 shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-emphasis ease-entrance ${featured ? "md:col-span-2" : ""}`}
    >
      <div className={`relative w-full overflow-hidden bg-stone-100 ${featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        <Image
          src={placeholderPhoto(tour.photoSeed, featured ? 1200 : 800, featured ? 750 : 600)}
          alt={tour.title}
          fill
          sizes={featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-entrance"
        />
        {/* top bar: category + favorite */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-medium text-clove-700 border border-stone-200/60 shadow-soft">
            {tour.category}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={fav}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition-colors ${fav ? "bg-clove-600 border-clove-600 text-white shadow-soft" : "bg-white/90 border-stone-200 text-stone-700 hover:text-clove-600"}`}
          >
            <Heart size={15} className={fav ? "fill-white" : ""} />
          </button>
        </div>
        {/* subtle gradient for text legibility if needed */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-display font-semibold text-stone-900 text-balance ${featured ? "text-xl md:text-2xl" : "text-lg leading-snug"}`}>
          {tour.title}
        </h3>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-2">{tour.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 border border-stone-200 px-2.5 py-1 text-stone-600">
            <Clock size={12} /> {tour.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 border border-stone-200 px-2.5 py-1 text-stone-600">
            <Users size={12} /> {tour.groupSize}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 border border-stone-200 px-2.5 py-1 text-stone-600">
            <Gauge size={12} /> {tour.difficulty}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <p className="font-display font-semibold text-lagoon-800">
            From ${tour.priceUsd}
            <span className="font-body font-normal text-stone-500 text-xs"> / person</span>
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-clove-700 group-hover:gap-1.5 transition-all">
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
