"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Tour } from "@/lib/tours";
import TourCard from "./TourCard";
import { useLang } from "@/lib/i18n/context";

type SortKey = "recommended" | "price-asc" | "price-desc" | "duration";

function parseDurationToMinutes(s: string): number {
  const low = s.toLowerCase();
  if (low.includes("full")) return 480;
  if (low.includes("half")) return 240;
  const hours = low.match(/(\d+(?:\.\d+)?)\s*hours?/);
  if (hours) return Math.round(parseFloat(hours[1]) * 60);
  const hrs = low.match(/(\d+)\s*h/);
  if (hrs) return parseInt(hrs[1]) * 60;
  return 180;
}

const categories = ["All", "Culture & History", "Culture & Nature", "Ocean & Sailing", "Nature & Wildlife", "Ocean & Wildlife"];
const durations: { label: string; test: (t: Tour) => boolean }[] = [
  { label: "All durations", test: () => true },
  { label: "2–3 hours", test: (t) => parseDurationToMinutes(t.duration) <= 180 },
  { label: "Half day", test: (t) => parseDurationToMinutes(t.duration) > 180 && parseDurationToMinutes(t.duration) <= 300 },
  { label: "Full day", test: (t) => parseDurationToMinutes(t.duration) > 300 },
];
const difficulties: { label: string; value: Tour["difficulty"] | "All" }[] = [
  { label: "All levels", value: "All" },
  { label: "Easy", value: "Easy" },
  { label: "Moderate", value: "Moderate" },
  { label: "Active", value: "Active" },
];

export default function ToursExplorer({ tours }: { tours: Tour[] }) {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [dur, setDur] = useState("All durations");
  const [diff, setDiff] = useState<Tour["difficulty"] | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = tours.filter((t) => {
      const hitQ = !q || [t.title, t.category, t.summary, t.description, t.meetingPoint].join(" ").toLowerCase().includes(q);
      const hitCat = cat === "All" || t.category === cat;
      const hitDiff = diff === "All" || t.difficulty === diff;
      const durObj = durations.find((d) => d.label === dur);
      const hitDur = durObj ? durObj.test(t) : true;
      const hitPrice = maxPrice === null || t.priceUsd <= maxPrice;
      return hitQ && hitCat && hitDiff && hitDur && hitPrice;
    });

    if (sort === "price-asc") out = [...out].sort((a, b) => a.priceUsd - b.priceUsd);
    else if (sort === "price-desc") out = [...out].sort((a, b) => b.priceUsd - a.priceUsd);
    else if (sort === "duration") out = [...out].sort((a, b) => parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration));
    // recommended keeps DB order (created_at desc)
    return out;
  }, [tours, query, cat, dur, diff, maxPrice, sort]);

  const hasActiveFilter = cat !== "All" || dur !== "All durations" || diff !== "All" || maxPrice !== null || query.length > 0;
  const clearAll = () => {
    setQuery("");
    setCat("All");
    setDur("All durations");
    setDiff("All");
    setMaxPrice(null);
    setSort("recommended");
  };

  return (
    <div>
      {/* Search + controls */}
      <div className="rounded-2xl bg-white border border-stone-200 shadow-soft p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <label className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchTours")}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 pl-10 pr-10 py-3 text-sm outline-none focus:border-clove-500 focus:ring-2 focus:ring-clove-500/15 transition-colors"
              aria-label={t("searchTours")}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X size={16} />
              </button>
            )}
          </label>

          <div className="flex gap-2 shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-3 text-sm outline-none focus:border-clove-500"
              aria-label="Sort tours"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="duration">Duration</option>
            </select>

            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${showFilters || hasActiveFilter ? "bg-clove-50 border-clove-200 text-clove-700" : "bg-stone-50 border-stone-300 text-stone-700 hover:border-clove-300"}`}
            >
              <SlidersHorizontal size={16} /> Filters {hasActiveFilter && <span className="h-2 w-2 rounded-full bg-clove-600" />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid md:grid-cols-4 gap-4 border-t border-stone-100 pt-4 animate-fade-in">
            <label className="space-y-1.5">
              <span className="block text-xs font-medium text-stone-700">Experience type</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-clove-500">
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-medium text-stone-700">Duration</span>
              <select value={dur} onChange={(e) => setDur(e.target.value)} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-clove-500">
                {durations.map((d) => (
                  <option key={d.label} value={d.label}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-medium text-stone-700">Difficulty</span>
              <select value={diff} onChange={(e) => setDiff(e.target.value as Tour["difficulty"] | "All")} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-clove-500">
                {difficulties.map((d) => (
                  <option key={d.label} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-medium text-stone-700">Max price — {maxPrice ? `$${maxPrice}` : "Any"}</span>
              <input
                type="range"
                min={20}
                max={120}
                step={5}
                value={maxPrice ?? 120}
                onChange={(e) => setMaxPrice(parseInt(e.target.value) >= 120 ? null : parseInt(e.target.value))}
                className="w-full accent-clove-600"
              />
              <div className="flex justify-between text-[11px] text-stone-500"><span>$20</span><span>$120</span></div>
            </label>
          </div>
        )}

        {hasActiveFilter && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-stone-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <button onClick={clearAll} className="inline-flex items-center gap-1 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-xs font-medium hover:bg-stone-200 transition-colors">
              Clear all <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 md:p-12 text-center">
          <p className="font-display text-xl font-semibold">No experiences match your filters.</p>
          <p className="mt-2 text-stone-600 text-sm max-w-lg mx-auto">Try broadening the search, clearing filters, or message on WhatsApp for a custom suggestion.</p>
          <button onClick={clearAll} className="mt-5 inline-flex items-center gap-2 rounded-full bg-clove-600 text-stone-50 px-5 py-2.5 text-sm font-medium hover:bg-clove-700 transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((t) => (
            <TourCard key={t.slug} tour={t} />
          ))}
        </div>
      )}
    </div>
  );
}
