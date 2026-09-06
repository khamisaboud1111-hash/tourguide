"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import MediaUploadForm from "./MediaUploadForm";
import { FolderBrowser, GalleryPreviewGrid, type GalleryPreviewItem, HeroFolder, type UploadItem } from "@/components/admin/media-client";
import { galleryPhotos, resolveGallerySrc } from "@/lib/gallery-photos";
import { HERO_SLIDES } from "@/lib/hero-slides";
import { placeholderPhoto } from "@/lib/placeholder";

import { dictionary, type Lang } from "@/lib/i18n/dictionary";

export const dynamic = "force-dynamic";

const folders = ["All", "Tours", "Hero", "Gallery", "Team", "Blog"];

// Folder prefix (storage_path "hero/...") -> display section in the library.
const FOLDER_SECTIONS: { prefix: string; title: string; hint: string }[] = [
  { prefix: "hero", title: "Hero images", hint: "Homepage hero candidates — open one and tap “Use as hero”." },
  { prefix: "gallery", title: "Gallery images", hint: "These appear on the live Gallery page automatically." },
  { prefix: "tours", title: "Tour / Experience images", hint: "Attached to tours and experiences across the site." },
  { prefix: "team", title: "Team images", hint: "Photos of the team." },
  { prefix: "blog", title: "Journal images", hint: "Used in journal posts." },
];

function folderOf(item: UploadItem): string {
  return item.storage_path.split("/")[0]?.toLowerCase() ?? "other";
}

// Simple i18n: lookup key in dictionary for given lang, fallback to English
function t(key: string, lang: Lang = "en" as Lang): string {
  return dictionary[lang]?.[key] ?? dictionary.en[key] ?? key;
}

export default function AdminMediaPage() {
  const [lang, setLang] = useState<Lang>("en");

  // Read lang from cookie on mount (client-side)
  useEffect(() => {
    try {
      const cookies = document.cookie.split("; ");
      const langCookie = cookies.find((c) => c.startsWith("lang="));
      if (langCookie) {
        const val = langCookie.split("=")[1];
        const allowed: Lang[] = ["en", "sw", "fr", "de", "it", "es", "zh", "ja", "ar", "ru", "pt", "nl"] as Lang[];
        if (allowed.includes(val as Lang)) setLang(val as Lang);
      }
    } catch {
      setLang("en");
    }
  }, []);

  const supabase = createClient();

  // Initial data fetch
  useEffect(() => {
    supabase.from("media_assets").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data ?? []);
    });
    // Load gallery hidden seeds
    supabase.from("website_settings").select("value").eq("section", "gallery").eq("key", "hidden_seeds").maybeSingle().then(({ data }) => {
      const v = data?.value;
      setHiddenSeeds(Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
    });
    // Load hero hidden seeds and override
    Promise.all([
      supabase.from("website_settings").select("value").eq("section", "hero").eq("key", "hidden_seeds").maybeSingle(),
      supabase.from("website_settings").select("value").eq("section", "homepage").eq("key", "hero_image_seed").maybeSingle(),
    ]).then(([heroHiddenRes, heroSettingRes]) => {
      const hv = heroHiddenRes?.data?.value;
      const ov = heroSettingRes?.data?.value;
      setHeroHiddenSeeds(Array.isArray(hv) ? hv.filter((x): x is string => typeof x === "string") : []);
      setHeroOverride(typeof ov === "string" && ov.startsWith("http") ? ov : null);
    });
  }, [lang]);

  // Real-time subscription for instant media library updates
  useEffect(() => {
    const mediaChannel = supabase
      .channel("media-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "media_assets" }, () => {
        supabase.from("media_assets").select("*").order("created_at", { ascending: false }).then(({ data }) => {
          setItems(data ?? []);
        });
      })
      .subscribe();

    const galleryChannel = supabase
      .channel("gallery-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "website_settings" }, () => {
        supabase.from("website_settings").select("value").eq("section", "gallery").eq("key", "hidden_seeds").maybeSingle().then(({ data }) => {
          const v = data?.value;
          setHiddenSeeds(Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
        });
        // Also refresh hero settings
        Promise.all([
          supabase.from("website_settings").select("value").eq("section", "hero").eq("key", "hidden_seeds").maybeSingle(),
          supabase.from("website_settings").select("value").eq("section", "homepage").eq("key", "hero_image_seed").maybeSingle(),
        ]).then(([heroHiddenRes, heroSettingRes]) => {
          const hv = heroHiddenRes?.data?.value;
          const ov = heroSettingRes?.data?.value;
          setHeroHiddenSeeds(Array.isArray(hv) ? hv.filter((x): x is string => typeof x === "string") : []);
          setHeroOverride(typeof ov === "string" && ov.startsWith("http") ? ov : null);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(mediaChannel);
      supabase.removeChannel(galleryChannel);
    };
  }, []);

  const [items, setItems] = useState<UploadItem[]>([]);
  const [hiddenSeeds, setHiddenSeeds] = useState<string[]>([]);
  const [heroHiddenSeeds, setHeroHiddenSeeds] = useState<string[]>([]);
  const [heroOverride, setHeroOverride] = useState<string | null>(null);
  const [galleryPhotosLocal, setGalleryPhotosLocal] = useState<GalleryPreviewItem[]>([]);

  // Fetch gallery photos once
  useEffect(() => {
    setGalleryPhotosLocal(galleryPhotos.map((p) => ({ seed: p.seed, src: resolveGallerySrc(p.seed, 400, 400), alt: p.alt, cat: p.cat })));
  }, []);

  const uploads = items;

  // Compute folders for FolderBrowser
  const folderSections = FOLDER_SECTIONS.map((section) => ({
    prefix: section.prefix,
    title: t(section.title, lang),
    hint: t(section.hint, lang),
    items: uploads.filter((u) => folderOf(u) === section.prefix),
    lang: lang,
  })).filter((f) => f.items.length > 0);

  const unknownItems = uploads.filter((u) => !FOLDER_SECTIONS.some((s) => folderOf(u) === s.prefix));
  const otherFolder = unknownItems.length > 0 ? [{ prefix: "other", title: t("Other", lang), hint: t("Uploads in other folders.", lang), items: unknownItems }] : [];

  const allFolders = [...folderSections, ...otherFolder];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminMediaLibrary", lang)}</h1>
        <span className="text-xs text-stone-500">{uploads.length} uploaded · {galleryPhotosLocal.length} in gallery</span>
      </div>

      <MediaUploadForm folders={folders} />

      <h2 className="font-display text-lg font-semibold mt-8 mb-3">Your uploads</h2>
      <p className="text-xs text-stone-500 mb-4">Grouped by folder — click any image to view it large. Deleting removes it everywhere live.</p>
      {uploads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-stone-600 font-medium">No media yet</p>
          <p className="text-sm text-stone-500 mt-1">{t("adminNoMediaInFolder", lang)} — upload real photos above.</p>
        </div>
      ) : (
        <FolderBrowser folders={allFolders} />
      )}

      <h2 className="font-display text-lg font-semibold mt-10 mb-3">Hero images folder</h2>
      <p className="text-xs text-stone-500 mb-4">Every slide rotating on the homepage right now — click the folder to view, delete any slide from rotation.</p>
      <HeroFolder
        slides={HERO_SLIDES.map((s) => ({ seed: s.seed, src: placeholderPhoto(s.seed, 640, 360), alt: s.alt }))}
        hiddenSeeds={heroHiddenSeeds}
        override={heroOverride}
      />

      <h2 className="font-display text-lg font-semibold mt-10 mb-3">Gallery images folder ({galleryPhotosLocal.length})</h2>
      <p className="text-xs text-stone-500 mb-4">Click any image to view it large — you can hide it from the site or show it again at any time.</p>
      <GalleryPreviewGrid
        items={galleryPhotosLocal}
        hiddenSeeds={heroHiddenSeeds}
      />
    </div>
  );
}