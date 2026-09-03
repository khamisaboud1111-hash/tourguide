"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tourSchema } from "@/lib/validations";
import { authorizeStaff } from "@/lib/auth";

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseHighlights(v: string): { title: string; body: string }[] {
  if (!v.trim()) return [];
  try {
    const j = JSON.parse(v);
    if (Array.isArray(j)) return j.filter((x) => x.title && x.body);
  } catch {}
  return v.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const [title, ...rest] = line.split(":");
    return { title: title.trim(), body: rest.join(":").trim() || title.trim() };
  }).filter((x) => x.title);
}

function parseTourForm(formData: FormData) {
  const raw = {
    slug: formData.get("slug"),
    title: formData.get("title"),
    category: formData.get("category"),
    duration: formData.get("duration"),
    groupSize: formData.get("groupSize"),
    difficulty: formData.get("difficulty"),
    priceUsd: formData.get("priceUsd"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    includes: formData.get("includes") ?? "",
    excludes: formData.get("excludes") ?? "",
    meetingPoint: formData.get("meetingPoint"),
    lat: formData.get("lat") || " -6.1659",
    lng: formData.get("lng") || "39.2026",
    photoSeed: formData.get("photoSeed") || "tours-default",
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    highlights: formData.get("highlights") ?? "",
    itinerary: formData.get("itinerary") ?? "",
    whatToBring: formData.get("whatToBring") ?? "",
    cancellationPolicy: formData.get("cancellationPolicy") ?? "",
  };

  const parsed = tourSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      "Please check the tour form: " +
        parsed.error.issues.map((i) => `${i.path.join(".")} — ${i.message}`).join("; ")
    );
  }
  return parsed.data;
}

async function handleTourPhotos(formData: FormData, tourId: string | null) {
  const files = formData.getAll("tourPhotos").filter((f) => f instanceof File && (f as File).size > 0) as File[];
  if (files.length === 0) return null;
  const supabase = await createClient();
  let firstUrl: string | null = null;
  for (const file of files) {
    if (file.size > 8 * 1024 * 1024) continue;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const storagePath = `tours/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage.from("media").upload(storagePath, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (upErr) continue;
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);
    if (!firstUrl) firstUrl = urlData.publicUrl;
    await supabase.from("media_assets").insert({
      filename,
      original_filename: file.name,
      mime_type: file.type || "image/jpeg",
      file_size: file.size,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      alt_text: `Tour photo`,
      associated_tour_id: tourId,
    });
  }
  return firstUrl;
}

export async function createTour(formData: FormData) {
  await authorizeStaff("create tour");
  const data = parseTourForm(formData);
  const supabase = await createClient();

  const { data: inserted, error } = await supabase.from("tours").insert({
    slug: data.slug,
    title: data.title,
    category: data.category,
    duration: data.duration,
    group_size: data.groupSize,
    difficulty: data.difficulty,
    price_usd: data.priceUsd,
    summary: data.summary,
    description: data.description,
    includes: splitLines(data.includes),
    excludes: splitLines(data.excludes),
    meeting_point: data.meetingPoint,
    lat: Number(data.lat) || -6.1659,
    lng: Number(data.lng) || 39.2026,
    photo_seed: data.photoSeed || "tours-default",
    is_published: data.isPublished ?? true,
    is_featured: data.isFeatured ?? false,
    highlights: parseHighlights(data.highlights ?? ""),
    itinerary: splitLines(data.itinerary ?? ""),
    what_to_bring: splitLines(data.whatToBring ?? ""),
    cancellation_policy: (data.cancellationPolicy as string)?.trim() || "Free to cancel or reschedule until the guide confirms.",
  }).select("id").single();

  if (error) throw new Error(`Couldn't create tour: ${error.message}`);

  // Handle multiple tour photos — upload and link to tour, will appear on live site via media_assets
  const firstUrl = await handleTourPhotos(formData, inserted?.id ?? null);
  if (firstUrl && inserted?.id) {
    await supabase.from("tours").update({ photo_seed: firstUrl }).eq("id", inserted.id);
  }

  revalidatePath("/tours");
  if (inserted?.id) revalidatePath(`/tours/${data.slug}`);
  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}

export async function updateTour(id: string, formData: FormData) {
  await authorizeStaff("update tour");
  const data = parseTourForm(formData);
  const supabase = await createClient();

  const firstUrl = await handleTourPhotos(formData, id);

  const { error } = await supabase
    .from("tours")
    .update({
      slug: data.slug,
      title: data.title,
      category: data.category,
      duration: data.duration,
      group_size: data.groupSize,
      difficulty: data.difficulty,
      price_usd: data.priceUsd,
      summary: data.summary,
      description: data.description,
      includes: splitLines(data.includes),
      excludes: splitLines(data.excludes),
      meeting_point: data.meetingPoint,
      lat: Number(data.lat) || -6.1659,
      lng: Number(data.lng) || 39.2026,
      ...(firstUrl ? { photo_seed: firstUrl } : data.photoSeed ? { photo_seed: data.photoSeed } : {}),
      is_published: data.isPublished ?? true,
      is_featured: data.isFeatured ?? false,
      highlights: parseHighlights(data.highlights ?? ""),
      itinerary: splitLines(data.itinerary ?? ""),
      what_to_bring: splitLines(data.whatToBring ?? ""),
      cancellation_policy: (data.cancellationPolicy as string)?.trim() || "Free to cancel or reschedule until the guide confirms.",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(`Couldn't update tour: ${error.message}`);

  revalidatePath("/tours");
  revalidatePath(`/tours/${data.slug}`);
  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}

export async function deleteTour(id: string) {
  await authorizeStaff("delete tour");
  const supabase = await createClient();
  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) throw new Error(`Couldn't delete tour: ${error.message}`);

  revalidatePath("/tours");
  revalidatePath("/admin/tours");
}

export async function togglePublish(id: string, nextValue: boolean) {
  await authorizeStaff("toggle publish");
  const supabase = await createClient();
  const { error } = await supabase
    .from("tours")
    .update({ is_published: nextValue })
    .eq("id", id);
  if (error) throw new Error(`Couldn't update tour: ${error.message}`);

  revalidatePath("/tours");
  revalidatePath("/admin/tours");
}
