"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { Tour } from "@/lib/tours";
import { placeholderPhoto } from "@/lib/placeholder";
import { useLang } from "@/lib/i18n/context";

const STREET_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const SATELLITE_TILES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

// Self-hosted marker icons failed in some regions; use the CDN copies (allowed by CSP).
const ICON = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Real Zanzibar tourism sites (well-known public locations)
type Site = {
  name: string;
  coords: [number, number];
  category: string;
  desc: string;
  seed: string;
  tourSlug?: string;
};

const SITES: Site[] = [
  { name: "Stone Town", coords: [-6.163, 39.1892], category: "Culture", desc: "UNESCO old town — carved doors, bazaars, House of Wonders, Forodhani night market.", seed: "sitmeir_real_11", tourSlug: "stone-town-walking-tour" },
  { name: "Darajani Market", coords: [-6.1633, 39.1948], category: "Culture", desc: "The island's busiest bazaar — spices, fabrics, and daily Zanzibar life.", seed: "gallery-market" },
  { name: "Forodhani Gardens", coords: [-6.1618, 39.1908], category: "Food", desc: "Waterfront gardens famous for the evening street-food market.", seed: "zanzibar_ai_24" },
  { name: "Spice Farms (Kizimbani)", coords: [-6.1273, 39.2544], category: "Food", desc: "Clove, vanilla, cinnamon and nutmeg — the original Spice Island farms.", seed: "zanzibar_ai_04", tourSlug: "spice-farm-tour" },
  { name: "Jozani Forest", coords: [-6.2664, 39.3903], category: "Nature", desc: "Zanzibar's only national park — red colobus monkeys and mangrove boardwalks.", seed: "zanzibar_ai_16", tourSlug: "jozani-forest-tour" },
  { name: "Prison Island (Changuu)", coords: [-6.0622, 39.1722], category: "Ocean", desc: "Short boat ride from Stone Town — giant Aldabra tortoises and snorkeling.", seed: "zanzibar_ai_11", tourSlug: "prison-island-tour" },
  { name: "Nakupenda Sandbank", coords: [-6.095, 39.185], category: "Ocean", desc: "Blinding white sandbank that appears at low tide — swimming and seafood.", seed: "gallery-beach-sandbank" },
  { name: "Fumba (Safari Blue)", coords: [-6.3036, 39.3231], category: "Ocean", desc: "Departure point for the full-day dhow, snorkeling and sandbank safari.", seed: "zanzibar_ai_08", tourSlug: "safari-blue" },
  { name: "Mnemba Atoll", coords: [-5.815, 39.3853], category: "Ocean", desc: "Protected atoll with the island's best reef snorkeling and dolphins.", seed: "zanzibar_mnemba_island" },
  { name: "Kendwa", coords: [-5.7472, 39.2889], category: "Beach", desc: "Famous for full-moon parties and a swim-friendly beach at any tide.", seed: "sitmeir_real_08" },
  { name: "Nungwi", coords: [-5.7258, 39.2997], category: "Beach", desc: "North-coast village — dhow builders, sunset cruises and calm swimming water.", seed: "sitmeir_real_01", tourSlug: "sunset-dhow-cruise" },
  { name: "Paje", coords: [-6.3164, 39.3553], category: "Beach", desc: "Kitesurfing capital on the southeast coast, with a laid-back beach scene.", seed: "sitmeir_real_03" },
  { name: "Jambiani", coords: [-6.3828, 39.3664], category: "Beach", desc: "Quiet fishing village with long white beaches and seaweed farms.", seed: "zanzibar_ai_15" },
  { name: "Kizimkazi", coords: [-6.4528, 39.3492], category: "Ocean", desc: "Southern fishing village — dolphin tours and the 12th-century mosque.", seed: "zanzibar_ai_13" },
];

/** Enable scroll-zoom after the user clicks/touches the map once. */
function ScrollZoomOnClick() {
  const map = useMap();
  useMapEvents({
    click: () => map.scrollWheelZoom.enable(),
    mouseout: () => map.scrollWheelZoom.disable(),
  });
  return null;
}

/** Fit the view to every marker on mount + re-render tiles on container resize. */
function MapSetup({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    // Leaflet sometimes initializes before the container settles — invalidate after paint
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points).pad(0.12));
    } else if (points.length === 1) {
      map.setView(points[0], 12);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [map, points]);
  useMapEvents({
    click: () => map.scrollWheelZoom.enable(),
    mouseout: () => map.scrollWheelZoom.disable(),
  });
  return null;
}

function SitePopup({ site, tour }: { site: Site; tour?: Tour }) {
  const { t } = useLang();
  return (
    <div className="w-[240px]">
      <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={placeholderPhoto(site.seed, 480, 270)} alt={site.name} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute top-1.5 left-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-stone-700 border border-stone-200">
          {site.category}
        </span>
      </div>
      <p className="font-semibold text-stone-900 text-sm">{site.name}</p>
      <p className="text-stone-600 text-xs mt-1 leading-relaxed">{site.desc}</p>
      {tour ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs text-stone-500">{tour.meetingPoint} · {tour.duration}</span>
          <Link href={`/tours/${tour.slug}`} className="inline-flex items-center gap-1 rounded-full bg-clove-600 text-white px-3 py-1 text-xs font-medium hover:bg-clove-700 transition-colors">
            {t("viewTourLink")}
          </Link>
        </div>
      ) : (
        <Link href="/tours" className="inline-flex items-center gap-1 text-clove-600 text-xs font-medium mt-2 hover:underline">
          {t("findTourHere")}
        </Link>
      )}
    </div>
  );
}

export default function ExploreMap({ tours }: { tours: Tour[] }) {
  const { t } = useLang();
  const tourBySlug = useMemo(() => new Map(tours.map((t) => [t.slug, t])), [tours]);
  const allPoints = useMemo<[number, number][]>(
    () => [...SITES.map((s) => s.coords), ...tours.map((t) => [t.coords.lat, t.coords.lng] as [number, number])],
    [tours]
  );
  const [base, setBase] = useState<"street" | "satellite">("street");

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-6.1659, 39.2026]}
        zoom={10}
        minZoom={8}
        maxZoom={17}
        scrollWheelZoom={false}
        zoomControl={true}
        className="leaflet-container-full"
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
        <MapSetup points={allPoints} />

        {/* Tourism site pins — place name also shown as tooltip */}
        {SITES.map((s) => (
          <Marker key={`site-${s.name}`} position={s.coords} title={s.name} icon={ICON}>
            <Tooltip direction="top" offset={[0, -28]}>
              <span className="text-xs font-medium">{s.name}</span>
            </Tooltip>
            <Popup maxWidth={260}>
              <SitePopup site={s} tour={s.tourSlug ? tourBySlug.get(s.tourSlug) : undefined} />
            </Popup>
          </Marker>
        ))}

        {/* Tour meeting points (from the database) — label pinned on map */}
        {tours.map((tour) => (
          <Marker key={`tour-${tour.slug}`} position={[tour.coords.lat, tour.coords.lng]} title={tour.title} opacity={0.95}>
            <Tooltip direction="top" offset={[0, -32]} permanent={false}>
              <span className="text-xs font-medium">{tour.meetingPoint}</span>
            </Tooltip>
            <Popup maxWidth={240}>
              <div className="text-sm w-[210px]">
                <p className="font-semibold text-stone-900">{tour.title}</p>
                <p className="text-stone-600 text-xs mt-1">
                  {tour.meetingPoint} · {tour.duration}
                </p>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="inline-flex items-center gap-1 text-clove-600 text-xs font-medium mt-2 hover:underline"
                >
                  {t("viewExperienceArrow")}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Satellite toggle */}
      <div className="absolute top-4 left-4 z-[500] flex rounded-lg bg-white/95 backdrop-blur border border-stone-200 shadow-card p-1 gap-1">
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
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
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
