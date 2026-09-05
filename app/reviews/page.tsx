import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import ReviewForm from "@/components/ReviewForm";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { business } from "@/lib/constants";
import type { TourReview } from "@/lib/reviews";

export const metadata: Metadata = {
  title: `Reviews — ${business.name}`,
  description: "What guests say about their Zanzibar tours — 5-star ratings, profiles, and stories from travelers around the world.",
};

export const dynamic = "force-dynamic";

// Explicit public columns — email is NEVER selected on this page.
const PUBLIC_REVIEW_COLUMNS =
  "id, tour_id, tour_title, customer_name, country, rating, review, created_at, is_verified, is_featured, admin_response";

export default async function ReviewsPage() {
  const lang = getLang();
  const supabase = await createClient();
  const [{ data: reviews }, { data: tours }] = await Promise.all([
    supabase
      .from("reviews")
      .select(PUBLIC_REVIEW_COLUMNS)
      .eq("published", true)
      .eq("is_spam", false)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(24),
    supabase.from("tours").select("id, title").eq("is_published", true).order("title"),
  ]);

  const list = (reviews ?? []) as TourReview[];
  const tourOptions = ((tours ?? []) as { id: string; title: string }[]).map((t) => ({ id: t.id, title: t.title }));

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">Reviews</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">What guests say</h1>
      <p className="mt-3 text-stone-600 max-w-xl">Real reviews from travelers — 5 stars, verified profiles, and where they came from. Leave yours after your tour.</p>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold mb-4">All reviews</h2>
        {list.length === 0 ? (
          <p className="text-sm text-stone-500 rounded-2xl bg-stone-50 border border-dashed border-stone-300 p-6">No reviews yet — be the first to share your Zanzibar story.</p>
        ) : (
          <ReviewsCarousel
            reviews={list}
            lang={lang}
            labels={{
              verified: tServer("reviewVerified", lang),
              featured: tServer("reviewFeatured", lang),
              adminResponse: tServer("reviewAdminResponse", lang),
            }}
          />
        )}
        <div className="mt-8 rounded-xl border border-lagoon-200 bg-lagoon-50 p-4">
          <p className="text-sm font-medium text-lagoon-900">Your review matters</p>
          <p className="text-sm text-stone-700 mt-1 leading-relaxed">After you submit, your review will be highlighted on this page once our team approves it. By submitting, you accept that your review (including your name, country and rating) may be displayed publicly to help future travelers discover Zanzibar through real experiences. Your email stays private — it is never shown publicly. Thank you for sharing your story — we appreciate your trust!</p>
          <p className="text-xs text-stone-500 mt-2">All reviews are moderated — only respectful, genuine experiences are published.</p>
        </div>
      </div>
      <div className="mt-8 max-w-xl">
        <ReviewForm tours={tourOptions} />
        <p className="text-xs text-stone-500 mt-3">Your review will be shown after admin approval. {tServer("reviewEmailPrivate", lang)}</p>
      </div>
    </div>
  );
}
