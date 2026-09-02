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
  const [file, setFile] = useState<File | null>(null);
  const [verified, setVerified] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(0);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setVerified(false);
      setRotate(0);
      setFlipH(false);
      setFlipV(false);
      setBrightness(100);
      setContrast(100);
      setSaturate(100);
      setGrayscale(0);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !preview) {
      setMsg("Select an image first");
      return;
    }
    if (!verified) {
      setMsg("Please verify the image before uploading");
      return;
    }
    const fd = new FormData();
    // Apply edits via canvas if needed, otherwise upload original with edits as metadata
    // For now, upload original file but with alt text; edits are preview-only unless user confirms
    // To apply edits for real, we render to canvas
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.src = preview;
    setMsg(null);
    startTransition(async () => {
      try {
        // If any edit applied, render to canvas and upload edited version
        const hasEdits = rotate !== 0 || flipH || flipV || brightness !== 100 || contrast !== 100 || saturate !== 100 || grayscale !== 0;
        let uploadFile: File = file;
        if (hasEdits) {
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              const w = img.naturalWidth;
              const h = img.naturalHeight;
              canvas.width = rotate % 180 === 0 ? w : h;
              canvas.height = rotate % 180 === 0 ? h : w;
              const ctx = canvas.getContext("2d");
              if (!ctx) { reject(new Error("Canvas not supported")); return; }
              ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%)`;
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((rotate * Math.PI) / 180);
              ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
              ctx.drawImage(img, -w / 2, -h / 2);
              canvas.toBlob((blob) => {
                if (!blob) { reject(new Error("Could not process image")); return; }
                uploadFile = new File([blob], file.name, { type: file.type });
                resolve();
              }, file.type || "image/jpeg", 0.92);
            };
            img.onerror = () => reject(new Error("Could not load image"));
            if (img.complete) img.onload(new Event("load") as unknown as Event);
          });
        }
        const fd2 = new FormData(e.currentTarget);
        // Replace file with edited version
        fd2.set("file", uploadFile);
        await uploadMedia(fd2);
        setMsg("Uploaded — image is now in gallery and available for hero.");
        (e.target as HTMLFormElement).reset();
        setPreview(null);
        setFile(null);
        setVerified(false);
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
