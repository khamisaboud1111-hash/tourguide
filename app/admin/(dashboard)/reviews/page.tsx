import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { authorizeStaff } from "@/lib/auth";
import { getLang, tServer } from "@/lib/i18n/server";

async function setReviewPublished(id: string, published: boolean) {
  "use server";
  await authorizeStaff("moderate review");
  const supabase = await createClient();
  await supabase.from("reviews").update({ published }).eq("id", id);
  revalidatePath("/admin/reviews");
}

type ReviewRow = { id: string; customer_name: string; email?: string | null; country?: string | null; rating: number; review: string; published: boolean };

export default async function AdminReviewsPage() {
  const lang = getLang();
  const supabase = await createClient();
  let reviews: ReviewRow[] | null = null;
  let fetchError: string | null = null;
  try {
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) fetchError = error.message;
    else reviews = data as unknown as ReviewRow[];
  } catch (e: unknown) {
    fetchError = e instanceof Error ? e.message : "Could not load reviews";
  }

  const list: ReviewRow[] = reviews ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminReviews", lang)}</h1>
      {fetchError && <p className="mb-4 rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3">{fetchError}</p>}
      {list.length === 0 && <p className="text-sm text-stone-500">{tServer("adminNoReviewsYet", lang)}</p>}
      <div className="space-y-3">
          {list.map((r) => (
          <div key={r.id} className="rounded-2xl border border-stone-200 bg-white p-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{r.customer_name} {r.email ? `· ${r.email}` : ""} {r.country ? `· ${r.country}` : ""} <span className="text-saffron-500">{"★".repeat(r.rating)}</span></p>
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
