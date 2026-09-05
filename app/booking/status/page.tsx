import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type BookingRow = { id: string; status: string; tour_title_snapshot: string; requested_date: string | null; party_size: number | null };

export default async function BookingStatusPage({ searchParams }: { searchParams: Promise<{ ref?: string; contact?: string }> }) {
  const { ref, contact } = await searchParams;
  const clean = ref?.replace(/^ZKT-/, "").toUpperCase() ?? "";
  const contactTrim = contact?.trim() ?? "";
  let booking: BookingRow | null = null;
  let error: string | null = null;

  if (clean) {
    if (!contactTrim) {
      error = "Please also enter the email or WhatsApp you used to book, to verify ownership.";
    } else {
      const supabase = await createClient();
      // Use eq with full prefix + contact verification to prevent IDOR enumeration
      const { data, error: qErr } = await supabase
        .from("bookings")
        .select("id, status, tour_title_snapshot, requested_date, party_size, customer_contact, whatsapp")
        .ilike("id", `${clean.toLowerCase()}%`)
        .maybeSingle() as unknown as { data: (BookingRow & { customer_contact: string | null; whatsapp: string | null }) | null; error: { message: string } | null };
      if (qErr) error = qErr.message;
      else if (data && data.customer_contact !== contactTrim && data.whatsapp !== contactTrim) {
        error = "Reference and contact do not match — please check the email/WhatsApp you used when booking.";
      } else booking = data as BookingRow | null;
    }
  }

  return (
    <div className="container-page py-10 md:py-14 max-w-lg">
      <h1 className="font-display text-2xl font-semibold">Booking status</h1>
      <p className="text-sm text-stone-600 mt-2">Enter your reference (e.g. ZKT-ABC12345) to check if your tour was accepted.</p>

      <form method="get" className="mt-6 flex flex-col gap-3">
        <input name="ref" defaultValue={ref ?? ""} placeholder="ZKT-..." className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
        <input name="contact" defaultValue={contact ?? ""} placeholder="Email or WhatsApp used when booking" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-clove-500" />
        <button className="rounded-full bg-clove-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-clove-700">Check</button>
        <p className="text-xs text-stone-500">Your reference + contact must match to view status (prevents others from seeing your booking).</p>
      </form>

      {clean && !booking && !error && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">No booking found for <span className="font-mono">{ref}</span> — check the reference or ask on WhatsApp.</p>
      )}
      {error && <p className="mt-6 rounded-xl border border-clove-200 bg-clove-50 p-4 text-sm text-clove-700">{error}</p>}
      {booking && (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 space-y-3">
          <p className="font-medium">{booking.tour_title_snapshot}</p>
          <p className="text-sm text-stone-600">Date: {booking.requested_date ?? "—"} · Travelers: {booking.party_size ?? "—"}</p>
          <p className="text-sm">
            Status:{" "}
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${booking.status === "confirmed" || booking.status === "accepted" ? "bg-lagoon-100 text-lagoon-800" : booking.status === "cancelled" ? "bg-clove-100 text-clove-700" : "bg-amber-100 text-amber-800"}`}>
              {booking.status}
            </span>
          </p>
          <p className="text-xs text-stone-500">
            {booking.status === "pending" && "Admin will answer via your WhatsApp/email whether accepted or not. Please wait."}
            {(booking.status === "confirmed" || booking.status === "accepted") && "Your booking was accepted — admin will send meeting point details on WhatsApp/email."}
            {booking.status === "cancelled" && "Your booking was not accepted — contact us on WhatsApp for alternatives."}
          </p>
        </div>
      )}
    </div>
  );
}
