import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteTour, togglePublish } from "@/app/actions/tours";

export default async function AdminToursPage() {
  const supabase = await createClient();
  const { data: tours, error } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Tours</h1>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 rounded-full bg-lagoon-600 hover:bg-lagoon-700 transition-colors text-stone-50 px-5 py-2.5 text-sm font-medium"
        >
          <Plus size={16} /> Add tour
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3 mb-4">
          Couldn&apos;t load tours: {error.message}
        </p>
      )}

      <div className="rounded-2xl border border-stone-200 bg-stone-50 divide-y divide-stone-200">
        {tours?.length === 0 && (
          <p className="p-6 text-sm text-stone-500">No tours yet — add your first one above.</p>
        )}
        {tours?.map((tour) => (
          <div key={tour.id} className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="font-medium text-stone-900 truncate">{tour.title}</p>
              <p className="text-sm text-stone-500">
                {tour.category} · ${tour.price_usd} ·{" "}
                <span className={tour.is_published ? "text-lagoon-700" : "text-stone-400"}>
                  {tour.is_published ? "Published" : "Hidden"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <form action={togglePublish.bind(null, tour.id, !tour.is_published)}>
                <button
                  type="submit"
                  title={tour.is_published ? "Hide from site" : "Publish to site"}
                  className="p-2 text-stone-500 hover:text-lagoon-700 rounded-lg hover:bg-stone-100"
                >
                  {tour.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </form>
              <Link
                href={`/admin/tours/${tour.id}/edit`}
                className="p-2 text-stone-500 hover:text-clove-700 rounded-lg hover:bg-stone-100"
                title="Edit"
              >
                <Pencil size={18} />
              </Link>
              <form action={deleteTour.bind(null, tour.id)}>
                <button
                  type="submit"
                  title="Delete"
                  className="p-2 text-stone-500 hover:text-clove-700 rounded-lg hover:bg-stone-100"
                >
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
