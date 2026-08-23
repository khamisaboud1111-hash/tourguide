import Link from "next/link";
import { Inbox, MapPin, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ count: newBookings }, { count: totalTours }] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("tours").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Overview</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/bookings"
          className="rounded-2xl border border-stone-200 bg-stone-50 p-6 hover:border-clove-300 transition-colors"
        >
          <Inbox className="text-clove-600 mb-3" size={22} />
          <p className="text-3xl font-display font-semibold">{newBookings ?? 0}</p>
          <p className="text-sm text-stone-500">New booking requests</p>
        </Link>
        <Link
          href="/admin/tours"
          className="rounded-2xl border border-stone-200 bg-stone-50 p-6 hover:border-clove-300 transition-colors"
        >
          <MapPin className="text-clove-600 mb-3" size={22} />
          <p className="text-3xl font-display font-semibold">{totalTours ?? 0}</p>
          <p className="text-sm text-stone-500">Tours listed</p>
        </Link>
      </div>

      <Link
        href="/admin/tours/new"
        className="inline-flex items-center gap-2 rounded-full bg-lagoon-600 hover:bg-lagoon-700 transition-colors text-stone-50 px-5 py-2.5 text-sm font-medium"
      >
        <Plus size={16} /> Add a new tour
      </Link>
    </div>
  );
}
