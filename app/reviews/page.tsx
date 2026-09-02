import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";
import ReviewForm from "@/components/ReviewForm";
import { business } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Reviews — ${business.name}`,
  description: "What guests say about their Zanzibar tours — 5-star ratings, profiles, and stories from travelers around the world.",
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const lang = getLang();
  const supabase = await createClient();
  const { data: reviews } = await supabase.from("reviews").select("*").eq("published", true).order("created_at", { ascending: false }).limit(24);

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-clove-700 text-xs uppercase tracking-[0.2em] font-medium mb-3">Reviews</p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-2xl text-balance">What guests say</h1>
      <p className="mt-3 text-stone-600 max-w-xl">Real reviews from travelers — 5 stars, verified profiles, and where they came from. Leave yours after your tour.</p>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">All reviews</h2>
          {(reviews ?? []).length === 0 ? (
            <p className="text-sm text-stone-500 rounded-2xl bg-stone-50 border border-dashed border-stone-300 p-6">No reviews yet — be the first to share your Zanzibar story.</p>
          ) : (
            <div className="space-y-4">
              {(reviews ?? []).map((r) => (
                <figure key={r.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
                  <div className="text-saffron-500 text-sm">{"★".repeat(r.rating)}<span className="text-stone-300">{"★".repeat(5 - r.rating)}</span></div>
                  <blockquote className="mt-2 text-sm text-stone-700 leading-relaxed">“{r.review}”</blockquote>
                  <figcaption className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-clove-100 text-clove-700 font-medium">{r.customer_name.charAt(0).toUpperCase()}</span>
                    <span>
                      <span className="font-medium text-stone-700">{r.customer_name}</span>
                      {r.email ? ` · ${r.email}` : ""} {r.country ? `· ${r.country}` : ""} · {new Date(r.created_at).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { month: "short", year: "numeric" })}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
        <div>
          <ReviewForm />
          <p className="text-xs text-stone-500 mt-3">Your review will be shown after admin approval. Your profile (name, email, country) helps future travelers trust your story.</p>
        </div>
      </div>
    </div>
  );
}
