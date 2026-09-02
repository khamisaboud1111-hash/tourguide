"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLang } from "@/lib/i18n/context";

// Leaflet's default marker icons reference image paths that don't survive
// bundling — this points them at a CDN so pins actually render.
function useLeafletIconFix() {
  useEffect(() => {
    // @ts-expect-error — _getIconUrl is a private Leaflet internal we need to clear
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
}

type Props = {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
};

const STREET_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const SATELLITE_TILES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export default function TourMap({ lat, lng, label, zoom = 13 }: Props) {
  useLeafletIconFix();
  const { t } = useLang();
  const [base, setBase] = useState<"street" | "satellite">("street");

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full rounded-2xl"
      >
        <TileLayer
          attribution={
            base === "satellite"
              ? "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={base === "satellite" ? SATELLITE_TILES : STREET_TILES}
          maxZoom={base === "satellite" ? 19 : 18}
        />
        <Marker position={[lat, lng]}>
          <Tooltip direction="top" offset={[0, -32]} permanent>
            <span className="font-medium text-xs">{label}</span>
          </Tooltip>
          <Popup>
            <div className="text-sm font-semibold text-stone-900">{label}</div>
            <div className="text-xs text-stone-600 mt-1">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Satellite toggle — same UX as ZanzibarMap */}
      <div className="absolute top-2 left-2 z-[400] flex rounded-lg bg-white/95 backdrop-blur border border-stone-200 shadow-card p-1 gap-1">
        {(
          [
            { key: "street", label: t("mapView") },
            { key: "satellite", label: t("satelliteView") },
          ] as const
        ).map((b) => (
          <button
            key={b.key}
            type="button"
            onClick={() => setBase(b.key)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              base === b.key ? "bg-clove-600 text-white" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
