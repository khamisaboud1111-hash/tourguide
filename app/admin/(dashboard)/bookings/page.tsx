import { createClient } from "@/lib/supabase/server";
import { updateBookingStatus, updatePaymentStatus } from "@/app/actions/bookings";
import AutoSubmitSelect from "@/components/admin/AutoSubmitSelect";

const statusOptions = ["new", "contacted", "confirmed", "completed", "cancelled"];
const paymentOptions = ["unpaid", "deposit_paid", "paid_in_full"];

const statusColors: Record<string, string> = {
  new: "bg-saffron-100 text-saffron-800",
  contacted: "bg-lagoon-100 text-lagoon-800",
  confirmed: "bg-lagoon-200 text-lagoon-900",
  completed: "bg-stone-200 text-stone-700",
  cancelled: "bg-clove-100 text-clove-700",
};

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Bookings</h1>

      {error && (
        <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3 mb-4">
          Couldn&apos;t load bookings: {error.message}
        </p>
      )}

      <div className="space-y-4">
        {bookings?.length === 0 && (
          <p className="text-sm text-stone-500">
            No booking requests yet — they&apos;ll show up here as soon as someone submits the
            form on the tour detail page.
          </p>
        )}

        {bookings?.map((b) => (
          <div key={b.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-900">{b.customer_name}</p>
                <p className="text-sm text-stone-500">{b.customer_contact}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status] ?? "bg-stone-200"}`}>
                {b.status}
              </span>
            </div>

            <div className="mt-3 text-sm text-stone-700 space-y-1">
              <p><span className="text-stone-500">Tour:</span> {b.tour_title_snapshot}</p>
              {b.requested_date && <p><span className="text-stone-500">Requested date:</span> {b.requested_date}</p>}
              {b.party_size && <p><span className="text-stone-500">Party size:</span> {b.party_size}</p>}
              {b.message && <p><span className="text-stone-500">Message:</span> {b.message}</p>}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
