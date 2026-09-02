import { Resend } from "resend";
import { business } from "./constants";

type BookingEmailInput = {
  customerName: string;
  customerContact: string;
  whatsapp?: string;
  tourTitle: string;
  requestedDate?: string;
  partySize?: number;
  message?: string;
  bookingRef?: string;
  pickupLocation?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendBookingEmails(input: BookingEmailInput) {
  // Booking capture already succeeded in the database at this point —
  // treat a missing key as "email not set up yet" rather than an error.
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping booking emails.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress = process.env.RESEND_FROM_EMAIL || "bookings@resend.dev";
  const ref = input.bookingRef ?? "—";

  const summaryLines = [
    `Booking: ${ref}`,
    `Tour: ${input.tourTitle}`,
    `Name: ${input.customerName}`,
    `Contact: ${input.customerContact}`,
    input.whatsapp ? `WhatsApp: ${input.whatsapp}` : null,
    input.requestedDate ? `Requested date: ${input.requestedDate}` : null,
    input.partySize ? `Travelers: ${input.partySize}` : null,
    input.pickupLocation ? `Pickup: ${input.pickupLocation}` : null,
    input.message ? `Message: ${input.message}` : null,
  ].filter(Boolean);

  // Notify the guide — this one matters most and always fires.
  await resend.emails.send({
    from: fromAddress,
    to: business.email,
    subject: `New booking ${ref} — ${input.tourTitle}`,
    text: summaryLines.join("\n"),
  });

  // Confirm with the customer only if they gave an email.
  if (EMAIL_RE.test(input.customerContact)) {
    await resend.emails.send({
      from: fromAddress,
      to: input.customerContact,
      subject: `We received your booking ${ref} — ${business.name}`,
      text: [
        `Hi ${input.customerName},`,
        "",
        `Thanks for booking the ${input.tourTitle} tour (reference ${ref}). ${business.guideName} will confirm availability and send the meeting point shortly.`,
        input.requestedDate ? `Requested date: ${input.requestedDate}` : null,
        input.pickupLocation ? `Pickup area: ${input.pickupLocation}` : null,
        "",
        `Questions? WhatsApp ${business.phoneDisplay} or reply to this email.`,
        "",
        business.name,
      ].filter(Boolean).join("\n"),
    });
  }
}
