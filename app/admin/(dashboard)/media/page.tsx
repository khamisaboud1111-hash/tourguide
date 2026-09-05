import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import MediaUploadForm from "./MediaUploadForm";
import { UploadGrid, GalleryPreviewGrid, type UploadItem } from "@/components/admin/media-client";
import { galleryPhotos, resolveGallerySrc } from "@/lib/gallery-photos";

export const dynamic = "force-dynamic";

const folders = ["All", "Tours", "Hero", "Gallery", "Team", "Blog"];

export default async function AdminMediaPage() {
  const lang = getLang();
  const supabase = await createClient();
  const { data: items } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
  const uploads = (items ?? []) as UploadItem[];
  const { data: hiddenRow } = await supabase
    .from("website_settings")
    .select("value")
    .eq("section", "gallery")
    .eq("key", "hidden_seeds")
    .maybeSingle();
  const hiddenValue: unknown = (hiddenRow as { value: unknown } | null)?.value;
  const hiddenSeeds = Array.isArray(hiddenValue) ? hiddenValue.filter((x): x is string => typeof x === "string") : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{tServer("adminMediaLibrary", lang)}</h1>
        <span className="text-xs text-stone-500">{uploads.length} uploaded · {galleryPhotos.length} in gallery</span>
      </div>

      <MediaUploadForm folders={folders} />

      <h2 className="font-display text-lg font-semibold mt-8 mb-3">Your uploads</h2>
      <p className="text-xs text-stone-500 mb-4">Click any image to view it large. Uploads appear on the live Gallery automatically — deleting removes them everywhere.</p>
      {uploads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-stone-600 font-medium">No media yet</p>
          <p className="text-sm text-stone-500 mt-1">{tServer("adminNoMediaInFolder", lang)} — upload real photos above.</p>
        </div>
      ) : (
        <UploadGrid items={uploads} />
      )}

      <h2 className="font-display text-lg font-semibold mt-10 mb-3">Gallery ({galleryPhotos.length})</h2>
      <p className="text-xs text-stone-500 mb-4">Click any image to view it large — you can hide it from the site or show it again at any time.</p>
      <GalleryPreviewGrid
        items={galleryPhotos.map((p) => ({ seed: p.seed, src: resolveGallerySrc(p.seed, 400, 400), alt: p.alt, cat: p.cat }))}
        hiddenSeeds={hiddenSeeds}
      />
    </div>
  );
}
