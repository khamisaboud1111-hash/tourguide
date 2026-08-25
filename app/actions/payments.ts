"use server";

import { randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { authorizeStaff } from "@/lib/auth";

// Secure payment creation:
// - Requires staff/admin session (payment links are created by the guide, or via
//   the post-booking flow where the booking was just created server-side).
// - Amount is ALWAYS computed from authoritative booking + tour data.
// - tx_ref is unique per attempt; payments table gives webhook idempotency.

type PaymentLinkResult = { ok: true; link: string; txRef: string } | { ok: false; error: string };

export async function createPaymentLink(bookingId: string): Promise<PaymentLinkResult> {
  if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    return { ok: false, error: "Online payment isn't set up yet — please use WhatsApp to arrange payment for now." };
  }

  // Authorization: staff can pay for any booking. For the public post-booking flow,
  // possession of the booking UUID (a server-generated secret) is the capability token.
  let isStaff = false;
  try {
    await authorizeStaff("create payment link");
    isStaff = true;
  } catch {
    isStaff = false;
  }

  const supabase = createServiceClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, status, payment_status, deposit_usd, remaining_usd, customer_name, customer_contact, tour_title_snapshot, tours(price_usd)")
    .eq("id", bookingId)
    .single();

  if (error || !booking) return { ok: false, error: "Couldn't find that booking." };
  if (booking.payment_status === "paid_in_full") return { ok: false, error: "This booking is already fully paid." };
  if (["cancelled", "refunded"].includes(booking.status)) return { ok: false, error: "This booking is no longer payable." };

  // Server-calculated amount: deposit if unpaid, remaining if deposit already paid.
  const amount =
    booking.payment_status === "deposit_paid"
      ? Number(booking.remaining_usd ?? 0)
      : Number(booking.deposit_usd ?? 0);

  if (!amount || amount <= 0) {
    return { ok: false, error: "No payment amount due for this booking." };
  }

  // Unique tx_ref per attempt
  const txRef = `booking-${bookingId}-${Date.now()}-${randomUUID().slice(0, 8)}`;

  // Record payment intent first (idempotency anchor for the webhook)
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({ booking_id: bookingId, tx_ref: txRef, amount_usd: amount, currency: "USD", status: "pending" })
    .select()
    .single();
  if (paymentError || !payment) return { ok: false, error: "Couldn't start the payment — please try again." };

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customer_contact);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency: "USD",
      redirect_url: `${siteUrl}/booking/confirmed`,
      customer: {
        email: isEmail ? booking.customer_contact : `guest-${bookingId}@payments.invalid`,
        name: booking.customer_name,
      },
      customizations: {
        title: "Sitmeir Tours and Travel",
        description: `${booking.payment_status === "deposit_paid" ? "Balance" : "Deposit"} — ${booking.tour_title_snapshot}`,
      },
      meta: { booking_id: bookingId, kind: booking.payment_status === "deposit_paid" ? "balance" : "deposit" },
    }),
  });

  const json = await response.json();

  if (json.status !== "success" || !json.data?.link) {
    await supabase.from("payments").update({ status: "failed", updated_at: new Date().toISOString() }).eq("tx_ref", txRef);
    return { ok: false, error: "Couldn't start the payment — please try WhatsApp instead." };
  }

  // Keep booking.payment_ref for legacy compatibility
  await supabase.from("bookings").update({ payment_ref: txRef }).eq("id", bookingId);

  return { ok: true, link: json.data.link as string, txRef };
}
