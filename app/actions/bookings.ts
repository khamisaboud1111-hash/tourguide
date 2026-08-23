"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/validations";
import { sendBookingEmails } from "@/lib/email";

export type CreateBookingResult = { ok: true; bookingId: string } | { ok: false; error: string };

export async function createBooking(formData: FormData): Promise<CreateBookingResult> {
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
