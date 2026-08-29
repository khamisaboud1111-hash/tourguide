import { createClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "@/app/actions/bookings";
import AutoSubmitSelect from "@/components/admin/AutoSubmitSelect";
import { getLang, tServer } from "@/lib/i18n/server";

const statusOptions = ["pending", "contacted", "confirmed", "ready", "completed", "cancelled", "rescheduled"];

const statusColors: Record<string, string> = {
  pending: "bg-saffron-100 text-saffron-800",
  contacted: "bg-lagoon-100 text-lagoon-800",
  confirmed: "bg-lagoon-200 text-lagoon-900",
  ready: "bg-lagoon-200 text-lagoon-900",
  completed: "bg-stone-200 text-stone-700",
  cancelled: "bg-clove-100 text-clove-700",
  rescheduled: "bg-stone-100 text-stone-700",
};

function ref(id: string) {
  return `ZKT-${id.slice(0, 8).toUpperCase()}`;
}

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const lang = getLang();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = (bookings ?? []).filter((b) => b.status === "pending").length;
  const confirmed = (bookings ?? []).filter((b) => ["confirmed", "ready"].includes(b.status)).length;
  const completed = (bookings ?? []).filter((b) => b.status === "completed").length;
  const cancelled = (bookings ?? []).filter((b) => b.status === "cancelled").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">{tServer("adminNavBookings", lang)}</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: tServer("adminStatusPending", lang), value: pending },
          { label: tServer("adminStatusConfirmed", lang), value: confirmed },
          { label: tServer("adminStatusCompleted", lang), value: completed },
          { label: tServer("adminStatusCancelled", lang), value: cancelled },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-2xl font-display font-semibold">{c.value}</p>
            <p className="text-xs text-stone-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-clove-50 text-clove-700 text-sm px-4 py-3 mb-4">
          {tServer("adminBookingsLoadError", lang).replace("{message}", error.message)}
        </p>
      )}

      <div className="space-y-4">
        {bookings?.length === 0 && (
          <p className="text-sm text-stone-500">
            {tServer("adminBookingsEmpty", lang)}
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
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status] ?? "bg-stone-200"}`}>
                  {b.status}
                </span>
              </div>
            </div>

            <div className="mt-3 text-sm text-stone-700 space-y-1">
              <p><span className="text-stone-500">{tServer("adminTour", lang)}:</span> {b.tour_title_snapshot}</p>
              <p><span className="text-stone-500">{tServer("date", lang)}:</span> {b.requested_date ?? "—"} · <span className="text-stone-500">{tServer("travelers", lang)}:</span> {b.party_size ?? "—"}</p>
              {(b.pickup_location || b.pickup_notes) && <p><span className="text-stone-500">{tServer("adminPickup", lang)}:</span> {b.pickup_location ?? ""} {b.pickup_notes ?? ""}</p>}
              {b.country && <p><span className="text-stone-500">{tServer("adminCountry", lang)}:</span> {b.country}</p>}
              {b.message && <p><span className="text-stone-500">{tServer("adminMessage", lang)}:</span> {b.message}</p>}
            </div>

            {/* Pricing */}
            <div className="mt-3 rounded-xl bg-white border border-stone-200 p-3 text-sm inline-block">
              <div className="inline-flex items-center gap-2"><span className="text-xs text-stone-500">{tServer("total", lang)}</span><span className="font-medium">{b.total_usd ? `$${Number(b.total_usd).toFixed(0)}` : "—"}</span></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <form action={async (fd: FormData) => {
                "use server";
                await updateBookingStatus(b.id, String(fd.get("status")));
              }}>
                <AutoSubmitSelect name="status" defaultValue={b.status} options={statusOptions} />
              </form>

              <a href={`https://wa.me/${b.customer_contact.replace(/[^\d]/g, "").replace(/^0/, "255")}?text=${encodeURIComponent(tServer("adminBookingWhatsAppMessage", lang).replace("{name}", b.customer_name).replace("{ref}", ref(b.id)).replace("{tour}", b.tour_title_snapshot))}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-lagoon-300 text-lagoon-700 px-3 py-1.5 text-xs font-medium hover:bg-lagoon-50 transition-colors">
                {tServer("adminBookingWhatsAppCustomer", lang)}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
