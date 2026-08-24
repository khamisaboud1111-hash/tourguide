import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";

function bookingIdFromTxRef(txRef: string): string | null {
  const match = txRef.match(/^booking-(.+)-\d+$/);
  return match ? match[1] : null;
}

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tx_ref?: string; transaction_id?: string }>;
}) {
  const { status, tx_ref, transaction_id } = await searchParams;

  let verified = false;
  let message = "We couldn't confirm this payment.";

  if (status === "successful" && tx_ref && transaction_id && process.env.FLUTTERWAVE_SECRET_KEY) {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
    );
    const verifyJson = await verifyRes.json();

    if (verifyJson?.data?.status === "successful" && verifyJson?.data?.tx_ref === tx_ref) {
      verified = true;
      message = "Your deposit is confirmed.";

      const bookingId = bookingIdFromTxRef(tx_ref);
      if (bookingId) {
        const supabase = createServiceClient();
        await supabase
          .from("bookings")
          .update({ payment_status: "deposit_paid" })
          .eq("id", bookingId)
          .eq("payment_ref", tx_ref);
      }
    }
  } else if (status === "cancelled") {
    message = "Payment was cancelled — no charge was made.";
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {verified ? (
          <CheckCircle2 className="mx-auto text-lagoon-600 mb-4" size={48} />
        ) : (
          <XCircle className="mx-auto text-clove-500 mb-4" size={48} />
        )}
        <h1 className="font-display text-2xl font-semibold mb-2">
          {verified ? "Payment received" : "Payment not completed"}
        </h1>
        <p className="text-stone-600 mb-8">{message}</p>
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 rounded-full bg-clove-600 hover:bg-clove-700 transition-colors text-stone-50 px-6 py-3 font-medium"
        >
          Back to tours
        </Link>
      </div>
    </div>
  );
}
