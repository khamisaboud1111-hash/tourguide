"use client";

import dynamic from "next/dynamic";

const ExploreMap = dynamic(() => import("./ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-sm">
      Loading Zanzibar mapâ€¦
    </div>
  ),
});

import type { Tour } from "@/lib/tours";
export default function ExploreMapLoader({ tours }: { tours: Tour[] }) {
  return <ExploreMap tours={tours} />;
}
