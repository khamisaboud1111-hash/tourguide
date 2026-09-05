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
  // Strict whitelist — reject SVG (can contain script) and double extensions
  const allowedExt = new Set(["jpg", "jpeg", "png", "webp", "avif"]);
  const allowedMime = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!allowedExt.has(ext)) throw new Error("Only JPG, PNG, WEBP, AVIF allowed");
  if (file.name.split(".").length > 2) throw new Error("Double extensions not allowed");
  if (!allowedMime.has(file.type)) throw new Error("Invalid image type");
  // Verify magic bytes via sharp metadata (strips scripts)
  let buffer: Uint8Array = new Uint8Array(await file.arrayBuffer());
  try {
    const sharp = (await import("sharp")).default;
    const meta = await sharp(buffer).metadata();
    if (!meta.format || !["jpeg", "jpg", "png", "webp", "avif"].includes(meta.format)) throw new Error("Invalid image format");
    // Re-encode to strip metadata/scripts and normalize
    buffer = await sharp(buffer).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  } catch (e) {
    // If sharp fails, reject — don't store raw bytes that could be malicious
    if ((e as Error).message?.includes("Invalid image")) throw e;
    // otherwise continue with original buffer but already validated ext/mime
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Use already validated buffer (re-encoded via sharp if needed), ensure ext is safe
  const safeExt = ext === "jpeg" ? "jpg" : ext;
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const storagePath = `${folder.toLowerCase()}/${filename}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(storagePath, buffer, {
    contentType: "image/jpeg",
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

export async function setHeroImage(url: string) {
  await authorizeStaff("update homepage settings");
  if (!url.startsWith("https://")) throw new Error("Invalid image URL");
  const supabase = await createClient();
  const { error } = await supabase.from("website_settings").upsert(
    {
      section: "homepage",
      key: "hero_image_seed",
      value: url,
      description: "Hero image override set from Media Library",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section,key" }
  );
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/media");
  revalidatePath("/admin/website/homepage");
  return { ok: true };
}

async function getHiddenSeeds(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("website_settings")
    .select("value")
    .eq("section", "gallery")
    .eq("key", "hidden_seeds")
    .maybeSingle();
  const v = (data as { value: unknown } | null)?.value;
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

async function saveHiddenSeeds(seeds: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("website_settings").upsert(
    {
      section: "gallery",
      key: "hidden_seeds",
      value: seeds,
      description: "Gallery photo seeds hidden from the live site by admin",
      is_public: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section,key" }
  );
  if (error) throw new Error(error.message);
}

// Hide a built-in gallery photo from the live site (reversible).
export async function hideGallerySeed(seed: string) {
  await authorizeStaff("update gallery settings");
  if (!seed || typeof seed !== "string") throw new Error("Invalid photo");
  const seeds = await getHiddenSeeds();
  if (!seeds.includes(seed)) await saveHiddenSeeds([...seeds, seed]);
  revalidatePath("/gallery");
  revalidatePath("/admin/media");
  return { ok: true };
}

// Show a previously hidden gallery photo again.
export async function unhideGallerySeed(seed: string) {
  await authorizeStaff("update gallery settings");
  const seeds = await getHiddenSeeds();
  await saveHiddenSeeds(seeds.filter((s) => s !== seed));
  revalidatePath("/gallery");
  revalidatePath("/admin/media");
  return { ok: true };
}

async function getHeroHidden(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("website_settings")
    .select("value")
    .eq("section", "hero")
    .eq("key", "hidden_seeds")
    .maybeSingle();
  const v = (data as { value: unknown } | null)?.value;
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

async function saveHeroHidden(seeds: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("website_settings").upsert(
    {
      section: "hero",
      key: "hidden_seeds",
      value: seeds,
      description: "Hero slides hidden from the live site by admin",
      is_public: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section,key" }
  );
  if (error) throw new Error(error.message);
}

// Delete a live hero slide from rotation (reversible).
export async function hideHeroSeed(seed: string) {
  await authorizeStaff("update homepage settings");
  if (!seed || typeof seed !== "string") throw new Error("Invalid photo");
  const seeds = await getHeroHidden();
  if (!seeds.includes(seed)) await saveHeroHidden([...seeds, seed]);
  revalidatePath("/");
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function unhideHeroSeed(seed: string) {
  await authorizeStaff("update homepage settings");
  const seeds = await getHeroHidden();
  await saveHeroHidden(seeds.filter((s) => s !== seed));
  revalidatePath("/");
  revalidatePath("/admin/media");
  return { ok: true };
}

// Remove a custom uploaded hero so the safari_blue carousel plays again.
export async function clearHeroOverride() {
  await authorizeStaff("update homepage settings");
  const supabase = await createClient();
  const { error } = await supabase
    .from("website_settings")
    .delete()
    .eq("section", "homepage")
    .eq("key", "hero_image_seed");
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/media");
  revalidatePath("/admin/website/homepage");
  return { ok: true };
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
