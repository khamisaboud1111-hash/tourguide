"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { galleryPhotos, resolveGallerySrc, type GalleryPhoto as Photo } from "@/lib/gallery-photos";
import { useLang } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

const photos: Photo[] = galleryPhotos;
export default function GalleryClient() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  const [dynamic, setDynamic] = useState<Photo[]>([]);

  const [hiddenSeeds, setHiddenSeeds] = useState<Set<string>>(new Set());

  // Load admin-uploaded media (Supabase storage) — appears in gallery after upload.
  // Also loads admin-hidden seeds so hidden photos stay off the live gallery.
  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("media_assets").select("public_url, alt_text, original_filename").order("created_at", { ascending: false }).limit(60),
      supabase.from("website_settings").select("value").eq("section", "gallery").eq("key", "hidden_seeds").maybeSingle(),
    ]).then(([{ data }, { data: hiddenRow }]) => {
      if (data) {
        const mapped: Photo[] = data
          .filter((r) => r.public_url)
          .map((r) => ({
            seed: r.public_url as string,
            cat: "Gallery",
            alt: (r.alt_text as string) || (r.original_filename as string) || "Gallery image",
          }));
        if (mapped.length) setDynamic(mapped);
      }
      const v: unknown = (hiddenRow as { value: unknown } | null)?.value;
      if (Array.isArray(v)) setHiddenSeeds(new Set(v.filter((x): x is string => typeof x === "string")));
    });
  }, []);

  const allPhotos = [...photos.filter((p) => !hiddenSeeds.has(p.seed)), ...dynamic];

  const next = () => setOpen((i) => (i === null ? 0 : (i + 1) % allPhotos.length));
  const prev = () => setOpen((i) => (i === null ? 0 : (i - 1 + allPhotos.length) % allPhotos.length));
  const current = open !== null ? allPhotos[open] : null;

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4 space-y-4 max-h-[85vh] overflow-y-auto pr-1 overscroll-contain">
        {allPhotos.map((p, idx) => (
          <button
            key={`${p.seed}-${idx}`}
            onClick={() => setOpen(idx)}
            className={`relative w-full overflow-hidden rounded-2xl break-inside-avoid group text-left ${p.tall ? "aspect-[3/4]" : "aspect-square"}`}
            aria-label={t("openPhoto").replace("{alt}", p.alt)}
          >
            <Image
              src={resolveGallerySrc(p.seed, 1200, p.tall ? 1600 : 1200)}
              alt={p.alt}
              fill
              sizes="(min-width:768px) 33vw, 50vw"
              className="object-cover"
              quality={90}
              unoptimized={p.seed.startsWith("http")}
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
            <Image src={resolveGallerySrc(current.seed, 3840, 2160)} alt={current.alt} fill className="object-contain p-4 md:p-10" sizes="100vw" quality={100} unoptimized={current.seed.startsWith("http")} />
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
