import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import MediaUploadForm from "./MediaUploadForm";
import { MediaThumb, CopyLinkButton } from "@/components/admin/media-client";
import { deleteMedia, setHeroImage } from "@/app/actions/media";
import { galleryPhotos, resolveGallerySrc } from "@/lib/gallery-photos";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const folders = ["All", "Tours", "Hero", "Gallery", "Team", "Blog"];

type MediaItem = {
  id: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string | null;
  alt_text: string | null;
};

export default async function AdminMediaPage() {
  const lang = getLang();
  const supabase = await createClient();
  const { data: items } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
  const uploads = (items ?? []) as MediaItem[];

  async function handleDelete(id: string) {
    "use server";
    await deleteMedia(id);
  }

  async function handleSetHero(url: string) {
    "use server";
    await setHeroImage(url);
    revalidatePath("/admin/media");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{tServer("adminMediaLibrary", lang)}</h1>
        <span className="text-xs text-stone-500">{uploads.length} uploaded · {galleryPhotos.length} built-in live</span>
      </div>

      <MediaUploadForm folders={folders} />

      <h2 className="font-display text-lg font-semibold mt-8 mb-3">Your uploads</h2>
      <p className="text-xs text-stone-500 mb-4">Uploads appear on the live Gallery automatically. “Use as hero” makes the image the homepage hero. Deleting removes it everywhere.</p>
      {uploads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-stone-600 font-medium">No media yet</p>
          <p className="text-sm text-stone-500 mt-1">{tServer("adminNoMediaInFolder", lang)} — upload real photos above. They will appear in Gallery and can be set as hero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploads.map((item) => (
            <div key={item.id} className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-clove-300 transition-colors">
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                <MediaThumb src={item.public_url ?? ""} alt={item.alt_text ?? item.original_filename} />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-stone-800 truncate" title={item.original_filename}>{item.original_filename}</p>
                {item.alt_text && <p className="text-xs text-stone-500 truncate mt-0.5" title={item.alt_text}>{item.alt_text}</p>}
                <p className="text-xs text-stone-500 mt-0.5">{(item.file_size / 1024).toFixed(0)} KB · {item.mime_type.split("/")[1]}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{item.storage_path.split("/")[0]}</span>
                  {item.public_url && <CopyLinkButton url={item.public_url} />}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {item.public_url && (
                    <form action={handleSetHero.bind(null, item.public_url)}>
                      <button className="rounded-full border border-lagoon-300 text-lagoon-800 px-3 py-1 text-xs font-medium hover:bg-lagoon-50 transition-colors">
                        Use as hero
                      </button>
                    </form>
                  )}
                  <form action={handleDelete.bind(null, item.id)}>
                    <button className="rounded-full border border-clove-200 bg-clove-50 text-clove-700 px-3 py-1 text-xs font-medium hover:bg-clove-100 transition-colors">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-lg font-semibold mt-10 mb-3">Live on the website — Gallery ({galleryPhotos.length})</h2>
      <p className="text-xs text-stone-500 mb-4">Exactly what visitors see on the /gallery page (plus your uploads above). Built-in photos are part of the site design — to change them, upload new images above or contact your developer.</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {galleryPhotos.map((p) => (
          <div key={p.seed} className="rounded-xl overflow-hidden border border-stone-200 bg-white">
            <div className="aspect-square bg-stone-100 overflow-hidden">
              <MediaThumb src={resolveGallerySrc(p.seed, 400, 400)} alt={p.alt} />
            </div>
            <p className="text-[11px] text-stone-500 truncate px-2 py-1" title={p.alt}>{p.cat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
