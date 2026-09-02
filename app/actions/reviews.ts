"use server";

import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type SubmitReviewResult = { ok: true } | { ok: false; error: string };

export async function submitReview(formData: FormData): Promise<SubmitReviewResult> {
  const parsed = reviewSchema.safeParse({
    tourId: formData.get("tourId") ?? "",
    customerName: formData.get("customerName") ?? "",
    email: formData.get("email") ?? "",
    country: formData.get("country") ?? "",
    rating: formData.get("rating") ?? "",
    review: formData.get("review") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;
  const supabase = await createClient();

  // Verify tour exists if provided
  if (data.tourId) {
    const { data: tour } = await supabase.from("tours").select("id").eq("id", data.tourId).maybeSingle();
    if (!tour) return { ok: false, error: "Tour not found." };
  }

  const { error } = await supabase.from("reviews").insert({
    tour_id: data.tourId || null,
    customer_name: data.customerName,
    email: data.email || null,
    country: data.country || null,
    rating: data.rating,
    review: data.review,
    published: false,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/tours");
  if (data.tourId) revalidatePath(`/tours/${data.tourId}`);
  return { ok: true };
}
