"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { placeholderPhoto } from "@/lib/placeholder";

const SAFARI_HERO_SEEDS = [
  "safari_blue_01",
  "safari_blue_02",
  "safari_blue_03",
  "safari_blue_04",
  "safari_blue_05",
  "safari_blue_06",
  "safari_blue_07",
  "safari_blue_08",
  "safari_blue_09",
  "safari_blue_10",
  "safari_blue_11",
];

export default function HeroCarousel({ overrideSeed }: { overrideSeed?: string }) {
  const [index, setIndex] = useState(0);

  // Strict: only use images from C:\Users\hp\OneDrive\Desktop\safari blue (11 files) — no other hero
  const seeds = SAFARI_HERO_SEEDS;

  useEffect(() => {
    if (seeds.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % seeds.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0">
      {seeds.map((seed, i) => {
        const src = seed.startsWith("http") || seed.startsWith("/") ? seed : placeholderPhoto(seed, 3840, 2160);
        return (
          <Image
            key={seed}
            src={src}
            alt={`Hero ${i + 1}`}
            fill
            priority={i === 0}
            sizes="100vw"
            quality={100}
            className={`object-cover transition-opacity duration-700 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
            unoptimized={false}
          />
        );
      })}
    </div>
  );
}
