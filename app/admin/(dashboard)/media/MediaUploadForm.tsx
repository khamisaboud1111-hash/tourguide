"use client";

import { useState, useTransition } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { uploadMedia } from "@/app/actions/media";
import { useLang } from "@/lib/i18n/context";

export default function MediaUploadForm({ folders }: { folders: string[] }) {
  const { t } = useLang();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setMsg(null);
    startTransition(async () => {
      try {
        await uploadMedia(fd);
        setMsg("Uploaded — image is now in gallery and available for hero.");
        (e.target as HTMLFormElement).reset();
        setPreview(null);
      } catch (err: unknown) {
        setMsg(err instanceof Error ? err.message : "Upload failed");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 mb-6">
      <h3 className="font-display font-semibold mb-3">{t("mediaUploadTitle")}</h3>
      <p className="text-xs text-stone-500 mb-4">{t("mediaUploadDesc")}</p>
      <div className="grid md:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">{t("mediaImageFile")} *</span>
          <input name="file" type="file" accept="image/*" required onChange={onFileChange} className="w-full text-sm border border-stone-300 rounded-xl px-3 py-2 bg-stone-50" />
        </label>
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">{t("mediaFolder")}</span>
          <select name="folder" defaultValue="Gallery" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm">
            {folders.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-stone-700">{t("mediaAltText")}</span>
          <input name="altText" placeholder="Sunset dhow, spice farm..." className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm" />
        </label>
      </div>
      {preview && (
        <div className="mt-4 rounded-xl overflow-hidden border border-stone-200 max-w-xs">
          <img src={preview} alt="preview" className="w-full object-cover" />
        </div>
      )}
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-1.5 rounded-full bg-clove-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-clove-700 disabled:opacity-60">
          <Upload size={16} /> {isPending ? "Uploading…" : "Upload image"}
        </button>
        {msg && <span className={`text-sm ${msg.includes("Uploaded") ? "text-lagoon-700" : "text-clove-600"}`}>{msg}</span>}
      </div>
    </form>
  );
}
