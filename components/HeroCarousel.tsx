"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { placeholderPhoto } from "@/lib/placeholder";
import { createClient } from "@/lib/supabase/client";

import { HERO_SLIDES } from "@/lib/hero-slides";

const SAFARI_HERO_SEEDS = HERO_SLIDES.map((s) => s.seed);

export default function HeroCarousel({ overrideSeed }: { overrideSeed?: string }) {
  const [index, setIndex] = useState(0);
  const [hiddenSeeds, setHiddenSeeds] = useState<Set<string>>(new Set());

  // Slides the admin deleted in the Media Library stay out of rotation.
  useEffect(() => {
    createClient()
      .from("website_settings")
      .select("value")
      .eq("section", "hero")
      .eq("key", "hidden_seeds")
      .maybeSingle()
      .then(({ data }) => {
        const v: unknown = (data as { value: unknown } | null)?.value;
        if (Array.isArray(v)) setHiddenSeeds(new Set(v.filter((x): x is string => typeof x === "string")));
      });
  }, []);

  // Admin override: a full uploaded image URL (set via Media Library "Use as hero")
  // replaces the carousel with that single image. Otherwise the safari_blue carousel plays.
  const overrideUrl = overrideSeed?.startsWith("http") ? overrideSeed : null;
  const seeds = overrideUrl ? [overrideUrl] : SAFARI_HERO_SEEDS.filter((s) => !hiddenSeeds.has(s));
  const safeSeeds = seeds.length > 0 ? seeds : SAFARI_HERO_SEEDS.slice(0, 1);

  useEffect(() => {
    if (seeds.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % seeds.length);
    }, 3000);
    return () => clearInterval(id);
  }, [seeds.length]);

  // Perf: only mount the visible slide + preload the next one. Mounting all 9
  // full-screen images at once (~8MB) made the homepage crawl on mobile data.
  const visible = new Set([index % safeSeeds.length, (index + 1) % safeSeeds.length]);

  return (
    <div className="absolute inset-0">
      {safeSeeds.map((seed, i) => {
        if (!visible.has(i)) return null;
        const src = seed.startsWith("http") || seed.startsWith("/") ? seed : placeholderPhoto(seed, 1920, 1080);
        return (
          <Image
            key={seed}
            src={src}
            alt={`Hero ${i + 1}`}
            fill
            priority={i === 0}
            sizes="100vw"
            quality={85}
            className={`object-cover transition-opacity duration-700 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
            unoptimized={seed.startsWith("http")}
          />
        );
      })}
    </div>
  );
}
