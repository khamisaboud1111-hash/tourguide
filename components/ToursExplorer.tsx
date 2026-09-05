"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Tour } from "@/lib/tours";
import TourCard from "./TourCard";
import { useLang } from "@/lib/i18n/context";
import { EXPERIENCE_CATEGORIES } from "@/lib/experience-categories";

type SortKey = "recommended" | "duration";

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

export default function ToursExplorer({ tours }: { tours: Tour[] }) {
  const { t } = useLang();

  const searchParams = useSearchParams();
  const categories: { value: string; label: string }[] = [
    { value: "All", label: t("catAll") },
    ...EXPERIENCE_CATEGORIES.map((c) => ({ value: c.value, label: t(c.labelKey) })),
  ];
  const durations: { value: string; label: string; test: (t: Tour) => boolean }[] = [
    { value: "All durations", label: t("allDurations"), test: () => true },
    { value: "2–3 hours", label: t("hoursShort"), test: (tour) => parseDurationToMinutes(tour.duration) <= 180 },
    { value: "Half day", label: t("halfDay"), test: (tour) => parseDurationToMinutes(tour.duration) > 180 && parseDurationToMinutes(tour.duration) <= 300 },
    { value: "Full day", label: t("fullDay"), test: (tour) => parseDurationToMinutes(tour.duration) > 300 },
  ];
  const difficulties: { label: string; value: Tour["difficulty"] | "All" }[] = [
    { label: t("allLevels"), value: "All" },
    { label: t("easy"), value: "Easy" },
    { label: t("moderate"), value: "Moderate" },
    { label: t("active"), value: "Active" },
  ];
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [dur, setDur] = useState("All durations");
  const [diff, setDiff] = useState<Tour["difficulty"] | "All">("All");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [showFilters, setShowFilters] = useState(false);

  // Category cards link here with ?cat= — sync the filter on navigation.
  useEffect(() => {
    const c = searchParams.get("cat");
    if (c) {
      setCat(c);
      setShowFilters(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = tours.filter((t) => {
      const hitQ = !q || [t.title, t.category, t.summary, t.description, t.meetingPoint].join(" ").toLowerCase().includes(q);
      const hitCat = cat === "All" || t.category === cat;
      const hitDiff = diff === "All" || t.difficulty === diff;
      const durObj = durations.find((d) => d.value === dur);
      const hitDur = durObj ? durObj.test(t) : true;
      return hitQ && hitCat && hitDiff && hitDur;
    });

    if (sort === "duration") out = [...out].sort((a, b) => parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration));
    // recommended keeps DB order (created_at desc)
    return out;
  }, [tours, query, cat, dur, diff, sort]);

  const hasActiveFilter = cat !== "All" || dur !== "All durations" || diff !== "All" || query.length > 0;
  const clearAll = () => {
    setQuery("");
    setCat("All");
    setDur("All durations");
    setDiff("All");
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
              <button onClick={() => setQuery("")} aria-label={t("clearSearch")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X size={16} />
              </button>
            )}
          </label>

          <div className="flex gap-2 shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-3 text-sm outline-none focus:border-clove-500"
              aria-label={t("sortTours")}
            >
              <option value="recommended">{t("recommended")}</option>
              <option value="duration">{t("sortDuration")}</option>
            </select>

            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${showFilters || hasActiveFilter ? "bg-clove-50 border-clove-200 text-clove-700" : "bg-stone-50 border-stone-300 text-stone-700 hover:border-clove-300"}`}
            >
              <SlidersHorizontal size={16} /> {t("filters")} {hasActiveFilter && <span className="h-2 w-2 rounded-full bg-clove-600" />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid md:grid-cols-3 gap-4 border-t border-stone-100 pt-4 animate-fade-in">
            <label className="space-y-1.5">
              <span className="block text-xs font-medium text-stone-700">{t("experienceType")}</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-clove-500">
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-medium text-stone-700">{t("duration")}</span>
              <select value={dur} onChange={(e) => setDur(e.target.value)} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-clove-500">
                {durations.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-medium text-stone-700">{t("difficulty")}</span>
              <select value={diff} onChange={(e) => setDiff(e.target.value as Tour["difficulty"] | "All")} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-clove-500">
                {difficulties.map((d) => (
                  <option key={d.label} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {hasActiveFilter && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-stone-500">{filtered.length === 1 ? t("resultCountOne") : t("resultCount").replace(/\{n\}/, String(filtered.length))}</span>
            <button onClick={clearAll} className="inline-flex items-center gap-1 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-xs font-medium hover:bg-stone-200 transition-colors">
              {t("clearAll")} <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 md:p-12 text-center">
          <p className="font-display text-xl font-semibold">{t("noMatchTours")}</p>
          <p className="mt-2 text-stone-600 text-sm max-w-lg mx-auto">{t("noMatchToursDesc")}</p>
          <button onClick={clearAll} className="mt-5 inline-flex items-center gap-2 rounded-full bg-clove-600 text-stone-50 px-5 py-2.5 text-sm font-medium hover:bg-clove-700 transition-colors">
            {t("clearFilters")}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((t) => (
            <TourCard key={t.slug} tour={t} highlight={query} />
          ))}
        </div>
      )}
    </div>
  );
}
