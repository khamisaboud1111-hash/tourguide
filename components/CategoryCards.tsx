"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { EXPERIENCE_CATEGORIES } from "@/lib/experience-categories";
import { resolveGallerySrc } from "@/lib/gallery-photos";
import { useLang } from "@/lib/i18n/context";

export default function CategoryCards({ counts }: { counts: Record<string, number> }) {
  const { t } = useLang();
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl md:text-3xl font-semibold">{t("browseByCategory")}</h2>
      <p className="mt-2 text-sm text-stone-600 max-w-xl">{t("browseByCategoryDesc")}</p>
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {EXPERIENCE_CATEGORIES.map((c) => {
          const n = counts[c.value] ?? 0;
          return (
            <Link
              key={c.value}
              href={`/tours?cat=${encodeURIComponent(c.value)}`}
              scroll={false}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] shadow-soft"
            >
              <Image
                src={resolveGallerySrc(c.image, 600, 800)}
                alt={t(c.labelKey)}
                fill
                sizes="(min-width:1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={c.image.startsWith("http")}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-4">
                <span className="block font-display text-base md:text-lg font-semibold text-white leading-snug">{t(c.labelKey)}</span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-stone-200">
                  {t("experiencesCount").replace("{n}", String(n))}
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
