"use client";

import { useState } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import { Button, Badge } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

// Real website categories — match the 5 categories used in tours table and homepage
const initialCategories = [
  { id: 1, name: "Culture & History", slug: "culture-history", tours: 1, color: "#8B3A2B" },
  { id: 2, name: "Culture & Nature", slug: "culture-nature", tours: 1, color: "#142825" },
  { id: 3, name: "Ocean & Sailing", slug: "ocean-sailing", tours: 2, color: "#0e7490" },
  { id: 4, name: "Nature & Wildlife", slug: "nature-wildlife", tours: 1, color: "#15803d" },
  { id: 5, name: "Ocean & Wildlife", slug: "ocean-wildlife", tours: 1, color: "#0369a1" },
];

export default function AdminTourCategoriesPage() {
  const [categories] = useState(initialCategories);
  const { t } = useLang();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminTourCategories")}</h1>
        <Button icon={<Plus size={16} />}>{t("adminAddCategory")}</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-stone-200 bg-white p-5 hover:border-clove-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg inline-block" style={{ backgroundColor: c.color }} />
                <div>
                  <p className="font-medium text-stone-900">{c.name}</p>
                  <p className="text-xs text-stone-400 font-mono">/{c.slug}</p>
                </div>
              </div>
              <button className="text-stone-300 hover:text-clove-600 transition-colors" aria-label={t("adminDeleteCategory").replace("{name}", c.name)}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-3">
              <Badge variant="default">{t("adminToursCount").replace("{count}", String(c.tours))}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}