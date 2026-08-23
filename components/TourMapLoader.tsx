"use client";

import dynamic from "next/dynamic";

const TourMap = dynamic(() => import("./TourMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-2xl bg-stone-200 animate-pulse flex items-center justify-center text-stone-400 text-sm">
      Loading map…
    </div>
  ),
});

type Props = {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
};

export default function TourMapLoader(props: Props) {
  return <TourMap {...props} />;
}
