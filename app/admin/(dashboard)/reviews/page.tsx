import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { authorizeStaff } from "@/lib/auth";
import { getLang, tServer } from "@/lib/i18n/server";

async function setReviewPublished(id: string, published: boolean) {
  await authorizeStaff("moderate review");
  const supabase = await createClient();
  await supabase.from("reviews").update({ published }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export default async function AdminReviewsPage() {
  const lang = getLang();
  const supabase = await createClient();
  const { data: reviews } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminReviews", lang)}</h1>
      {(reviews ?? []).length === 0 && <p className="text-sm text-stone-500">{tServer("adminNoReviewsYet", lang)}</p>}
      <div className="space-y-3">
        {(reviews ?? []).map((r) => (
          <div key={r.id} className="rounded-2xl border border-stone-200 bg-white p-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{r.customer_name} {r.country ? `· ${r.country}` : ""} <span className="text-saffron-500">{"★".repeat(r.rating)}</span></p>
              <p className="text-sm text-stone-600 mt-1">{r.review}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2.5 py-1 rounded-full ${r.published ? "bg-lagoon-100 text-lagoon-800" : "bg-stone-200 text-stone-600"}`}>
                {r.published ? tServer("adminStatusPublished", lang) : tServer("adminStatusHidden", lang)}
              </span>
              <form action={setReviewPublished.bind(null, r.id, !r.published)}>
                <button className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium hover:border-clove-300 transition-colors">
                  {r.published ? tServer("adminHide", lang) : tServer("adminPublish", lang)}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
