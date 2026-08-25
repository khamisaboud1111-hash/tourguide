import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";

function bookingIdFromTxRef(txRef: string): string | null {
  const match = txRef.match(/^booking-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-\d+(-[0-9a-f]+)?$/i);
  return match ? match[1] : null;
}

export const dynamic = "force-dynamic";

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tx_ref?: string; transaction_id?: string }>;
}) {
  const { status, tx_ref } = await searchParams;

  // The webhook is the source of truth. This page just reflects DB state.
  // If the webhook hasn't landed yet, show "processing" and let the user refresh.
  let state: "successful" | "failed" | "processing" = "processing";
  let bookingRef: string | null = null;

  if (tx_ref) {
    const supabase = createServiceClient();
    const { data: payment } = await supabase
      .from("payments")
      .select("status, booking_id")
      .eq("tx_ref", tx_ref)
      .maybeSingle();

    if (payment) {
      bookingRef = `ZKT-${payment.booking_id.slice(0, 8).toUpperCase()}`;
      if (payment.status === "successful") state = "successful";
      else if (payment.status === "failed") state = "failed";
      else if (status === "cancelled") state = "failed";
    } else if (status === "cancelled") {
      state = "failed";
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {state === "successful" ? (
          <>
            <CheckCircle2 className="mx-auto text-lagoon-600 mb-4" size={48} />
            <h1 className="font-display text-2xl font-semibold mb-2">Payment received</h1>
            <p className="text-stone-600 mb-1">
              {bookingRef ? <>Your booking <span className="font-mono font-semibold">{bookingRef}</span> is confirmed.</> : "Your payment is confirmed."}
            </p>
            <p className="text-sm text-stone-500 mb-8">The guide has been updated and will share the meeting point.</p>
          </>
        ) : state === "failed" ? (
          <>
            <XCircle className="mx-auto text-clove-500 mb-4" size={48} />
            <h1 className="font-display text-2xl font-semibold mb-2">Payment not completed</h1>
            <p className="text-stone-600 mb-8">No charge was made. You can try again or arrange payment on the day.</p>
          </>
        ) : (
          <>
            <Clock className="mx-auto text-saffron-500 mb-4" size={48} />
            <h1 className="font-display text-2xl font-semibold mb-2">Processing your payment…</h1>
            <p className="text-stone-600 mb-8">This page updates when the payment settles — refresh in a moment.</p>
          </>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 transition-colors text-white px-6 py-3 font-medium">
            Back to tours
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 font-medium hover:border-clove-300 transition-colors">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
