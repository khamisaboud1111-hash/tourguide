// Authoritative booking pricing — the ONLY place pricing math lives.
// Server actions and UI import from here.

export type BookingPrice = {
  pricePerPerson: number;
  travelers: number;
  subtotal: number;
  currency: "USD";
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateBookingPrice(
  pricePerPerson: number,
  travelers: number
): BookingPrice {
  if (!Number.isFinite(pricePerPerson) || pricePerPerson < 0) throw new Error("Invalid price per person");
  if (!Number.isInteger(travelers) || travelers < 1) throw new Error("Invalid traveler count");

  const subtotal = round2(pricePerPerson * travelers);

  return { pricePerPerson, travelers, subtotal, currency: "USD" };
}

export function formatUsd(n: number): string {
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}
