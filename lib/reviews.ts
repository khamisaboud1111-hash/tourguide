import { createClient } from "@/lib/supabase/server";

// Public review shape. NOTE: email is deliberately absent — reviewer emails
// are admin-only and must NEVER be selected on a public fetch path.
export type TourReview = {
  id: string;
  tour_id: string | null;
  tour_title: string | null;
  customer_name: string;
  country: string | null;
  rating: number;
  review: string;
  created_at: string;
  is_verified: boolean;
  is_featured: boolean;
  admin_response: string | null;
};

// Explicit public column list — never `select("*")` here (that would leak email).
const PUBLIC_REVIEW_COLUMNS =
  "id, tour_id, tour_title, customer_name, country, rating, review, created_at, is_verified, is_featured, admin_response";

export async function getPublishedReviews(tourId?: string): Promise<TourReview[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("reviews")
      .select(PUBLIC_REVIEW_COLUMNS)
      .eq("published", true)
      .eq("is_spam", false)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);
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
