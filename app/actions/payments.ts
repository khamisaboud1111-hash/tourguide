"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { business } from "@/lib/constants";

// Uses the service-role client, not the session-based one: the customer
// creating/paying a deposit on their own booking isn't a logged-in
// Supabase user, so the admin-only RLS policy on bookings would block
// both the read and the update below. The only data this touches is the
// single booking matching the id passed in — never arbitrary rows.

type PaymentLinkResult = { ok: true; link: string } | { ok: false; error: string };

export async function createPaymentLink(bookingId: string): Promise<PaymentLinkResult> {
  if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    return {
      ok: false,
      error: "Online payment isn't set up yet — please use WhatsApp to arrange payment for now.",
    };
  }

  const supabase = createServiceClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, tours(price_usd)")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return { ok: false, error: "Couldn't find that booking." };
  }

  const tourPrice = booking.tours?.price_usd ?? booking.amount_usd ?? 0;
  const depositAmount = Math.max(1, Math.round(tourPrice * business.depositPercent));
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customer_contact);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const txRef = `booking-${bookingId}-${Date.now()}`;

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: depositAmount,
      currency: "USD",
      redirect_url: `${siteUrl}/booking/confirmed`,
      customer: {
        email: isEmail ? booking.customer_contact : `guest-${bookingId}@${business.whatsappNumber}.invalid`,
        name: booking.customer_name,
      },
      customizations: {
        title: business.name,
        description: `Deposit — ${booking.tour_title_snapshot}`,
      },
    }),
  });

  const json = await response.json();

  if (json.status !== "success" || !json.data?.link) {
    return { ok: false, error: "Couldn't start the payment — please try WhatsApp instead." };
  }

  await supabase
    .from("bookings")
    .update({ payment_ref: txRef, amount_usd: depositAmount })
    .eq("id", bookingId);

  return { ok: true, link: json.data.link as string };
}
