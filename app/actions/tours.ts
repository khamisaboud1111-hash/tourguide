"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tourSchema } from "@/lib/validations";

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
  // fallback: lines "Title: Body"
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
    lat: formData.get("lat"),
    lng: formData.get("lng"),
    photoSeed: formData.get("photoSeed"),
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

export async function createTour(formData: FormData) {
  const data = parseTourForm(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("tours").insert({
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
    lat: data.lat,
    lng: data.lng,
    photo_seed: data.photoSeed,
    is_published: data.isPublished ?? true,
    is_featured: data.isFeatured ?? false,
    highlights: parseHighlights(data.highlights ?? ""),
    itinerary: splitLines(data.itinerary ?? ""),
    what_to_bring: splitLines(data.whatToBring ?? ""),
    cancellation_policy: (data.cancellationPolicy as string)?.trim() || "Free to cancel or reschedule until the guide confirms.",
  });

  if (error) throw new Error(`Couldn't create tour: ${error.message}`);

  revalidatePath("/tours");
  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}

export async function updateTour(id: string, formData: FormData) {
  const data = parseTourForm(formData);
  const supabase = await createClient();

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
      lat: data.lat,
      lng: data.lng,
      photo_seed: data.photoSeed,
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
  const supabase = await createClient();
  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) throw new Error(`Couldn't delete tour: ${error.message}`);

  revalidatePath("/tours");
  revalidatePath("/admin/tours");
}

export async function togglePublish(id: string, nextValue: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tours")
    .update({ is_published: nextValue })
    .eq("id", id);
  if (error) throw new Error(`Couldn't update tour: ${error.message}`);

  revalidatePath("/tours");
  revalidatePath("/admin/tours");
}
