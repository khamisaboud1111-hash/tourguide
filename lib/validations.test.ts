import { describe, it, expect } from "vitest";
import { bookingSchema } from "./validations";

const futureDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};

describe("bookingSchema", () => {
  const base = {
    tourId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    tourTitleSnapshot: "Stone Town Walking Tour",
    customerName: "Jane Traveler",
    customerContact: "jane@example.com",
    requestedDate: futureDate(),
    partySize: 2,
  };

  it("rejects short name", () => {
    const r = bookingSchema.safeParse({ ...base, customerName: "a" });
    expect(r.success).toBe(false);
  });

  it("accepts a valid booking", () => {
    const r = bookingSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("rejects past dates", () => {
    const r = bookingSchema.safeParse({ ...base, requestedDate: "2020-01-01" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid contact", () => {
    const r = bookingSchema.safeParse({ ...base, customerContact: "not valid!" });
    expect(r.success).toBe(false);
  });

  it("accepts phone contact", () => {
    const r = bookingSchema.safeParse({ ...base, customerContact: "+255 674 804 477" });
    expect(r.success).toBe(true);
  });

  it("rejects 0 travelers", () => {
    const r = bookingSchema.safeParse({ ...base, partySize: 0 });
    expect(r.success).toBe(false);
  });

  it("rejects >20 travelers", () => {
    const r = bookingSchema.safeParse({ ...base, partySize: 50 });
    expect(r.success).toBe(false);
  });

  it("rejects invalid tour id", () => {
    const r = bookingSchema.safeParse({ ...base, tourId: "not-a-uuid" });
    expect(r.success).toBe(false);
  });

  it("accepts valid pickup location", () => {
    const r = bookingSchema.safeParse({ ...base, pickupLocation: "Nungwi" });
    expect(r.success).toBe(true);
  });

  it("rejects unknown pickup location", () => {
    const r = bookingSchema.safeParse({ ...base, pickupLocation: "Atlantis" });
    expect(r.success).toBe(false);
  });
});
