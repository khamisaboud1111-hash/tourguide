"use client";

import { useState } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import { Button, Badge } from "@/components/admin/AdminForms";

const initialCategories = [
  { id: 1, name: "Safari", slug: "safari", tours: 8, color: "#8B3A2B" },
  { id: 2, name: "Treks & Climbs", slug: "treks-climbs", tours: 5, color: "#142825" },
  { id: 3, name: "Beach & Islands", slug: "beach-islands", tours: 6, color: "#C08A2E" },
  { id: 4, name: "Cultural", slug: "cultural", tours: 4, color: "#537179" },
  { id: 5, name: "Day Trips", slug: "day-trips", tours: 9, color: "#B75928" },
];

export default function AdminTourCategoriesPage() {
  const [categories] = useState(initialCategories);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Tour Categories</h1>
        <Button icon={<Plus size={16} />}>Add category</Button>
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
              <button className="text-stone-300 hover:text-clove-600 transition-colors" aria-label={`Delete ${c.name}`}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-3">
              <Badge variant="default">{c.tours} tours</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}