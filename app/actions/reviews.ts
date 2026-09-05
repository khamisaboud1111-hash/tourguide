"use server";

import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import DOMPurify from "isomorphic-dompurify";

// Rate limiter: 5 reviews / 60s per IP (future bug: spam)
const _rate = new Map<string, number[]>();
function rateLimitOk(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (_rate.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  _rate.set(ip, arr);
  if (_rate.size > 500) _rate.clear();
  return true;
}

// Lightweight spam heuristics. Flags for admin moderation — never auto-publishes.
function detectSpam(text: string): string | null {
  const t = text.trim();
  const links = (t.match(/https?:\/\/|www\./gi) ?? []).length;
  if (links >= 2) return `auto-spam: ${links} links`;
  if (/(viagra|cialis|crypto|casino|loan|forex|bitcoin|free money|click here)/i.test(t))
    return "auto-spam: suspicious keywords";
  if (/(.)\1{9,}/.test(t)) return "auto-spam: repeated characters";
  if (t.length > 50 && t === t.toUpperCase()) return "auto-spam: all caps";
  const words = t.toLowerCase().split(/\s+/);
  if (words.length >= 8) {
    const uniq = new Set(words);
    if (uniq.size / words.length < 0.3) return "auto-spam: repetitive text";
  }
  return null;
}

export type SubmitReviewResult = { ok: true } | { ok: false; error: string };

export async function submitReview(formData: FormData): Promise<SubmitReviewResult> {
  try {
    const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || headers().get("x-real-ip") || "unknown";
    if (!rateLimitOk(ip)) return { ok: false, error: "Too many reviews — please wait a minute and try again." };
  } catch {}
  const parsed = reviewSchema.safeParse({
    tourId: formData.get("tourId") ?? "",
    tourTitle: formData.get("tourTitle") ?? "",
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
  // Sanitize to prevent stored XSS (defense in depth — React escapes, but future dangerouslySetInnerHTML would not)
  const cleanName = DOMPurify.sanitize(data.customerName, { ALLOWED_TAGS: [] });
  const cleanReview = DOMPurify.sanitize(data.review, { ALLOWED_TAGS: [] });
  const cleanCountry = data.country ? DOMPurify.sanitize(data.country, { ALLOWED_TAGS: [] }) : data.country;
  const cleanTourTitle = data.tourTitle ? DOMPurify.sanitize(data.tourTitle, { ALLOWED_TAGS: [] }) : "";
  const supabase = await createClient();

  // Verify tour exists if provided; copy authoritative title (denormalized).
  let tourTitle: string | null = cleanTourTitle || null;
  if (data.tourId) {
    const { data: tour } = await supabase.from("tours").select("id, title").eq("id", data.tourId).maybeSingle();
    if (!tour) return { ok: false, error: "Tour not found." };
    tourTitle = (tour as { title: string }).title;
  }

  const spamReason = detectSpam(cleanReview);

  // NOTE: email is stored for admin contact only. It is NEVER selected
  // on any public fetch path — public queries use explicit column lists.
  const { error } = await supabase.from("reviews").insert({
    tour_id: data.tourId || null,
    tour_title: tourTitle,
    customer_name: cleanName,
    email: data.email || null,
    country: cleanCountry || null,
    rating: data.rating,
    review: cleanReview,
    published: false,
    is_verified: false,
    is_featured: false,
    is_spam: spamReason !== null,
    moderation_reason: spamReason,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/reviews");
  revalidatePath("/tours");
  if (data.tourId) revalidatePath(`/tours/${data.tourId}`);
  return { ok: true };
}

export type ReportReviewResult = { ok: true } | { ok: false; error: string };

// Visitor-reported review: unpublish pending re-moderation and flag the reason.
// Separate rate limit: 3 reports / 60s per IP.
export async function reportReview(reviewId: string): Promise<ReportReviewResult> {
  try {
    const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || headers().get("x-real-ip") || "unknown";
    if (!rateLimitOk(`report:${ip}`, 3)) return { ok: false, error: "Too many reports — please try again later." };
  } catch {}
  if (!reviewId || typeof reviewId !== "string") return { ok: false, error: "Invalid review." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ published: false, moderation_reason: "Reported by a visitor — needs re-moderation" })
    .eq("id", reviewId)
    .eq("published", true);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/reviews");
  return { ok: true };
}
