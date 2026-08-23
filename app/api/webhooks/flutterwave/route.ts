import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// Parses "booking-<uuid>-<timestamp>" back into the booking id.
// UUIDs contain hyphens, so we can't just split on "-" naively.
function bookingIdFromTxRef(txRef: string): string | null {
  const match = txRef.match(/^booking-(.+)-\d+$/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("verif-hash");
  const expected = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;

  if (!expected || signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = await request.json();
  const transactionId = payload?.data?.id;
  const txRef = payload?.data?.tx_ref as string | undefined;

  if (!transactionId || !txRef) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  // Never trust the webhook body's status alone — re-verify server-to-server.
  const verifyRes = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
  );
  const verifyJson = await verifyRes.json();
  const isSuccessful =
    verifyJson?.data?.status === "successful" && verifyJson?.data?.tx_ref === txRef;

  if (!isSuccessful) {
    return NextResponse.json({ received: true, verified: false });
  }

  const bookingId = bookingIdFromTxRef(txRef);
  if (!bookingId) {
    return NextResponse.json({ received: true, verified: true, matched: false });
  }

  const supabase = createServiceClient();
  await supabase
    .from("bookings")
    .update({ payment_status: "deposit_paid" })
    .eq("id", bookingId)
    .eq("payment_ref", txRef);

  return NextResponse.json({ received: true, verified: true, matched: true });
}
