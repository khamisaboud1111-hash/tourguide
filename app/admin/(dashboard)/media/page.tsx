import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import MediaUploadForm from "./MediaUploadForm";
import { deleteMedia } from "@/app/actions/media";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const folders = ["All", "Tours", "Hero", "Gallery", "Team", "Blog"];

export default async function AdminMediaPage() {
  const lang = getLang();
  const supabase = await createClient();
  const { data: items } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">{tServer("adminMediaLibrary", lang)}</h1>
      </div>

      <MediaUploadForm folders={folders} />

      {(items ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-stone-600 font-medium">No media yet</p>
          <p className="text-sm text-stone-500 mt-1">{tServer("adminNoMediaInFolder", lang)} — upload real photos above. They will appear in Gallery and can be set as hero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(items ?? []).map((item) => (
            <div key={item.id} className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-clove-300 transition-colors">
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.public_url ?? ""} alt={item.alt_text ?? item.original_filename} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-stone-800 truncate">{item.original_filename}</p>
                <p className="text-xs text-stone-500 mt-0.5">{(item.file_size / 1024).toFixed(0)} KB · {item.mime_type.split("/")[1]}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-stone-500">{item.storage_path.split("/")[0]}</span>
                  <form action={async () => { "use server"; await deleteMedia(item.id); }}>
                    <button className="text-xs text-clove-600 hover:underline">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}