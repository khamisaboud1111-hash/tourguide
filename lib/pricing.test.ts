import { describe, it, expect } from "vitest";
import { calculateBookingPrice } from "./pricing";

describe("calculateBookingPrice — authoritative pricing", () => {
  it("$35 × 1 traveler = $35 subtotal", () => {
    const p = calculateBookingPrice(35, 1);
    expect(p.subtotal).toBe(35);
  });

  it("$35 × 2 travelers = $70 subtotal", () => {
    const p = calculateBookingPrice(35, 2);
    expect(p.subtotal).toBe(70);
  });

  it("$35 × 5 travelers = $175 subtotal", () => {
    const p = calculateBookingPrice(35, 5);
    expect(p.subtotal).toBe(175);
  });

  it("$70 × 3 travelers (Safari Blue) = $210 subtotal", () => {
    const p = calculateBookingPrice(70, 3);
    expect(p.subtotal).toBe(210);
  });

  it("rounds fractional prices to cents", () => {
    const p = calculateBookingPrice(33.33, 3);
    expect(p.subtotal).toBe(99.99);
  });

  it("rejects invalid inputs", () => {
    expect(() => calculateBookingPrice(-5, 2)).toThrow();
    expect(() => calculateBookingPrice(35, 0)).toThrow();
    expect(() => calculateBookingPrice(35, 2.5)).toThrow();
  });
});
