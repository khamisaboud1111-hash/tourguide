"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, Folder, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/AdminForms";

const folders = ["All", "Tours", "Hero", "Gallery", "Team", "Blog"];

const mediaItems = [
  { id: 1, name: "kilimanjaro.jpg", folder: "Tours", type: "image", size: "2.4 MB", dims: "1920x1280" },
  { id: 2, name: "safari-lion.jpg", folder: "Tours", type: "image", size: "1.8 MB", dims: "1920x1080" },
  { id: 3, name: "hero-main.jpg", folder: "Hero", type: "image", size: "3.1 MB", dims: "2560x1440" },
  { id: 4, name: "zanzibar-beach.jpg", folder: "Gallery", type: "image", size: "2.2 MB", dims: "1920x1280" },
  { id: 5, name: "team-guide.jpg", folder: "Team", type: "image", size: "1.4 MB", dims: "1280x1280" },
  { id: 6, name: "blog-safari-tips.jpg", folder: "Blog", type: "image", size: "1.9 MB", dims: "1920x1080" },
];

export default function AdminMediaPage() {
  const [activeFolder, setActiveFolder] = useState("All");

  const filtered =
    activeFolder === "All" ? mediaItems : mediaItems.filter((m) => m.folder === activeFolder);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Media Library</h1>
        <Button icon={<Plus size={16} />}>Upload media</Button>
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

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-clove-300 transition-colors">
            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center">
              <ImageIcon size={32} className="text-stone-300" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
              <p className="text-xs text-stone-500 mt-0.5">{item.size} · {item.dims}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-stone-500">{item.folder}</span>
                <button className="text-stone-400 hover:text-clove-600 transition-colors" aria-label={`Delete ${item.name}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
          <Upload size={32} className="mx-auto text-stone-300 mb-3" />
          <p className="text-stone-500">No media in this folder yet.</p>
        </div>
      )}
    </div>
  );
}