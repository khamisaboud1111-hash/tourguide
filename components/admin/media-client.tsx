"use client";

import { useState, useTransition, useMemo } from "react";
import { Link2, Check, ImageOff, X, Trash2, Eye, ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { deleteMedia, setHeroImage, hideGallerySeed, unhideGallerySeed } from "@/app/actions/media";

// Thumbnail with graceful fallback — if a stored URL ever breaks, the admin
// sees the filename instead of a broken-image icon.
export function MediaThumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-stone-100 p-3 text-center">
        <ImageOff size={20} className="text-stone-400" />
        <span className="text-xs text-stone-500 break-all">{alt}</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />;
}

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
      className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-clove-600 transition-colors"
      title="Copy public URL"
    >
      {copied ? <Check size={12} /> : <Link2 size={12} />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

function Lightbox({
  src,
  alt,
  counter,
  onClose,
  onPrev,
  onNext,
  children,
}: {
  src: string;
  alt: string;
  counter?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-stone-950/90 backdrop-blur flex flex-col" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <div className="flex items-center justify-between px-4 md:px-6 py-4 text-white">
        <p className="text-sm truncate max-w-[80%]">{alt}{counter ? ` — ${counter}` : ""}</p>
        <button onClick={onClose} aria-label="Close" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 relative flex items-center justify-center p-4 min-h-0" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="max-h-full max-w-full object-contain rounded-xl" />
        {onPrev && (
          <button onClick={onPrev} aria-label="Previous image" className="absolute left-4 md:left-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
            <ChevronLeft size={20} />
          </button>
        )}
        {onNext && (
          <button onClick={onNext} aria-label="Next image" className="absolute right-4 md:right-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur">
            <ChevronRight size={20} />
          </button>
        )}
      </div>
      {children && (
        <div className="px-4 pb-6 flex items-center justify-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );
}

export type UploadItem = {
  id: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string | null;
  alt_text: string | null;
};

export type UploadFolder = {
  prefix: string;
  title: string;
  hint: string;
  items: UploadItem[];
};

// Folder browser — folders first; click a folder to see only its images.
export function FolderBrowser({ folders }: { folders: UploadFolder[] }) {
  const [openPrefix, setOpenPrefix] = useState<string | null>(null);
  const open = folders.find((f) => f.prefix === openPrefix) ?? null;
  const total = folders.reduce((n, f) => n + f.items.length, 0);

  if (open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpenPrefix(null)}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:border-clove-400 hover:text-clove-700 transition-colors"
        >
          <ChevronLeft size={16} /> All folders
        </button>
        <h3 className="font-display text-base font-semibold">{open.title} ({open.items.length})</h3>
        <p className="text-xs text-stone-500 mt-0.5 mb-3">{open.hint}</p>
        <UploadGrid items={open.items} />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-stone-500 mb-3">{total} images in {folders.length} folders — click a folder to open it.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {folders.map((f) => {
          const cover = f.items[0];
          return (
            <button
              key={f.prefix}
              type="button"
              onClick={() => setOpenPrefix(f.prefix)}
              className="group rounded-2xl border border-stone-200 bg-white overflow-hidden text-left hover:border-clove-400 hover:shadow-card transition-all"
            >
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                {cover ? (
                  <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
                    <MediaThumb src={cover.public_url ?? ""} alt={cover.original_filename} />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-stone-300">
                    <ImageOff size={28} />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-stone-800">{f.title}</p>
                <p className="text-xs text-stone-500 mt-0.5">{f.items.length} image{f.items.length === 1 ? "" : "s"}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DangerButton({ onConfirm, children }: { onConfirm: () => void; children: React.ReactNode }) {
  const [armed, setArmed] = useState(false);
  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => {
          setArmed(true);
          setTimeout(() => setArmed(false), 4000);
        }}
        className="rounded-full border border-clove-200 bg-clove-50 text-clove-700 px-3 py-1.5 text-xs font-medium hover:bg-clove-100 transition-colors"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onConfirm}
      className="rounded-full bg-clove-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-clove-700 transition-colors"
    >
      Click again to confirm
    </button>
  );
}

// Uploaded media grid — click any image to view it large, then copy link,
// use as hero, or delete.
export function UploadGrid({ items }: { items: UploadItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const openIndex = items.findIndex((i) => i.id === openId);
  const current = openIndex >= 0 ? items[openIndex] : null;
  const step = (dir: 1 | -1) => {
    if (items.length === 0) return;
    const next = ((openIndex < 0 ? 0 : openIndex) + dir + items.length) % items.length;
    setOpenId(items[next].id);
  };

  const run = (fn: () => Promise<unknown>, okMsg: string) => {
    setMsg(null);
    startTransition(async () => {
      try {
        await fn();
        setMsg(okMsg);
        if (okMsg.startsWith("Deleted")) setOpenId(null);
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Action failed");
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-clove-300 transition-colors">
            <button type="button" onClick={() => setOpenId(item.id)} className="block w-full aspect-[4/3] bg-stone-100 overflow-hidden" aria-label={`View ${item.original_filename}`}>
              <MediaThumb src={item.public_url ?? ""} alt={item.alt_text ?? item.original_filename} />
            </button>
            <div className="p-3">
              <p className="text-sm font-medium text-stone-800 truncate" title={item.original_filename}>{item.original_filename}</p>
              {item.alt_text && <p className="text-xs text-stone-500 truncate mt-0.5" title={item.alt_text}>{item.alt_text}</p>}
              <p className="text-xs text-stone-500 mt-0.5">{(item.file_size / 1024).toFixed(0)} KB · {item.mime_type.split("/")[1]}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{item.storage_path.split("/")[0]}</span>
                {item.public_url && <CopyLinkButton url={item.public_url} />}
              </div>
              <div className="mt-2">
                <DangerButton onConfirm={() => run(() => deleteMedia(item.id), "Deleted — removed from the live site.")}>
                  <span className="inline-flex items-center gap-1"><Trash2 size={12} /> Delete</span>
                </DangerButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      {current?.public_url && (
        <Lightbox
          src={current.public_url}
          alt={current.alt_text ?? current.original_filename}
          counter={items.length > 1 ? `${openIndex + 1} / ${items.length}` : undefined}
          onClose={() => setOpenId(null)}
          onPrev={items.length > 1 ? () => step(-1) : undefined}
          onNext={items.length > 1 ? () => step(1) : undefined}
        >
          <CopyLinkButton url={current.public_url} />
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => setHeroImage(current.public_url as string), "Hero updated — homepage shows this image now.")}
            className="rounded-full border border-lagoon-300 bg-white text-lagoon-800 px-4 py-1.5 text-xs font-medium hover:bg-lagoon-50 transition-colors disabled:opacity-60"
          >
            Use as hero
          </button>
          <DangerButton onConfirm={() => run(() => deleteMedia(current.id), "Deleted — removed from the live site.")}>
            <span className="inline-flex items-center gap-1"><Trash2 size={12} /> Delete this image</span>
          </DangerButton>
        </Lightbox>
      )}
      {msg && <p className="mt-3 text-sm text-stone-600">{msg}</p>}
    </>
  );
}

export type GalleryPreviewItem = { seed: string; src: string; alt: string; cat: string };

// Live gallery preview — click any image to view it large, then hide it from
// the site (reversible) or show it again.
export function GalleryPreviewGrid({ items, hiddenSeeds }: { items: GalleryPreviewItem[]; hiddenSeeds: string[] }) {
  const [openSeed, setOpenSeed] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set(hiddenSeeds));
  const [isPending, startTransition] = useTransition();
  const [openCat, setOpenCat] = useState<string | null>(null);
  const openIndex = items.findIndex((i) => i.seed === openSeed);
  const current = openIndex >= 0 ? items[openIndex] : null;
  const isHidden = openSeed ? hidden.has(openSeed) : false;
  const step = (dir: 1 | -1) => {
    if (items.length === 0) return;
    const next = ((openIndex < 0 ? 0 : openIndex) + dir + items.length) % items.length;
    setOpenSeed(items[next].seed);
  };

  const toggle = (seed: string, hide: boolean) => {
    startTransition(async () => {
      try {
        if (hide) {
          await hideGallerySeed(seed);
          setHidden((prev) => new Set(prev).add(seed));
        } else {
          await unhideGallerySeed(seed);
          setHidden((prev) => {
            const next = new Set(prev);
            next.delete(seed);
            return next;
          });
        }
      } catch {}
    });
  };

  // Group live-site images by their folder (category) — Gallery, Hero-style
  // shots and every other area each in its own folder section.
  const groups = useMemo(() => {
    const map = new Map<string, GalleryPreviewItem[]>();
    for (const p of items) {
      const list = map.get(p.cat) ?? [];
      list.push(p);
      map.set(p.cat, list);
    }
    const out: { cat: string; list: GalleryPreviewItem[] }[] = [];
    map.forEach((list, cat) => out.push({ cat, list }));
    return out;
  }, [items]);

  const viewerButton = current && !isHidden ? (
    <DangerButton onConfirm={() => toggle(current.seed, true)}>
      <span className="inline-flex items-center gap-1"><Trash2 size={12} /> Delete from site</span>
    </DangerButton>
  ) : null;

  return (
    <>
      <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 overflow-hidden">
        {groups.map(({ cat, list }) => {
          const expanded = openCat === cat;
          const hiddenCount = list.filter((p) => hidden.has(p.seed)).length;
          return (
            <div key={cat}>
              <button
                type="button"
                onClick={() => setOpenCat(expanded ? null : cat)}
                aria-expanded={expanded}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-stone-50 transition-colors"
              >
                <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${expanded ? "bg-clove-100 text-clove-700" : "bg-stone-100 text-stone-500"}`}>
                  <FolderOpen size={18} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-stone-800">{cat}</span>
                  <span className="block text-xs text-stone-500">
                    {list.length} image{list.length === 1 ? "" : "s"}
                    {hiddenCount > 0 ? ` · ${hiddenCount} deleted` : ""}
                  </span>
                </span>
                <ChevronRight size={18} className={`shrink-0 text-stone-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
              </button>
              {expanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {list.map((p) => {
                      const h = hidden.has(p.seed);
                      return (
                        <button
                          key={p.seed}
                          type="button"
                          onClick={() => setOpenSeed(p.seed)}
                          className="rounded-xl overflow-hidden border border-stone-200 bg-white text-left hover:border-clove-300 transition-colors"
                          aria-label={`View ${p.alt}`}
                        >
                          <div className={`aspect-square bg-stone-100 overflow-hidden ${h ? "opacity-40 grayscale" : ""}`}>
                            <MediaThumb src={p.src} alt={p.alt} />
                          </div>
                          <p className="text-[11px] text-stone-500 truncate px-2 py-1" title={`${p.alt} · file: ${p.seed}`}>
                            {h ? "Deleted · " : ""}{p.seed}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {current && (
        <Lightbox
          src={current.src}
          alt={current.alt}
          counter={items.length > 1 ? `${openIndex + 1} / ${items.length}` : undefined}
          onClose={() => setOpenSeed(null)}
          onPrev={items.length > 1 ? () => step(-1) : undefined}
          onNext={items.length > 1 ? () => step(1) : undefined}
        >
          {isHidden ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggle(current.seed, false)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-stone-800 px-4 py-1.5 text-xs font-medium hover:bg-stone-100 transition-colors disabled:opacity-60"
            >
              <Eye size={14} /> Restore to site
            </button>
          ) : (
            viewerButton
          )}
        </Lightbox>
      )}
    </>
  );
}
