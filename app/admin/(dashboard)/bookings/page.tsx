import { createClient } from "@/lib/supabase/server";
import { updateBookingStatus, updatePaymentStatus } from "@/app/actions/bookings";
import AutoSubmitSelect from "@/components/admin/AutoSubmitSelect";

const statusOptions = ["pending", "contacted", "confirmed", "deposit_pending", "deposit_paid", "ready", "completed", "cancelled", "refunded", "rescheduled"];
const paymentOptions = ["unpaid", "deposit_paid", "paid_in_full"];

const statusColors: Record<string, string> = {
  pending: "bg-saffron-100 text-saffron-800",
  contacted: "bg-lagoon-100 text-lagoon-800",
  confirmed: "bg-lagoon-200 text-lagoon-900",
  deposit_pending: "bg-saffron-50 text-saffron-800",
  deposit_paid: "bg-lagoon-100 text-lagoon-900",
  ready: "bg-lagoon-200 text-lagoon-900",
  completed: "bg-stone-200 text-stone-700",
  cancelled: "bg-clove-100 text-clove-700",
  refunded: "bg-clove-50 text-clove-700",
  rescheduled: "bg-stone-100 text-stone-700",
};

function ref(id: string) {
  return `ZKT-${id.slice(0, 8).toUpperCase()}`;
}

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = (bookings ?? []).filter((b) => b.status === "pending").length;
  const confirmed = (bookings ?? []).filter((b) => ["confirmed", "deposit_paid", "ready"].includes(b.status)).length;
  const deposits = (bookings ?? []).filter((b) => b.payment_status !== "unpaid").reduce((s, b) => s + Number(b.deposit_usd ?? 0), 0);
  const outstanding = (bookings ?? []).filter((b) => !["cancelled", "refunded"].includes(b.status)).reduce((s, b) => s + Number(b.remaining_usd ?? 0), 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Bookings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pending", value: pending },
          { label: "Confirmed", value: confirmed },
          { label: "Deposits received", value: `$${deposits.toFixed(0)}` },
          { label: "Outstanding", value: `$${outstanding.toFixed(0)}` },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-2xl font-display font-semibold">{c.value}</p>
            <p className="text-xs text-stone-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3 mb-4">
          Couldn&apos;t load bookings: {error.message}
        </p>
      )}

      <div className="space-y-4">
        {bookings?.length === 0 && (
          <p className="text-sm text-stone-500">
            No booking requests yet — they&apos;ll show up here as soon as someone submits the
            booking form or /book page.
          </p>
        )}

        {bookings?.map((b) => (
          <div key={b.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-900">
                  <span className="font-mono text-xs text-stone-400 mr-2">{ref(b.id)}</span>
                  {b.customer_name}
                </p>
                <p className="text-sm text-stone-500">{b.customer_contact}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.payment_status === "paid_in_full" ? "bg-lagoon-600 text-white" : b.payment_status === "deposit_paid" ? "bg-lagoon-100 text-lagoon-800" : "bg-stone-200 text-stone-600"}`}>
                  {b.payment_status}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status] ?? "bg-stone-200"}`}>
                  {b.status}
                </span>
              </div>
            </div>

            <div className="mt-3 text-sm text-stone-700 space-y-1">
              <p><span className="text-stone-500">Tour:</span> {b.tour_title_snapshot}</p>
              <p><span className="text-stone-500">Date:</span> {b.requested_date ?? "—"} · <span className="text-stone-500">Travelers:</span> {b.party_size ?? "—"}</p>
              {(b.pickup_location || b.pickup_notes) && <p><span className="text-stone-500">Pickup:</span> {b.pickup_location ?? ""} {b.pickup_notes ?? ""}</p>}
              {b.country && <p><span className="text-stone-500">Country:</span> {b.country}</p>}
              {b.message && <p><span className="text-stone-500">Message:</span> {b.message}</p>}
            </div>

            {/* Pricing */}
            <div className="mt-3 rounded-xl bg-white border border-stone-200 p-3 text-sm grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><p className="text-xs text-stone-500">Subtotal</p><p className="font-medium">{b.total_usd ? `$${Number(b.total_usd).toFixed(0)}` : "—"}</p></div>
              <div><p className="text-xs text-stone-500">Deposit</p><p className="font-medium">{b.deposit_usd ? `$${Number(b.deposit_usd).toFixed(0)}` : "—"}</p></div>
              <div><p className="text-xs text-stone-500">Remaining</p><p className="font-medium">{b.remaining_usd ? `$${Number(b.remaining_usd).toFixed(0)}` : "—"}</p></div>
              <div><p className="text-xs text-stone-500">Payment ref</p><p className="font-mono text-xs truncate">{b.payment_ref ?? "—"}</p></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <form action={async (fd: FormData) => {
                "use server";
                await updateBookingStatus(b.id, String(fd.get("status")));
              }}>
                <AutoSubmitSelect name="status" defaultValue={b.status} options={statusOptions} />
              </form>

              <form action={async (fd: FormData) => {
                "use server";
                await updatePaymentStatus(b.id, String(fd.get("payment_status")));
              }}>
                <AutoSubmitSelect name="payment_status" defaultValue={b.payment_status} options={paymentOptions} />
              </form>

              <a href={`https://wa.me/${b.customer_contact.replace(/[^\d]/g, "").replace(/^0/, "255")}?text=${encodeURIComponent(`Hi ${b.customer_name}, regarding your booking ${ref(b.id)} — ${b.tour_title_snapshot}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-lagoon-300 text-lagoon-700 px-3 py-1.5 text-xs font-medium hover:bg-lagoon-50 transition-colors">
                WhatsApp customer
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
