import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import MediaUploadForm from "./MediaUploadForm";
import { UploadGrid, GalleryPreviewGrid, type UploadItem } from "@/components/admin/media-client";
import { galleryPhotos, resolveGallerySrc } from "@/lib/gallery-photos";

export const dynamic = "force-dynamic";

const folders = ["All", "Tours", "Hero", "Gallery", "Team", "Blog"];

// Folder prefix (storage_path "hero/...") -> display section in the library.
const FOLDER_SECTIONS: { prefix: string; title: string; hint: string }[] = [
  { prefix: "hero", title: "Hero images", hint: "Homepage hero candidates — open one and tap “Use as hero”." },
  { prefix: "gallery", title: "Gallery images", hint: "These appear on the live Gallery page automatically." },
  { prefix: "tours", title: "Tour / Experience images", hint: "Attached to tours and experiences across the site." },
  { prefix: "team", title: "Team images", hint: "Photos of the team." },
  { prefix: "blog", title: "Journal images", hint: "Used in journal posts." },
];

function folderOf(item: UploadItem): string {
  return item.storage_path.split("/")[0]?.toLowerCase() ?? "other";
}

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
      <p className="text-xs text-stone-500 mb-4">Grouped by folder — click any image to view it large. Deleting removes it everywhere live.</p>
      {uploads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-stone-600 font-medium">No media yet</p>
          <p className="text-sm text-stone-500 mt-1">{tServer("adminNoMediaInFolder", lang)} — upload real photos above.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {FOLDER_SECTIONS.map((section) => {
            const group = uploads.filter((u) => folderOf(u) === section.prefix);
            if (group.length === 0) return null;
            return (
              <section key={section.prefix}>
                <h3 className="font-display text-base font-semibold">{section.title} ({group.length})</h3>
                <p className="text-xs text-stone-500 mt-0.5 mb-3">{section.hint}</p>
                <UploadGrid items={group} />
              </section>
            );
          })}
          {(() => {
            const known = new Set(FOLDER_SECTIONS.map((s) => s.prefix));
            const rest = uploads.filter((u) => !known.has(folderOf(u)));
            if (rest.length === 0) return null;
            return (
              <section>
                <h3 className="font-display text-base font-semibold">Other ({rest.length})</h3>
                <p className="text-xs text-stone-500 mt-0.5 mb-3">Uploads in other folders.</p>
                <UploadGrid items={rest} />
              </section>
            );
          })()}
        </div>
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
