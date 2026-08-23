"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { Tour } from "@/lib/tours";

function useLeafletIconFix() {
  useEffect(() => {
    // @ts-expect-error — private Leaflet internal
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
}

export default function ExploreMap({ tours }: { tours: Tour[] }) {
  useLeafletIconFix();

  // Zanzibar center — fit all tour markers
  const center: [number, number] = [-6.1659, 39.2026];

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tours.map((t) => (
        <Marker key={t.slug} position={[t.coords.lat, t.coords.lng]}>
          <Popup>
            <div className="text-sm min-w-[180px]">
              <p className="font-semibold text-stone-900">{t.title}</p>
              <p className="text-stone-600 text-xs mt-1">{t.category} · {t.duration} · From ${t.priceUsd}</p>
              <p className="text-stone-600 text-xs mt-1 line-clamp-2">{t.summary}</p>
              <Link
                href={`/tours/${t.slug}`}
                className="inline-flex items-center gap-1 text-clove-600 text-xs font-medium mt-2 hover:underline"
              >
                View experience →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
