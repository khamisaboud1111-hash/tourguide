import { createClient } from "@/lib/supabase/server";

export type TourReview = {
  id: string;
  tour_id: string | null;
  customer_name: string;
  email: string | null;
  country: string | null;
  rating: number;
  review: string;
  created_at: string;
};

export async function getPublishedReviews(tourId?: string): Promise<TourReview[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("reviews").select("*").eq("published", true).order("created_at", { ascending: false }).limit(12);
    if (tourId) query = query.eq("tour_id", tourId);
    const { data } = await query;
    return (data as TourReview[]) ?? [];
  } catch {
    return [];
  }
}

export function aggregateRating(reviews: TourReview[]): { average: number; count: number } | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}
