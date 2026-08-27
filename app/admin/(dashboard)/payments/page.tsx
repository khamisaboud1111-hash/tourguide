import { createClient } from "@/lib/supabase/server";
import { ExportButton } from "@/components/admin/ExportButton";
import { MetricCard } from "@/components/admin/Charts";
import { CreditCard, DollarSign, ArrowUpRight, Wallet } from "lucide-react";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const payments = (bookings ?? []).map((b) => ({
    id: b.id,
    ref: `ZKT-${b.id.slice(0, 8).toUpperCase()}`,
    customer_name: b.customer_name,
    tour: b.tour_title_snapshot,
    total: Number(b.total_usd ?? 0),
    deposit: Number(b.deposit_usd ?? 0),
    remaining: Number(b.remaining_usd ?? 0),
    payment_status: b.payment_status,
    payment_method: b.payment_method ?? "—",
    payment_ref: b.payment_ref ?? "—",
    date: b.created_at,
  }));

  const paid = payments.reduce((s, p) => s + p.deposit, 0);
  const outstanding = payments.reduce((s, p) => s + p.remaining, 0);
  const collected = payments.filter((p) => p.payment_status === "paid_in_full").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Payments</h1>
        <div className="flex gap-2">
          <ExportButton
            filename="payments"
            data={payments}
            columns={[
              { key: "ref", header: "Reference" },
              { key: "customer_name", header: "Customer" },
              { key: "tour", header: "Tour" },
              { key: "total", header: "Total (USD)" },
              { key: "deposit", header: "Deposit (USD)" },
              { key: "remaining", header: "Remaining (USD)" },
              { key: "payment_status", header: "Status" },
              { key: "payment_method", header: "Method" },
              { key: "payment_ref", header: "Payment Ref" },
            ]}
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Deposits collected" value={`$${paid.toFixed(0)}`} icon={<DollarSign size={20} />} color="lagoon" />
        <MetricCard title="Outstanding" value={`$${outstanding.toFixed(0)}`} icon={<Wallet size={20} />} color="clove" />
        <MetricCard title="Paid in full" value={collected} icon={<CreditCard size={20} />} color="lagoon" />
        <MetricCard title="Total payments" value={payments.length} icon={<ArrowUpRight size={20} />} color="clove" />
      </div>

      {error && (
        <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3 mb-4">
          Couldn&apos;t load payments: {error.message}
        </p>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {["Reference", "Customer", "Tour", "Total", "Deposit", "Remaining", "Status", "Method"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{p.ref}</td>
                  <td className="px-4 py-3 text-sm text-stone-800">{p.customer_name}</td>
                  <td className="px-4 py-3 text-sm text-stone-600">{p.tour}</td>
                  <td className="px-4 py-3 text-sm font-medium">${p.total.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-lagoon-700">${p.deposit.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-stone-500">${p.remaining.toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      p.payment_status === "paid_in_full"
                        ? "bg-lagoon-600 text-white"
                        : p.payment_status === "deposit_paid"
                        ? "bg-lagoon-100 text-lagoon-800"
                        : "bg-stone-200 text-stone-600"
                    }`}>
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-500">{p.payment_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <p className="text-sm text-stone-500 p-6 text-center">No payments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}