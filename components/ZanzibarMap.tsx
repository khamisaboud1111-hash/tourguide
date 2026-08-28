"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { placeholderPhoto } from "@/lib/placeholder";

const ICON = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Attraction = {
  name: string;
  coords: [number, number];
  category: string;
  desc: string;
  image: string;
  fallbackSeed: string;
};

const WM = "https://upload.wikimedia.org/wikipedia/commons/thumb";

// Real photos from Wikimedia Commons (Unguja's tourist attractions).
const ATTRACTIONS: Attraction[] = [
  {
    name: "Stone Town",
    coords: [-6.1627, 39.1892],
    category: "Culture",
    desc: "UNESCO World Heritage old town — winding coral-stone alleys, carved Zanzibari doors, bazaars and rooftop cafés.",
    image: `${WM}/1/11/Puerto_de_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_02.jpg/500px-Puerto_de_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_02.jpg`,
    fallbackSeed: "sitmeir_real_11",
  },
  {
    name: "House of Wonders (Beit al-Ajaib)",
    coords: [-6.1609, 39.1896],
    category: "Culture",
    desc: "Barghash's grand 1883 palace on the seafront — Stone Town's tallest and first building with electricity and an elevator.",
    image: `${WM}/7/71/House_of_Wonders%2C_Stone_Town.jpg/500px-House_of_Wonders%2C_Stone_Town.jpg`,
    fallbackSeed: "stonetown_real_04",
  },
  {
    name: "Old Fort (Ngome Kongwe)",
    coords: [-6.1621, 39.1895],
    category: "Culture",
    desc: "17th-century Omani fort on Mizingani Road housing a cultural centre, courtyard cafés and an amphitheatre.",
    image: `${WM}/5/58/Old_Fort_Zanzibar%2C_2010.jpg/500px-Old_Fort_Zanzibar%2C_2010.jpg`,
    fallbackSeed: "stonetown_real_05",
  },
  {
    name: "Christ Church Cathedral (St. Monica's)",
    coords: [-6.1635, 39.1936],
    category: "Culture",
    desc: "Anglican cathedral built on the site of the old slave market — its altar marks where the whipping post stood.",
    image: `${WM}/b/b1/Christ_Church_Stone_Town_Zanzibar.jpg/500px-Christ_Church_Stone_Town_Zanzibar.jpg`,
    fallbackSeed: "stonetown_real_14",
  },
  {
    name: "Darajani Market",
    coords: [-6.1633, 39.1948],
    category: "Culture",
    desc: "Stone Town's busiest bazaar — piles of spices, fresh fish, meat and produce in the heart of the old town.",
    image: `${WM}/f/ff/Darajani_Market_%2CZanzibar.jpg/500px-Darajani_Market_%2CZanzibar.jpg`,
    fallbackSeed: "gallery-market",
  },
  {
    name: "Forodhani Gardens",
    coords: [-6.1618, 39.1908],
    category: "Food",
    desc: "Waterfront seafront gardens famed for the nightly street-food market — Zanzibar pizza, seafood kebabs and sugarcane juice.",
    image: `${WM}/d/db/Forodhani_jubilee_gardens_Zanzibar.jpg/500px-Forodhani_jubilee_gardens_Zanzibar.jpg`,
    fallbackSeed: "zanzibar_ai_24",
  },
  {
    name: "Spice Farms (Kizimbani / Kidichi)",
    coords: [-6.1273, 39.2544],
    category: "Food",
    desc: "The original Spice Island plantations — guided tours tasting clove, vanilla, cinnamon, nutmeg and cardamom.",
    image: `${WM}/b/bf/Spice_farm%2C_Zanzibar.jpg/500px-Spice_farm%2C_Zanzibar.jpg`,
    fallbackSeed: "spice-farm",
  },
  {
    name: "Jozani Forest (Jozani-Chwaka Bay NP)",
    coords: [-6.2664, 39.3903],
    category: "Nature",
    desc: "Zanzibar's only national park — home to the red colobus monkey and mangrove boardwalks above the bay.",
    image: `${WM}/1/1f/Colobo_rojo_de_Zanz%C3%ADbar_%28Piliocolobus_kirkii%29%2C_parque_nacional_de_la_Bah%C3%ADa_Jozani_Chwaka%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-06-02%2C_DD_17.jpg/500px-Colobo_rojo_de_Zanz%C3%ADbar_%28Piliocolobus_kirkii%29%2C_parque_nacional_de_la_Bah%C3%ADa_Jozani_Chwaka%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-06-02%2C_DD_17.jpg`,
    fallbackSeed: "jozani-forest",
  },
  {
    name: "Prison Island (Changuu)",
    coords: [-6.1206, 39.1698],
    category: "Ocean",
    desc: "Offshore island once a quarantine station — giant Aldabra tortoises, a historic prison and calm coral snorkelling.",
    image: `${WM}/7/7e/Aldabra_giant_tortoises_on_Changuu.jpg/500px-Aldabra_giant_tortoises_on_Changuu.jpg`,
    fallbackSeed: "prisonisland-1",
  },
  {
    name: "Nakupenda Sandbank",
    coords: [-6.095, 39.185],
    category: "Ocean",
    desc: "A blinding white sandbar that appears at low tide off Stone Town — barbecue lunch, swimming and shallow turquoise water.",
    image: `${WM}/e/e2/PAJE%2C_Zanzibar.jpg/500px-PAJE%2C_Zanzibar.jpg`,
    fallbackSeed: "gallery-beach-sandbank",
  },
  {
    name: "Safari Blue (Fumba / Menai Bay)",
    coords: [-6.3036, 39.3231],
    category: "Ocean",
    desc: "Full-day dhow adventure from Fumba — Menai Bay Conservation Area, snorkelling and lagoon sandbanks.",
    image: `${WM}/9/97/Course_de_bateaux_Jambiani%2C_Zanzibar_3.jpg/500px-Course_de_bateaux_Jambiani%2C_Zanzibar_3.jpg`,
    fallbackSeed: "safariblue-1",
  },
  {
    name: "Kizimkazi (Dolphin Tours & Ancient Mosque)",
    coords: [-6.4528, 39.3492],
    category: "Ocean",
    desc: "Southern fishing village for dolphin-spotting boat trips and the 12th-century Kizimkazi Mosque, one of East Africa's oldest.",
    image: `${WM}/3/35/Calligraphy_at_historic_Kizimkazi_Mosque%2C_Kusini_DC%2C_South_Zanzibar%2C_Tanzania.jpg/500px-Calligraphy_at_historic_Kizimkazi_Mosque%2C_Kusini_DC%2C_South_Zanzibar%2C_Tanzania.jpg`,
    fallbackSeed: "zanzibar_ai_13",
  },
  {
    name: "Mnemba Atoll (Mnemba Island)",
    coords: [-5.815, 39.3853],
    category: "Ocean",
    desc: "Iconic private island atoll with Unguja's best reef snorkelling, diving and seasonal dolphin pods.",
    image: `${WM}/a/ae/Mnemba_Island_-_Zanzibar_-_Flickr_-_Jorge_Lascar.jpg/500px-Mnemba_Island_-_Zanzibar_-_Flickr_-_Jorge_Lascar.jpg`,
    fallbackSeed: "zanzibar_mnemba_island",
  },
  {
    name: "Nungwi",
    coords: [-5.7258, 39.2997],
    category: "Beach",
    desc: "North-coast village of dhow builders — sunset dhows, the Mnarani turtles and swim-friendly calm water.",
    image: `${WM}/f/f5/Nungwi-Beach-Zanzibar.jpg/500px-Nungwi-Beach-Zanzibar.jpg`,
    fallbackSeed: "sitmeir_real_01",
  },
  {
    name: "Kendwa",
    coords: [-5.7472, 39.2889],
    category: "Beach",
    desc: "Relaxed northwest beach famous for full-moon parties and swimming in the shallows at any tide.",
    image: `${WM}/d/d6/Kendwa_Beach_%28Sunset_Kendwa_Hotel%29.JPG/500px-Kendwa_Beach_%28Sunset_Kendwa_Hotel%29.JPG`,
    fallbackSeed: "sitmeir_real_08",
  },
  {
    name: "Paje",
    coords: [-6.3164, 39.3553],
    category: "Beach",
    desc: "The kitesurfing capital of the southeast — wide tidal lagoon, boisterous trade winds and beachfront cafés.",
    image: `${WM}/e/e2/PAJE%2C_Zanzibar.jpg/500px-PAJE%2C_Zanzibar.jpg`,
    fallbackSeed: "sitmeir_real_03",
  },
  {
    name: "Jambiani",
    coords: [-6.3828, 39.3664],
    category: "Beach",
    desc: "Quiet fishing villages, long white-sand beaches and the local tradition of seaweed farming.",
    image: `${WM}/8/85/Harvesting_seaweed_in_Jambiani.jpg/500px-Harvesting_seaweed_in_Jambiani.jpg`,
    fallbackSeed: "zanzibar_ai_15",
  },
  {
    name: "Matemwe",
    coords: [-5.8706, 39.3697],
    category: "Beach",
    desc: "Serene northeast beach that feels a world away — the launch point for trips to Mnemba Atoll.",
    image: `${WM}/d/d6/Kendwa_Beach_%28Sunset_Kendwa_Hotel%29.JPG/500px-Kendwa_Beach_%28Sunset_Kendwa_Hotel%29.JPG`,
    fallbackSeed: "sitmeir_real_01",
  },
  {
    name: "Kiwengwa",
    coords: [-5.9844, 39.3658],
    category: "Beach",
    desc: "Lively northeast beach village with a long white shoreline, resorts, restaurants and reef snorkelling.",
    image: `${WM}/f/f5/Nungwi-Beach-Zanzibar.jpg/500px-Nungwi-Beach-Zanzibar.jpg`,
    fallbackSeed: "zanzibar_ai_09",
  },
  {
    name: "Michamvi / Pingwe (The Rock Restaurant)",
    coords: [-6.2499, 39.4122],
    category: "Beach",
    desc: "Southeast coast around Michamvi and Pingwe — the famous Rock Restaurant sits on its own offshore islet at high tide.",
    image: `${WM}/e/e2/PAJE%2C_Zanzibar.jpg/500px-PAJE%2C_Zanzibar.jpg`,
    fallbackSeed: "zanzibar_ai_10",
  },
];

/** Re-enable scroll-zoom only after the user clicks/taps the map. */
function ScrollZoom() {
  const map = useMap();
  useMapEvents({
    click: () => map.scrollWheelZoom.enable(),
    mouseout: () => map.scrollWheelZoom.disable(),
  });
  return null;
}

/** Centre on Unguja and keep the container sized once mounted. */
function UngujaFit() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    map.setView([-6.2, 39.3], 10);
    map.fitBounds(L.latLngBounds([-6.55, 39.1], [-5.7, 39.5]).pad(0.05));
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);
  return null;
}

function AttractionPopup({ a }: { a: Attraction }) {
  return (
    <div className="w-[230px]">
      <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={a.image}
          alt={a.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== placeholderPhoto(a.fallbackSeed, 480, 270)) {
              img.src = placeholderPhoto(a.fallbackSeed, 480, 270);
            }
          }}
        />
        <span className="absolute top-1.5 left-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-stone-700 border border-stone-200">
          {a.category}
        </span>
      </div>
      <p className="font-semibold text-stone-900 text-sm leading-tight">{a.name}</p>
      <p className="text-stone-600 text-xs mt-1 leading-relaxed">{a.desc}</p>
    </div>
  );
}

const STREET_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const SATELLITE_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export default function ZanzibarMap() {
  const [base, setBase] = useState<"street" | "satellite">("street");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of ATTRACTIONS) c[a.category] = (c[a.category] ?? 0) + 1;
    return c;
  }, []);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-6.2, 39.3]}
        zoom={10}
        minZoom={8}
        maxZoom={18}
        scrollWheelZoom={false}
        zoomControl={true}
        className="leaflet-container-full"
      >
        <TileLayer
          attribution={
            base === "satellite"
              ? 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={base === "satellite" ? SATELLITE_TILES : STREET_TILES}
          maxZoom={base === "satellite" ? 19 : 18}
        />
        <UngujaFit />
        <ScrollZoom />

        {ATTRACTIONS.map((a) => (
          <Marker key={a.name} position={a.coords} title={a.name} icon={ICON}>
            <Popup maxWidth={250}>
              <AttractionPopup a={a} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Satellite toggle */}
      <div className="absolute top-4 left-4 z-[500] flex flex-col gap-1 rounded-xl bg-white/95 backdrop-blur border border-stone-200 shadow-card p-1">
        {(
          [
            { key: "street", label: "Map" },
            { key: "satellite", label: "Satellite" },
          ] as const
        ).map((b) => (
          <button
            key={b.key}
            type="button"
            onClick={() => setBase(b.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              base === b.key ? "bg-clove-600 text-white" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-4 z-[500] hidden md:block rounded-xl bg-white/95 backdrop-blur border border-stone-200 shadow-card p-3 text-xs text-stone-700">
        <p className="font-semibold text-stone-900 mb-1.5">Attractions on Unguja</p>
        <ul className="space-y-1">
          {Object.entries(counts).map(([cat, n]) => (
            <li key={cat} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-clove-600" /> {cat} ({n})
            </li>
          ))}
        </ul>
        <p className="mt-2 text-stone-500">Tap a pin for photos · drag or pinch to move</p>
      </div>
    </div>
  );
}
