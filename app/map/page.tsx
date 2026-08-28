import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getLang, tServer } from "@/lib/i18n/server";

function MapLoadingFallback() {
  const lang = (() => { try { return getLang(); } catch { return "en" as const; } })();
  const t = (k: string) => tServer(k, lang);
  return (
    <div className="h-full w-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-sm">
      {t("mapLoading")}
    </div>
  );
}

const ZanzibarMap = dynamic(() => import("@/components/ZanzibarMap"), {
  ssr: false,
  loading: () => <MapLoadingFallback />,
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
