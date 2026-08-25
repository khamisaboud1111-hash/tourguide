import { createClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: bookings } = await supabase.from("bookings").select("customer_id, status, total_usd, deposit_usd, remaining_usd, requested_date");

  const byCustomer = new Map<string, { count: number; completed: number; revenue: number; outstanding: number; last: string | null }>();
  for (const b of bookings ?? []) {
    if (!b.customer_id) continue;
    const cur = byCustomer.get(b.customer_id) ?? { count: 0, completed: 0, revenue: 0, outstanding: 0, last: null };
    cur.count += 1;
    if (b.status === "completed") cur.completed += 1;
    cur.revenue += Number(b.deposit_usd ?? 0);
    if (!["cancelled", "refunded"].includes(b.status)) cur.outstanding += Number(b.remaining_usd ?? 0);
    if (b.requested_date && (!cur.last || b.requested_date > cur.last)) cur.last = b.requested_date;
    byCustomer.set(b.customer_id, cur);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Customers</h1>

      {(customers ?? []).length === 0 && (
        <p className="text-sm text-stone-500">No customers yet — they&apos;re created automatically with each booking.</p>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
        {(customers ?? []).map((c) => {
          const s = byCustomer.get(c.id);
          return (
            <div key={c.id} className="p-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-stone-900">{c.full_name}</p>
                <p className="text-sm text-stone-500">{c.email ?? c.phone}{c.country ? ` · ${c.country}` : ""}</p>
                <p className="text-xs text-stone-400 mt-1">Joined {new Date(c.created_at).toLocaleDateString("en-GB")}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-xs text-stone-500">Bookings</p><p className="font-medium">{s?.count ?? 0}</p></div>
                <div><p className="text-xs text-stone-500">Completed</p><p className="font-medium">{s?.completed ?? 0}</p></div>
                <div><p className="text-xs text-stone-500">Deposits</p><p className="font-medium">${(s?.revenue ?? 0).toFixed(0)}</p></div>
                <div><p className="text-xs text-stone-500">Outstanding</p><p className="font-medium">${(s?.outstanding ?? 0).toFixed(0)}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
