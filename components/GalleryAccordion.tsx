"use client";

import AccordionGallery from "@/components/react-bits/AccordionGallery/AccordionGallery";
import { placeholderPhoto } from "@/lib/placeholder";
import { useLang } from "@/lib/i18n/context";

type Item = { image: string; label: string };

const items: Item[] = [
  { image: placeholderPhoto("gallery-stonetown-door", 900, 1200), label: "Stone Town" },
  { image: placeholderPhoto("gallery-beach-sandbank", 900, 1200), label: "Sandbank" },
  { image: placeholderPhoto("gallery-dhow-sailing", 900, 1200), label: "Dhow" },
  { image: placeholderPhoto("gallery-spice-farm", 900, 1200), label: "Spice farm" },
  { image: placeholderPhoto("gallery-alley", 900, 1200), label: "Alleys" },
];

export default function GalleryAccordion() {
  const { t } = useLang();
  return (
    <div className="mb-4">
      <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-stone-400 mb-3">{t("featuredMoments")}</p>
      <AccordionGallery items={items} trigger="hover" gap={10} height={340} />
    </div>
  );
}