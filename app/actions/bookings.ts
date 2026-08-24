"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/validations";
import { sendBookingEmails } from "@/lib/email";

// Simple in-memory rate limiter — 5 bookings / 60s per IP. Swap to Upstash Redis for multi-instance.
const _rate = new Map<string, number[]>();
function rateLimitOk(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (_rate.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  _rate.set(ip, arr);
  // prevent unbounded growth in dev
  if (_rate.size > 500) _rate.clear();
  return true;
}

export type CreateBookingResult = { ok: true; bookingId: string } | { ok: false; error: string };

export async function createBooking(formData: FormData): Promise<CreateBookingResult> {
  // Rate limit by IP (best-effort, fail open if headers unavailable)
  try {
    const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || headers().get("x-real-ip") || "unknown";
    if (!rateLimitOk(ip)) return { ok: false, error: "Too many requests — please wait a minute and try again, or message on WhatsApp." };
  } catch {}
  const raw = {
    tourId: formData.get("tourId") ?? "",
    tourTitleSnapshot: formData.get("tourTitleSnapshot"),
    customerName: formData.get("customerName"),
    customerContact: formData.get("customerContact"),
    requestedDate: formData.get("requestedDate") ?? "",
    partySize: formData.get("partySize") || undefined,
    message: formData.get("message") ?? "",
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      tour_id: data.tourId || null,
      tour_title_snapshot: data.tourTitleSnapshot,
      customer_name: data.customerName,
      customer_contact: data.customerContact,
      requested_date: data.requestedDate || null,
      party_size: data.partySize ?? null,
      message: data.message || null,
    })
    .select()
    .single();

  if (error) {
    return { ok: false, error: "Something went wrong saving your request. Please try WhatsApp instead." };
  }

  // Email is best-effort — a booking should still succeed even if Resend
  // isn't configured yet or a send fails.
  try {
    await sendBookingEmails({
      customerName: data.customerName,
      customerContact: data.customerContact,
      tourTitle: data.tourTitleSnapshot,
      requestedDate: data.requestedDate,
      partySize: data.partySize,
      message: data.message,
    });
  } catch (emailError) {
    console.error("Booking email failed:", emailError);
  }

  revalidatePath("/admin/bookings");
  return { ok: true, bookingId: inserted.id };
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw new Error(`Couldn't update booking: ${error.message}`);
  revalidatePath("/admin/bookings");
}

export async function updatePaymentStatus(id: string, paymentStatus: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ payment_status: paymentStatus })
    .eq("id", id);
  if (error) throw new Error(`Couldn't update payment status: ${error.message}`);
  revalidatePath("/admin/bookings");
}
