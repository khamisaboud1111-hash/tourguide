import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ZanzibarMap = dynamic(() => import("@/components/ZanzibarMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-sm">
      Loading the Zanzibar map…
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Zanzibar Tour Map — Unguja Attractions | Sitmeir Tours",
  description:
    "An interactive map of Zanzibar (Unguja) with every tourist attraction — beaches, towns, parks and landmarks — with photos and a satellite view.",
};

export default function MapPage() {
  return (
    <div className="relative h-[calc(100vh-72px)] min-h-[520px] w-full">
      <ZanzibarMap />
    </div>
  );
}
