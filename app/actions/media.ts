"use server";

import { createClient } from "@/lib/supabase/server";
import { authorizeStaff } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function uploadMedia(formData: FormData) {
  await authorizeStaff("upload media");
  const file = formData.get("file") as File | null;
  const altText = String(formData.get("altText") ?? "");
  const folder = String(formData.get("folder") ?? "Gallery");
  if (!file || file.size === 0) throw new Error("No file selected");
  if (file.size > 8 * 1024 * 1024) throw new Error("File too large — max 8MB");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storagePath = `${folder.toLowerCase()}/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage.from("media").upload(storagePath, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("media_assets").insert({
    filename,
    original_filename: file.name,
    mime_type: file.type || "image/jpeg",
    file_size: file.size,
    storage_path: storagePath,
    public_url: urlData.publicUrl,
    alt_text: altText || null,
    uploaded_by: user?.id ?? null,
  });
  if (dbError) throw new Error(dbError.message);

  revalidatePath("/admin/media");
  revalidatePath("/gallery");
  return { ok: true, url: urlData.publicUrl, path: storagePath };
}

export async function deleteMedia(id: string) {
  await authorizeStaff("delete media");
  const supabase = await createClient();
  const { data: row } = await supabase.from("media_assets").select("storage_path").eq("id", id).single();
  if (row?.storage_path) {
    await supabase.storage.from("media").remove([row.storage_path]);
  }
  await supabase.from("media_assets").delete().eq("id", id);
  revalidatePath("/admin/media");
  revalidatePath("/gallery");
}
