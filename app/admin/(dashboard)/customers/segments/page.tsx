"use client";

import { useState } from "react";
import { Users, Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n/context";

type SegmentColor = "clove" | "lagoon" | "saffron" | "emerald" | "stone";

const segments: { nameKey: string; descKey: string; count: number; color: SegmentColor }[] = [
  { nameKey: "adminSegmentsNewLeads", descKey: "adminSegmentsNewLeadsDesc", count: 42, color: "clove" },
  { nameKey: "adminSegmentsActiveTravelers", descKey: "adminSegmentsActiveTravelersDesc", count: 128, color: "lagoon" },
  { nameKey: "adminSegmentsHighSpenders", descKey: "adminSegmentsHighSpendersDesc", count: 36, color: "saffron" },
  { nameKey: "adminSegmentsRepeatVisitors", descKey: "adminSegmentsRepeatVisitorsDesc", count: 64, color: "emerald" },
  { nameKey: "adminSegmentsInactive", descKey: "adminSegmentsInactiveDesc", count: 210, color: "stone" },
];

const colorMap = {
  clove: "bg-clove-100 text-clove-700",
  lagoon: "bg-lagoon-100 text-lagoon-700",
  saffron: "bg-saffron-100 text-saffron-700",
  emerald: "bg-emerald-100 text-emerald-700",
  stone: "bg-stone-100 text-stone-600",
};

export default function AdminCustomerSegmentsPage() {
  const { t } = useLang();
  const [active, setActive] = useState(segments[0]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{t("adminSegmentsTitle")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {segments.map((s) => (
          <button
            key={s.nameKey}
            onClick={() => setActive(s)}
            className="rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-clove-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${colorMap[s.color]}`}>
                <Users size={20} />
              </div>
              <span className="text-2xl font-display font-semibold">{s.count}</span>
            </div>
            <p className="font-medium text-stone-900 mt-3">{t(s.nameKey)}</p>
            <p className="text-sm text-stone-500">{t(s.descKey)}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-clove-600" />
          <h2 className="font-display text-lg font-semibold">{t("adminSegmentsCustomersCount").replace("{name}", t(active.nameKey)).replace("{count}", String(active.count))}</h2>
        </div>
        <p className="text-sm text-stone-500">
          {t("adminSegmentsDesc")}
        </p>
      </div>
    </div>
  );
}