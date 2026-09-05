import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import ReviewForm from "@/components/ReviewForm";
import ReportReviewButton from "@/components/ReportReviewButton";
import { business } from "@/lib/constants";
import { maskName, countryWithFlag, starString } from "@/lib/review-display";
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

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">All reviews</h2>
          {list.length === 0 ? (
            <p className="text-sm text-stone-500 rounded-2xl bg-stone-50 border border-dashed border-stone-300 p-6">No reviews yet — be the first to share your Zanzibar story.</p>
          ) : (
            <div className="space-y-4">
              {list.map((r) => (
                <figure key={r.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-saffron-500 text-sm" aria-label={`${r.rating} out of 5`}>
                      {starString(r.rating).slice(0, Math.max(0, Math.min(5, Math.round(r.rating))))}
                      <span className="text-stone-300">{"★".repeat(5 - Math.max(0, Math.min(5, Math.round(r.rating))))}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {r.is_verified && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-lagoon-100 text-lagoon-800">
                          ✓ {tServer("reviewVerified", lang)}
                        </span>
                      )}
                      {r.is_featured && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-700">
                          {tServer("reviewFeatured", lang)}
                        </span>
                      )}
                    </div>
                  </div>
                  <blockquote className="mt-2 text-sm text-stone-700 leading-relaxed">“{r.review}”</blockquote>
                  {r.tour_title && (
                    <p className="mt-2 text-xs font-medium text-clove-700">{r.tour_title}</p>
                  )}
                  {r.admin_response && (
                    <div className="mt-3 rounded-xl bg-stone-50 border border-stone-200 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{tServer("reviewAdminResponse", lang)}</p>
                      <p className="mt-1 text-sm text-stone-700 leading-relaxed">{r.admin_response}</p>
                    </div>
                  )}
                  <figcaption className="mt-3 flex items-center justify-between gap-2 text-xs text-stone-500">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clove-100 text-clove-700 font-medium">{maskName(r.customer_name).charAt(0).toUpperCase()}</span>
                      <span className="truncate">
                        <span className="font-medium text-stone-700">{maskName(r.customer_name)}</span>
                        {r.country ? ` · ${countryWithFlag(r.country)}` : ""} · {new Date(r.created_at).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </span>
                    <ReportReviewButton reviewId={r.id} />
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          <div className="mt-8 rounded-xl border border-lagoon-200 bg-lagoon-50 p-4">
            <p className="text-sm font-medium text-lagoon-900">Your review matters</p>
            <p className="text-sm text-stone-700 mt-1 leading-relaxed">After you submit, your review will be highlighted on this page once our team approves it. By submitting, you accept that your review (including your name, country and rating) may be displayed publicly to help future travelers discover Zanzibar through real experiences. Your email stays private — it is never shown publicly. Thank you for sharing your story — we appreciate your trust!</p>
            <p className="text-xs text-stone-500 mt-2">All reviews are moderated — only respectful, genuine experiences are published.</p>
          </div>
        </div>
        <div>
          <ReviewForm tours={tourOptions} />
          <p className="text-xs text-stone-500 mt-3">Your review will be shown after admin approval. {tServer("reviewEmailPrivate", lang)}</p>
        </div>
      </div>
    </div>
  );
}
