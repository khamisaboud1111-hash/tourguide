"use client";

import { useState } from "react";
import { Link2, Check, ImageOff } from "lucide-react";

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
