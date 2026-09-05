"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import ReportReviewButton from "@/components/ReportReviewButton";
import { maskName, countryWithFlag } from "@/lib/review-display";
import type { TourReview } from "@/lib/reviews";

type Labels = { verified: string; featured: string; adminResponse: string };

// Horizontal auto-moving reviews rail with arrows — when many reviews are
// published, visitors can cruise through them; arrows jump back/forward.
export default function ReviewsCarousel({ reviews, lang, labels }: { reviews: TourReview[]; lang: string; labels: Labels }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, reviews.length]);

  // Auto-move every 4s; pauses on hover/touch and when the tab is hidden.
  useEffect(() => {
    if (paused || reviews.length < 2) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || document.hidden) return;
      const card = el.querySelector<HTMLElement>("[data-review-card]");
      const w = (card?.offsetWidth ?? 320) + 16;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 16;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + w, behavior: "smooth" });
    }, 4000);
    return () => clearInterval(id);
  }, [paused, reviews.length]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const w = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: dir * w * 2, behavior: "smooth" });
  };

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 5000)}
    >
      <div className="mb-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? "Play" : "Pause"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 hover:border-clove-400 hover:text-clove-700 transition-colors"
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canPrev}
          aria-label="Previous reviews"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 hover:border-clove-400 hover:text-clove-700 transition-colors disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canNext}
          aria-label="Next reviews"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 hover:border-clove-400 hover:text-clove-700 transition-colors disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "thin" }}
      >
        {reviews.map((r) => (
          <figure key={r.id} data-review-card className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-8px)] rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <div className="text-saffron-500 text-sm" aria-label={`${r.rating} out of 5`}>
                {"★".repeat(r.rating)}
                <span className="text-stone-300">{"★".repeat(5 - r.rating)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {r.is_verified && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-lagoon-100 text-lagoon-800">✓ {labels.verified}</span>
                )}
                {r.is_featured && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-700">{labels.featured}</span>
                )}
              </div>
            </div>
            <blockquote className="mt-2 text-sm text-stone-700 leading-relaxed line-clamp-6">“{r.review}”</blockquote>
            {r.tour_title && <p className="mt-2 text-xs font-medium text-clove-700 truncate">{r.tour_title}</p>}
            {r.admin_response && (
              <div className="mt-3 rounded-xl bg-stone-50 border border-stone-200 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{labels.adminResponse}</p>
                <p className="mt-1 text-sm text-stone-700 leading-relaxed line-clamp-3">{r.admin_response}</p>
              </div>
            )}
            <figcaption className="mt-3 flex items-center justify-between gap-2 text-xs text-stone-500">
              <span className="flex items-center gap-2 min-w-0">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clove-100 text-clove-700 font-medium">{maskName(r.customer_name).charAt(0).toUpperCase()}</span>
                <span className="truncate">
                  <span className="font-medium text-stone-700">{maskName(r.customer_name)}</span>
                  {r.country ? ` · ${countryWithFlag(r.country)}` : ""} · {dateFmt(r.created_at)}
                </span>
              </span>
              <ReportReviewButton reviewId={r.id} />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
