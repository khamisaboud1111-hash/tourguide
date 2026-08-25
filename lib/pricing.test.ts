import { describe, it, expect } from "vitest";
import { calculateBookingPrice } from "./pricing";

describe("calculateBookingPrice — authoritative pricing", () => {
  it("$35 × 1 traveler, 20% deposit", () => {
    const p = calculateBookingPrice(35, 1, 0.2);
    expect(p.subtotal).toBe(35);
    expect(p.deposit).toBe(7);
    expect(p.remaining).toBe(28);
  });

  it("$35 × 2 travelers = $70 subtotal, $14 deposit", () => {
    const p = calculateBookingPrice(35, 2, 0.2);
    expect(p.subtotal).toBe(70);
    expect(p.deposit).toBe(14);
    expect(p.remaining).toBe(56);
  });

  it("$35 × 5 travelers = $175 subtotal, $35 deposit", () => {
    const p = calculateBookingPrice(35, 5, 0.2);
    expect(p.subtotal).toBe(175);
    expect(p.deposit).toBe(35);
    expect(p.remaining).toBe(140);
  });

  it("$70 × 3 travelers (Safari Blue) = $210 subtotal, $42 deposit", () => {
    const p = calculateBookingPrice(70, 3, 0.2);
    expect(p.subtotal).toBe(210);
    expect(p.deposit).toBe(42);
    expect(p.remaining).toBe(168);
  });

  it("rounds fractional deposits to cents", () => {
    const p = calculateBookingPrice(33.33, 3, 0.15);
    expect(p.subtotal).toBe(99.99);
    expect(p.deposit).toBe(15);
    expect(p.subtotal - p.deposit).toBeCloseTo(p.remaining, 2);
  });

  it("enforces minimum $1 deposit", () => {
    const p = calculateBookingPrice(1, 1, 0.05);
    expect(p.deposit).toBeGreaterThanOrEqual(1);
  });

  it("subtotal = deposit + remaining always", () => {
    for (const price of [20, 35, 45, 70, 99.99]) {
      for (const travelers of [1, 2, 4, 7]) {
        const p = calculateBookingPrice(price, travelers, 0.2);
        expect(p.deposit + p.remaining).toBeCloseTo(p.subtotal, 2);
      }
    }
  });

  it("rejects invalid inputs", () => {
    expect(() => calculateBookingPrice(-5, 2, 0.2)).toThrow();
    expect(() => calculateBookingPrice(35, 0, 0.2)).toThrow();
    expect(() => calculateBookingPrice(35, 2.5, 0.2)).toThrow();
    expect(() => calculateBookingPrice(35, 2, 1.5)).toThrow();
  });
});
