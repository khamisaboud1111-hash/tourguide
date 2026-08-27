"use client";

import { useState } from "react";
import { Users, Sparkles } from "lucide-react";

type SegmentColor = "clove" | "lagoon" | "saffron" | "emerald" | "stone";

const segments: { name: string; desc: string; count: number; color: SegmentColor }[] = [
  { name: "New leads", desc: "Booked within last 30 days", count: 42, color: "clove" },
  { name: "Active travelers", desc: "Booked 2+ tours in 12 months", count: 128, color: "lagoon" },
  { name: "High spenders", desc: "Lifetime value over $2,000", count: 36, color: "saffron" },
  { name: "Repeat visitors", desc: "Returned for a second trip", count: 64, color: "emerald" },
  { name: "Inactive (6mo+)", desc: "No booking in 180 days", count: 210, color: "stone" },
];

const colorMap = {
  clove: "bg-clove-100 text-clove-700",
  lagoon: "bg-lagoon-100 text-lagoon-700",
  saffron: "bg-saffron-100 text-saffron-700",
  emerald: "bg-emerald-100 text-emerald-700",
  stone: "bg-stone-100 text-stone-600",
};

export default function AdminCustomerSegmentsPage() {
  const [active, setActive] = useState(segments[0]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Customer Segments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {segments.map((s) => (
          <button
            key={s.name}
            onClick={() => setActive(s)}
            className="rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-clove-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${colorMap[s.color]}`}>
                <Users size={20} />
              </div>
              <span className="text-2xl font-display font-semibold">{s.count}</span>
            </div>
            <p className="font-medium text-stone-900 mt-3">{s.name}</p>
            <p className="text-sm text-stone-500">{s.desc}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-clove-600" />
          <h2 className="font-display text-lg font-semibold">{active.name} — {active.count} customers</h2>
        </div>
        <p className="text-sm text-stone-500">
          Build automated email campaigns and targeted offers for this segment. Configure
          segmentation rules and triggers to keep this list fresh automatically.
        </p>
      </div>
    </div>
  );
}