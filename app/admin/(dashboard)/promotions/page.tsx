"use client";

import { useState } from "react";
import { Plus, Tag, Percent, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button, Badge } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

const initialPromotions = [
  { id: 1, code: "SAVE10", type: "percent", value: 10, min_spend: 500, usage: 42, max_usage: 100, active: true, expiry: "2026-12-31" },
  { id: 2, code: "ZANZIBAR50", type: "fixed", value: 50, min_spend: 300, usage: 18, max_usage: 50, active: true, expiry: "2026-11-30" },
  { id: 3, code: "WELCOME20", type: "percent", value: 20, min_spend: 0, usage: 87, max_usage: 200, active: false, expiry: "2026-10-15" },
];

export default function AdminPromotionsPage() {
  const { t } = useLang();
  const [promotions, setPromotions] = useState(initialPromotions);

  const toggle = (id: number) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const remove = (id: number) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminPromotionsTitle")}</h1>
        <Button icon={<Plus size={16} />}>{t("adminNewPromotion")}</Button>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {[t("adminPromoCode"), t("adminPromoType"), t("adminPromoValue"), t("adminPromoMinSpend"), t("adminPromoUsage"), t("adminPromoExpiry"), t("adminPromoStatus"), ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {promotions.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-clove-700">
                    <Tag size={14} />
                    {p.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600 capitalize">{p.type}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {p.type === "percent" ? `${p.value}%` : `$${p.value}`}
                </td>
                <td className="px-4 py-3 text-sm text-stone-500">{p.min_spend ? `$${p.min_spend}` : "—"}</td>
                <td className="px-4 py-3 text-sm text-stone-500">{p.usage} / {p.max_usage}</td>
                <td className="px-4 py-3 text-sm text-stone-500">{p.expiry}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.active ? "success" : "default"}>{p.active ? t("adminPromoActive") : t("adminPromoPaused")}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => toggle(p.id)} className="text-stone-400 hover:text-clove-600 transition-colors" aria-label={p.active ? t("adminPausePromotion") : t("adminActivatePromotion")}>
                      {p.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <button onClick={() => remove(p.id)} className="text-stone-400 hover:text-clove-600 transition-colors" aria-label={t("adminDeletePromo").replace("{code}", p.code)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promotions.length === 0 && (
          <p className="text-sm text-stone-500 p-6 text-center">{t("adminPromotionsEmpty")}</p>
        )}
      </div>
    </div>
  );
}