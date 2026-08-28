import type { Metadata } from "next";
import { business } from "@/lib/constants";
import GalleryClient from "@/components/GalleryClient";
import GalleryAccordion from "@/components/GalleryAccordion";
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
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">{t("gallery")}</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-xl text-balance">{t("galleryTitle")}</h1>
      <p className="mt-3 text-stone-600 max-w-xl leading-relaxed">
        {t("postcardsFromTours")}
      </p>

      <div className="mt-10">
        <GalleryAccordion />
        <GalleryClient />
      </div>
    </div>
  );
}
