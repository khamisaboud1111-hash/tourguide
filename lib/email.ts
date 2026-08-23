import { Resend } from "resend";
import { business } from "./constants";

type BookingEmailInput = {
  customerName: string;
  customerContact: string;
  tourTitle: string;
  requestedDate?: string;
  partySize?: number;
  message?: string;
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

  const summaryLines = [
    `Tour: ${input.tourTitle}`,
    `Name: ${input.customerName}`,
    `Contact: ${input.customerContact}`,
    input.requestedDate ? `Requested date: ${input.requestedDate}` : null,
    input.partySize ? `Party size: ${input.partySize}` : null,
    input.message ? `Message: ${input.message}` : null,
  ].filter(Boolean);

  // Notify the guide — this one matters most and always fires.
  await resend.emails.send({
    from: fromAddress,
    to: business.email,
    subject: `New booking request — ${input.tourTitle}`,
    text: summaryLines.join("\n"),
  });

  // Confirm with the customer only if they gave an email (they may have
  // given a phone number instead, which is fine — they'll hear back on
  // WhatsApp or a call in that case).
  if (EMAIL_RE.test(input.customerContact)) {
    await resend.emails.send({
      from: fromAddress,
      to: input.customerContact,
      subject: `We received your request — ${business.name}`,
      text: [
        `Hi ${input.customerName},`,
        "",
        `Thanks for your interest in the ${input.tourTitle} tour. ${business.guideName} will get back to you shortly to confirm details.`,
        "",
        `In the meantime, feel free to reach out directly: ${business.phoneDisplay}`,
        "",
        business.name,
      ].join("\n"),
    });
  }
}
