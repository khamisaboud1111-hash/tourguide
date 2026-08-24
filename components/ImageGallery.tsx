"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { placeholderPhoto } from "@/lib/placeholder";

export default function ImageGallery({ photos, title }: { photos: { src: string; alt: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((a) => (a === 0 ? photos.length - 1 : a - 1));
      if (e.key === "ArrowRight") setActive((a) => (a === photos.length - 1 ? 0 : a + 1));
      if (e.key === "Escape") setOpen(false);
    },
    [photos.length]
  );

  if (photos.length === 0) return null;

  const primary = photos[active] ?? photos[0];
  const thumbs = photos;

  return (
    <>
      {/* Desktop: large primary + thumbnails / Mobile: swipeable */}
      <div className="grid md:grid-cols-5 gap-3 md:gap-4">
        {/* Primary */}
        <div className="md:col-span-3 relative aspect-[16/11] md:aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 group">
          <Image
            src={primary.src}
            alt={primary.alt || title}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open gallery"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-white transition-colors shadow-soft"
          >
            <Expand size={14} /> {active + 1} / {photos.length}
          </button>
          {/* desktop arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setActive((a) => (a === 0 ? photos.length - 1 : a - 1))}
                aria-label="Previous image"
                className="hidden md:inline-flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-stone-200 text-stone-700 hover:bg-white shadow-soft"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActive((a) => (a === photos.length - 1 ? 0 : a + 1))}
                aria-label="Next image"
                className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-stone-200 text-stone-700 hover:bg-white shadow-soft"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Thumbs */}
        <div className="md:col-span-2 grid grid-cols-4 md:grid-cols-2 gap-3 md:gap-4">
          {thumbs.slice(0, 4).map((p, i) => (
            <button
              key={p.src + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl border-2 transition-colors ${i === active ? "border-clove-500" : "border-transparent hover:border-stone-300"}`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={p.src} alt={p.alt} fill sizes="(min-width:768px) 20vw, 25vw" className="object-cover" />
              {i === 3 && thumbs.length > 4 && (
                <span className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center text-white text-sm font-medium">
                  +{thumbs.length - 4} more
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile dots */}
      {photos.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 md:hidden">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-clove-600" : "w-1.5 bg-stone-300"}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          tabIndex={-1}
          onKeyDown={onKey}
          autoFocus
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-4 text-stone-100">
            <p className="text-sm font-medium">{title} â€” {active + 1} / {photos.length}</p>
            <button onClick={() => setOpen(false)} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
            <Image src={primary.src} alt={primary.alt} fill className="object-contain p-4 md:p-8" sizes="100vw" />
            {photos.length > 1 && (
              <>
                <button onClick={() => setActive((a) => (a === 0 ? photos.length - 1 : a - 1))} aria-label="Previous" className="absolute left-4 md:left-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setActive((a) => (a === photos.length - 1 ? 0 : a + 1))} aria-label="Next" className="absolute right-4 md:right-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          <div className="px-4 md:px-6 pb-6">
            <div className="mx-auto max-w-3xl flex gap-2 overflow-x-auto no-scrollbar">
              {photos.map((p, i) => (
                <button key={p.src + i} onClick={() => setActive(i)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? "border-white" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
