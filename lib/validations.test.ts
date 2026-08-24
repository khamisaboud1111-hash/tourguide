import { describe, it, expect } from "vitest";
import { bookingSchema } from "./validations";

describe("bookingSchema", () => {
  it("rejects short name", () => {
    const r = bookingSchema.safeParse({ tourTitleSnapshot: "t", customerName: "a", customerContact: "a" });
    expect(r.success).toBe(false);
  });
  it("accepts valid booking", () => {
    const r = bookingSchema.safeParse({ tourTitleSnapshot: "Stone Town", customerName: "Jane", customerContact: "jane@example.com" });
    expect(r.success).toBe(true);
  });
});
