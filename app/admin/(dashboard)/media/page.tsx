"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, Folder, Upload } from "lucide-react";
import { Button } from "@/components/admin/AdminForms";
import { useLang } from "@/lib/i18n/context";

const folders = ["All", "Tours", "Hero", "Gallery", "Team", "Blog"];

// No hardcoded demo items — media appears here only after admin uploads real files.
// This keeps the library empty until the admin sets it (per request to remove demo).
const mediaItems: { id: number; name: string; folder: string; type: string; size: string; dims: string }[] = [];

export default function AdminMediaPage() {
  const [activeFolder, setActiveFolder] = useState("All");
  const { t } = useLang();

  const filtered =
    activeFolder === "All" ? mediaItems : mediaItems.filter((m) => m.folder === activeFolder);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{t("adminMediaLibrary")}</h1>
        <Button icon={<Plus size={16} />}>{t("adminUploadMedia")}</Button>
      </div>

      {/* Folder tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFolder(f)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFolder === f
                ? "bg-clove-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Folder size={14} />
            {f}
          </button>
        ))}
      </div>

      {/* Grid — empty until admin uploads */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <Upload size={32} className="mx-auto text-stone-300 mb-3" />
          <p className="text-stone-600 font-medium">No media yet</p>
          <p className="text-sm text-stone-500 mt-1">{t("adminNoMediaInFolder")} — upload real photos via the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-clove-300 transition-colors">
              <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center">
                <ImageIcon size={32} className="text-stone-300" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{item.size} · {item.dims}</p>
                <p className="text-xs text-stone-500 mt-1">{item.folder}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}