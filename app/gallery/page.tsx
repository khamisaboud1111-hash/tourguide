import type { Metadata } from "next";
import { business } from "@/lib/constants";
import GalleryClient from "@/components/GalleryClient";
import { getLang, tServer } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: `Gallery — ${business.name}`,
  description: "Zanzibar through a local lens — Stone Town, ocean, spice farms, people and the experiences themselves. Every photo has a story.",
};

export default function GalleryPage() {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);
  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-saffron-600 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("gallery")}</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-xl text-balance">{t("galleryTitle")}</h1>
      <p className="mt-3 text-stone-600 max-w-xl leading-relaxed">
        A visual journal — not stock, not filtered beyond recognition. Replace placeholders with real photos before launch via <code className="bg-stone-100 px-1 rounded">public/photos</code> per <span className="font-medium">PLACEHOLDER-IMAGES.md</span>. Categories filter the story.
      </p>
      <p className="mt-2 text-xs text-stone-500">Every meaningful photo carries alt text — decorative images alone use empty alt.</p>

      <div className="mt-10">
        <GalleryClient />
      </div>
    </div>
  );
}
