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
  revalidatePath("/reviews");
}

async function deleteReview(id: string) {
  "use server";
  await authorizeStaff("moderate review");
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

async function setReviewFlags(id: string, formData: FormData) {
  "use server";
  await authorizeStaff("moderate review");
  const supabase = await createClient();
  await supabase
    .from("reviews")
    .update({
      is_verified: formData.get("is_verified") === "on",
      is_featured: formData.get("is_featured") === "on",
      is_spam: formData.get("is_spam") === "on",
      moderation_reason: (formData.get("moderation_reason") as string) || null,
    })
    .eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

async function saveAdminResponse(id: string, formData: FormData) {
  "use server";
  await authorizeStaff("moderate review");
  const supabase = await createClient();
  const response = ((formData.get("admin_response") as string) ?? "").trim();
  await supabase.from("reviews").update({ admin_response: response || null }).eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

type ReviewRow = {
  id: string;
  tour_id: string | null;
  tour_title: string | null;
  customer_name: string;
  email?: string | null;
  country?: string | null;
  rating: number;
  review: string;
  published: boolean;
  created_at: string;
  is_verified: boolean;
  is_featured: boolean;
  is_spam: boolean;
  moderation_reason: string | null;
  admin_response: string | null;
};

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
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{r.customer_name} {r.email ? `· ${r.email}` : ""} {r.country ? `· ${r.country}` : ""} <span className="text-saffron-500">{"★".repeat(r.rating)}</span></p>
              <p className="text-sm text-stone-600 mt-1">{r.review}</p>
              {r.tour_title && <p className="text-xs font-medium text-clove-700 mt-1">Tour: {r.tour_title}</p>}
              <p className="text-xs text-stone-400 mt-1">{new Date(r.created_at).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {r.is_verified && <span className="text-[11px] px-2 py-0.5 rounded-full bg-lagoon-100 text-lagoon-800">✓ Verified booking</span>}
                {r.is_featured && <span className="text-[11px] px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-700">Featured</span>}
                {r.is_spam && <span className="text-[11px] px-2 py-0.5 rounded-full bg-clove-100 text-clove-700">Spam</span>}
                {r.moderation_reason && <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-600" title={r.moderation_reason}>Flagged: {r.moderation_reason.slice(0, 60)}</span>}
              </div>
              <form action={saveAdminResponse.bind(null, r.id)} className="mt-3 flex gap-2">
                <input
                  name="admin_response"
                  defaultValue={r.admin_response ?? ""}
                  placeholder="Write a public response from the team…"
                  className="flex-1 min-w-0 rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-clove-500"
                />
                <button className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium hover:border-clove-300 transition-colors shrink-0">
                  {r.admin_response ? "Update response" : "Respond"}
                </button>
              </form>
              <form action={setReviewFlags.bind(null, r.id)} className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                <label className="flex items-center gap-1"><input type="checkbox" name="is_verified" defaultChecked={r.is_verified} className="rounded border-stone-300" /> Verified</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="is_featured" defaultChecked={r.is_featured} className="rounded border-stone-300" /> Featured</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="is_spam" defaultChecked={r.is_spam} className="rounded border-stone-300" /> Spam</label>
                <input name="moderation_reason" defaultValue={r.moderation_reason ?? ""} placeholder="Moderation reason (admin only)" className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-1 text-xs outline-none focus:border-clove-500 min-w-40" />
                <button className="rounded-full border border-stone-300 px-3 py-1 font-medium hover:border-clove-300 transition-colors">Save</button>
              </form>
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
              <form action={deleteReview.bind(null, r.id)}>
                <button className="rounded-full border border-clove-200 bg-clove-50 text-clove-700 px-3 py-1.5 text-xs font-medium hover:bg-clove-100 transition-colors">
                  {tServer("adminDelete", lang)}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
