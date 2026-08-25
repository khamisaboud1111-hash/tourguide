// Authoritative booking pricing — the ONLY place pricing math lives.
// Server actions, payment creation, webhooks, and UI all import from here.

export type BookingPrice = {
  pricePerPerson: number;
  travelers: number;
  subtotal: number;
  depositPercent: number;
  deposit: number;
  remaining: number;
  currency: "USD";
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateBookingPrice(
  pricePerPerson: number,
  travelers: number,
  depositPercent: number
): BookingPrice {
  if (!Number.isFinite(pricePerPerson) || pricePerPerson < 0) throw new Error("Invalid price per person");
  if (!Number.isInteger(travelers) || travelers < 1) throw new Error("Invalid traveler count");
  if (!Number.isFinite(depositPercent) || depositPercent < 0 || depositPercent > 1) throw new Error("Invalid deposit percent");

  const subtotal = round2(pricePerPerson * travelers);
  const deposit = Math.max(1, round2(subtotal * depositPercent)); // minimum $1 charge
  const remaining = round2(subtotal - deposit);

  return { pricePerPerson, travelers, subtotal, depositPercent, deposit, remaining, currency: "USD" };
}

export function formatUsd(n: number): string {
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}
