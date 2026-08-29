import { createClient } from "@/lib/supabase/server";
import { getLang, tServer } from "@/lib/i18n/server";

export default async function AdminCustomersPage() {
  const lang = getLang();
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: bookings } = await supabase.from("bookings").select("customer_id, status, total_usd, requested_date");

  const byCustomer = new Map<string, { count: number; completed: number; revenue: number; last: string | null }>();
  for (const b of bookings ?? []) {
    if (!b.customer_id) continue;
    const cur = byCustomer.get(b.customer_id) ?? { count: 0, completed: 0, revenue: 0, last: null };
    cur.count += 1;
    if (b.status === "completed") cur.completed += 1;
    if (b.status !== "cancelled") cur.revenue += Number(b.total_usd ?? 0);
    if (b.requested_date && (!cur.last || b.requested_date > cur.last)) cur.last = b.requested_date;
    byCustomer.set(b.customer_id, cur);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminCustomersTitle", lang)}</h1>

      {(customers ?? []).length === 0 && (
        <p className="text-sm text-stone-500">{tServer("adminCustomersEmpty", lang)}</p>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
        {(customers ?? []).map((c) => {
          const s = byCustomer.get(c.id);
          return (
            <div key={c.id} className="p-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-stone-900">{c.full_name}</p>
                <p className="text-sm text-stone-500">{c.email ?? c.phone}{c.country ? ` · ${c.country}` : ""}</p>
                <p className="text-xs text-stone-400 mt-1">{tServer("adminCustomersJoined", lang).replace("{date}", new Date(c.created_at).toLocaleDateString("en-GB"))}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><p className="text-xs text-stone-500">{tServer("adminCustomersBookings", lang)}</p><p className="font-medium">{s?.count ?? 0}</p></div>
                <div><p className="text-xs text-stone-500">{tServer("adminCustomersCompleted", lang)}</p><p className="font-medium">{s?.completed ?? 0}</p></div>
                <div><p className="text-xs text-stone-500">{tServer("adminCustomersTotalBooked", lang)}</p><p className="font-medium">${(s?.revenue ?? 0).toFixed(0)}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
