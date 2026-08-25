import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

// Parses "booking-<uuid>-<timestamp>-<rand>" (new) or "booking-<uuid>-<timestamp>" (legacy).
function bookingIdFromTxRef(txRef: string): string | null {
  const match = txRef.match(/^booking-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-\d+(-[0-9a-f]+)?$/i);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("verif-hash") ?? "";
  const expected = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH ?? "";
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  const valid = expected.length > 0 && sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = await request.json();
  const transactionId = payload?.data?.id;
  const txRef = payload?.data?.tx_ref as string | undefined;
  const event = payload?.event as string | undefined;

  if (!transactionId || !txRef) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Idempotency: if this tx_ref already completed, stop here.
  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, status, booking_id, amount_usd")
    .eq("tx_ref", txRef)
    .maybeSingle();

  if (existingPayment?.status === "successful") {
    return NextResponse.json({ received: true, idempotent: true });
  }

  // Never trust the webhook body's status alone — re-verify server-to-server.
  // Timeout prevents a hung upstream call from blocking the route.
  const verifyRes = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` }, signal: AbortSignal.timeout(10_000) }
  );
  const verifyJson = await verifyRes.json();
  const isSuccessful =
    verifyJson?.data?.status === "successful" && verifyJson?.data?.tx_ref === txRef;

  if (!isSuccessful) {
    if (existingPayment) {
      await supabase.from("payments").update({ status: "failed", flutterwave_transaction_id: String(transactionId), updated_at: new Date().toISOString() }).eq("id", existingPayment.id);
    }
    return NextResponse.json({ received: true, verified: false });
  }

  const bookingId = bookingIdFromTxRef(txRef);
  const paidAmount = Number(verifyJson?.data?.amount ?? 0);

  if (!bookingId) {
    return NextResponse.json({ received: true, verified: true, matched: false });
  }

  // Validate booking exists and amount matches expectation
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, payment_status, deposit_usd, remaining_usd, status")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    return NextResponse.json({ received: true, verified: true, matched: false });
  }

  const expectedAmount = booking.payment_status === "deposit_paid"
    ? Number(booking.remaining_usd ?? 0)
    : Number(booking.deposit_usd ?? 0);

  // Tolerance of $1 for FX rounding
  if (expectedAmount <= 0 || Math.abs(paidAmount - expectedAmount) > 1) {
    console.error("Payment amount mismatch", { txRef, paidAmount, expectedAmount, bookingId });
    if (existingPayment) {
      await supabase.from("payments").update({ status: "failed", flutterwave_transaction_id: String(transactionId), updated_at: new Date().toISOString() }).eq("id", existingPayment.id);
    }
    return NextResponse.json({ received: true, verified: true, amount_valid: false });
  }

  // Record payment once + update booking
  if (existingPayment) {
    await supabase.from("payments").update({
      status: "successful",
      flutterwave_transaction_id: String(transactionId),
      updated_at: new Date().toISOString(),
    }).eq("id", existingPayment.id);
  } else {
    await supabase.from("payments").insert({
      booking_id: bookingId,
      tx_ref: txRef,
      flutterwave_transaction_id: String(transactionId),
      amount_usd: paidAmount,
      currency: "USD",
      status: "successful",
    });
  }

  const nextPaymentStatus = booking.payment_status === "deposit_paid" ? "paid_in_full" : "deposit_paid";
  const nextStatus = booking.status === "pending" || booking.status === "contacted" ? "confirmed" : booking.status;

  await supabase
    .from("bookings")
    .update({ payment_status: nextPaymentStatus, status: nextStatus })
    .eq("id", bookingId);

  return NextResponse.json({ received: true, verified: true, matched: true, idempotent: false, event });
}
