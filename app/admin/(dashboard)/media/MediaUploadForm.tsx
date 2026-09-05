"use client";

import { useState, useTransition, useRef } from "react";
import {
  Upload, ImagePlus, RotateCw, FlipHorizontal2, FlipVertical2,
  Check, Loader2, FolderOpen, Type, Sun, Contrast, Palette, CircleDot,
} from "lucide-react";
import { uploadMedia } from "@/app/actions/media";
import { useLang } from "@/lib/i18n/context";

export default function MediaUploadForm({ folders }: { folders: string[] }) {
  const { t } = useLang();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [verified, setVerified] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [folder, setFolder] = useState("Gallery");
  const [altText, setAltText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const resetEdits = () => {
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setGrayscale(0);
  };

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setMsg({ ok: false, text: "Please choose an image file" });
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setMsg({ ok: false, text: "File too large — max 8MB" });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setVerified(false);
    resetEdits();
    setMsg(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => pickFile(e.target.files?.[0]);

  const hasEdits = rotate !== 0 || flipH || flipV || brightness !== 100 || contrast !== 100 || saturate !== 100 || grayscale !== 0;
  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%)`;
  const transformStyle = `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !preview) {
      setMsg({ ok: false, text: "Select an image first" });
      return;
    }
    if (!verified) {
      setMsg({ ok: false, text: "Please verify the image before uploading" });
      return;
    }
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.src = preview;
    setMsg(null);
    startTransition(async () => {
      try {
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
              ctx.filter = filterStyle;
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
        const fd2 = new FormData();
        fd2.set("file", uploadFile);
        fd2.set("folder", folder);
        fd2.set("altText", altText);
        await uploadMedia(fd2);
        setMsg({ ok: true, text: "Uploaded — image is now in gallery and available for hero." });
        (e.target as HTMLFormElement).reset();
        setPreview(null);
        setFile(null);
        setVerified(false);
        setAltText("");
        resetEdits();
      } catch (err: unknown) {
        setMsg({ ok: false, text: err instanceof Error ? err.message : "Upload failed" });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6 mb-6 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-clove-100 text-clove-700">
          <ImagePlus size={18} />
        </span>
        <h3 className="font-display text-lg font-semibold">{t("mediaUploadTitle")}</h3>
      </div>
      <p className="text-xs text-stone-500 mb-4">{t("mediaUploadDesc")}</p>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Choose image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0]); }}
        className={`rounded-2xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 py-8 px-4 text-center ${
          dragOver ? "border-clove-500 bg-clove-50" : preview ? "border-stone-200 bg-stone-50" : "border-stone-300 bg-stone-50 hover:border-clove-400 hover:bg-clove-50/50"
        }`}
      >
        <input ref={inputRef} name="file" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" style={{ filter: filterStyle, transform: transformStyle }} className="max-h-56 rounded-xl object-contain shadow-soft transition-all" />
            <p className="text-xs text-stone-500 mt-1">{file?.name} · {file ? (file.size / 1024).toFixed(0) : 0} KB · click or drop to replace</p>
          </>
        ) : (
          <>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-clove-100 text-clove-600">
              <Upload size={22} />
            </span>
            <p className="text-sm font-medium text-stone-700">Drop an image here, or <span className="text-clove-600 underline">browse</span></p>
            <p className="text-xs text-stone-400">JPG, PNG, WEBP or AVIF · max 8MB</p>
          </>
        )}
      </div>

      {preview && (
        <>
          {/* Edit tools */}
          <div className="mt-4 rounded-2xl bg-stone-50 border border-stone-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">Touch up before upload</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" onClick={() => { setRotate((r) => (r + 90) % 360); setVerified(false); }} className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-clove-400 hover:text-clove-700 transition-colors">
                <RotateCw size={14} /> Rotate
              </button>
              <button type="button" onClick={() => { setFlipH((v) => !v); setVerified(false); }} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${flipH ? "border-clove-500 bg-clove-50 text-clove-700" : "border-stone-300 bg-white text-stone-700 hover:border-clove-400"}`}>
                <FlipHorizontal2 size={14} /> Flip H
              </button>
              <button type="button" onClick={() => { setFlipV((v) => !v); setVerified(false); }} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${flipV ? "border-clove-500 bg-clove-50 text-clove-700" : "border-stone-300 bg-white text-stone-700 hover:border-clove-400"}`}>
                <FlipVertical2 size={14} /> Flip V
              </button>
              <button type="button" onClick={() => { setGrayscale((g) => (g === 0 ? 100 : 0)); setVerified(false); }} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${grayscale ? "border-clove-500 bg-clove-50 text-clove-700" : "border-stone-300 bg-white text-stone-700 hover:border-clove-400"}`}>
                <CircleDot size={14} /> B&W
              </button>
              {hasEdits && (
                <button type="button" onClick={() => { resetEdits(); setVerified(false); }} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-clove-600 transition-colors">
                  Reset edits
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Sun, label: "Brightness", value: brightness, set: setBrightness, min: 50, max: 150 },
                { icon: Contrast, label: "Contrast", value: contrast, set: setContrast, min: 50, max: 150 },
                { icon: Palette, label: "Saturation", value: saturate, set: setSaturate, min: 0, max: 200 },
              ].map((s) => (
                <label key={s.label} className="block">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1.5">
                    <s.icon size={13} /> {s.label} · {s.value}%
                  </span>
                  <input
                    type="range" min={s.min} max={s.max} value={s.value}
                    onChange={(e) => { s.set(Number(e.target.value)); setVerified(false); }}
                    className="w-full accent-clove-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Folder pills + alt text */}
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-stone-700 mb-2">
                <FolderOpen size={13} /> {t("mediaFolder")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {folders.filter((f) => f !== "All").map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFolder(f)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      folder === f ? "bg-clove-600 text-white shadow-soft" : "border border-stone-300 bg-white text-stone-600 hover:border-clove-400 hover:text-clove-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <label className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                <Type size={13} /> {t("mediaAltText")}
              </span>
              <input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Sunset dhow, spice farm..." className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-clove-500" />
            </label>
          </div>
        </>
      )}

      {/* Verify + upload */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {preview && (
          <button
            type="button"
            onClick={() => setVerified((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              verified ? "bg-lagoon-600 text-white" : "border border-stone-300 text-stone-700 hover:border-lagoon-400 hover:text-lagoon-700"
            }`}
          >
            <Check size={16} /> {verified ? "Verified ✓" : "1 · Verify image"}
          </button>
        )}
        <button type="submit" disabled={isPending || !preview} className="inline-flex items-center gap-1.5 rounded-full bg-clove-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-clove-700 disabled:opacity-40 transition-colors">
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {isPending ? "Uploading…" : preview ? "2 · Upload image" : "Upload image"}
        </button>
        {msg && (
          <span className={`text-sm px-3 py-1.5 rounded-lg ${msg.ok ? "bg-lagoon-50 text-lagoon-800 border border-lagoon-200" : "bg-clove-50 text-clove-700 border border-clove-200"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}
