"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/validations";
import { calculateBookingPrice } from "@/lib/pricing";
import { authorizeStaff } from "@/lib/auth";
import { sendBookingEmails } from "@/lib/email";

export type CreateBookingResult = { ok: true; bookingId: string; reference: string } | { ok: false; error: string };

// Simple in-memory rate limiter — 5 bookings / 60s per IP. Swap to Upstash for multi-instance.
const _rate = new Map<string, number[]>();
function rateLimitOk(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (_rate.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  _rate.set(ip, arr);
  if (_rate.size > 500) _rate.clear();
  return true;
}

export async function createBooking(formData: FormData): Promise<CreateBookingResult> {
  try {
    const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || headers().get("x-real-ip") || "unknown";
    if (!rateLimitOk(ip)) return { ok: false, error: "Too many requests — please wait a minute and try again, or message on WhatsApp." };
  } catch {}

  const parsed = bookingSchema.safeParse({
    tourId: formData.get("tourId") ?? "",
    tourTitleSnapshot: formData.get("tourTitleSnapshot") ?? "",
    customerName: formData.get("customerName") ?? "",
    customerContact: formData.get("customerContact") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    requestedDate: formData.get("requestedDate") ?? "",
    partySize: formData.get("partySize") || undefined,
    pickupLocation: formData.get("pickupLocation") ?? "",
    pickupNotes: formData.get("pickupNotes") ?? "",
    country: formData.get("country") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;

  const supabase = await createClient();

  // 1) Tour must exist and be published — server-side source of truth
  const { data: tour, error: tourError } = await supabase
    .from("tours")
    .select("id, title, price_usd, is_published, group_size")
    .eq("id", data.tourId)
    .single();
  if (tourError || !tour) return { ok: false, error: "That tour doesn't exist." };
  if (!tour.is_published) return { ok: false, error: "That tour isn't available for booking right now." };

  // 2) Availability check — prevent overbooking when a capacity row exists
  const { data: avail } = await supabase
    .from("tour_availability")
    .select("capacity, booked, status")
    .eq("tour_id", tour.id)
    .eq("date", data.requestedDate)
    .maybeSingle();
  if (avail) {
    if (avail.status === "unavailable" || avail.status === "full") {
      return { ok: false, error: "That date is fully booked or unavailable — pick another date or ask us on WhatsApp." };
    }
    if (avail.booked + data.partySize > avail.capacity) {
      return { ok: false, error: `Only ${Math.max(0, avail.capacity - avail.booked)} spots left on that date.` };
    }
  }

  // 3) Authoritative pricing — server-side only
  const price = calculateBookingPrice(Number(tour.price_usd), data.partySize);

  // 4) Upsert customer (CRM) — email optional, whatsapp (phone) is compulsory
  const email = data.customerContact?.trim() ? data.customerContact.trim() : null;
  const phone = data.whatsapp.trim();
  const isEmail = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : false;
  let customerId: string | null = null;
  // Try lookup by email first if provided, else by phone
  let existingCustomer: { id: string } | null = null;
  if (email && isEmail) {
    const { data: byEmail } = await supabase.from("customers").select("id").eq("email", email).maybeSingle();
    if (byEmail) existingCustomer = byEmail;
  }
  if (!existingCustomer) {
    const { data: byPhone } = await supabase.from("customers").select("id").eq("phone", phone).maybeSingle();
    if (byPhone) existingCustomer = byPhone;
  }
  if (existingCustomer) {
    customerId = existingCustomer.id;
    // keep contact up to date
    await supabase.from("customers").update({ phone, ...(email ? { email } : {}) }).eq("id", customerId);
  } else {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({
        full_name: data.customerName,
        email: email && isEmail ? email : null,
        phone,
        country: data.country || null,
      })
      .select("id")
      .single();
    customerId = newCustomer?.id ?? null;
  }

  // 5) Insert booking with computed totals + whatsapp
  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      tour_id: tour.id,
      tour_title_snapshot: tour.title,
      customer_id: customerId,
      customer_name: data.customerName,
      customer_contact: data.customerContact,
      whatsapp: data.whatsapp || null,
      requested_date: data.requestedDate,
      party_size: data.partySize,
      message: data.message || null,
      pickup_location: data.pickupLocation || null,
      pickup_notes: data.pickupNotes || null,
      country: data.country || null,
      subtotal_usd: price.subtotal,
      total_usd: price.subtotal,
      currency: price.currency,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return { ok: false, error: "Something went wrong saving your request. Please try WhatsApp instead." };
  }

  // 6) Reserve capacity — ATOMIC: only increments if space remains, preventing
  // overbooking when two bookings race. If it fails, roll back the booking row.
  if (avail) {
    const { data: reserved, error: reserveError } = await supabase
      .from("tour_availability")
      .update({ booked: avail.booked + data.partySize, updated_at: new Date().toISOString() })
      .eq("tour_id", tour.id)
      .eq("date", data.requestedDate)
      .eq("booked", avail.booked) // optimistic lock: row unchanged since we read it
      .lt("booked", avail.capacity - data.partySize + 1) // still fits
      .select();

    if (reserveError || !reserved || reserved.length === 0) {
      // Someone else booked first — remove the booking we just created
      await supabase.from("bookings").delete().eq("id", inserted.id);
      return { ok: false, error: "That date just filled up — pick another date or ask us on WhatsApp." };
    }
  }

  // Email is best-effort
  try {
    await sendBookingEmails({
      customerName: data.customerName,
      customerContact: data.customerContact,
      tourTitle: tour.title,
      requestedDate: data.requestedDate,
      partySize: data.partySize,
      message: data.message,
      bookingRef: `ZKT-${inserted.id.slice(0, 8).toUpperCase()}`,
      pickupLocation: data.pickupLocation || undefined,
    });
  } catch (emailError) {
    console.error("Booking email failed:", emailError);
  }

  revalidatePath("/admin/bookings");
  return { ok: true, bookingId: inserted.id, reference: `ZKT-${inserted.id.slice(0, 8).toUpperCase()}` };
}

// ── Admin actions — all guarded ─────────────────────────────────────

const VALID_STATUSES = ["pending","contacted","confirmed","ready","completed","cancelled","rescheduled"] as const;
type BookingStatus = (typeof VALID_STATUSES)[number];

export async function updateBookingStatus(id: string, status: string) {
  await authorizeStaff("update booking status");
  if (!VALID_STATUSES.includes(status as BookingStatus)) throw new Error("Invalid status");
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw new Error(`Couldn't update booking: ${error.message}`);
  revalidatePath("/admin/bookings");
}
