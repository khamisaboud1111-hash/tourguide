import { describe, it, expect } from "vitest";
import { placeholderPhoto } from "./placeholder";

describe("placeholderPhoto", () => {
  it("returns local /photos for photos/ seed", () => {
    expect(placeholderPhoto("photos/foo.jpg")).toBe("/photos/foo.jpg");
  });
  it("returns mapped Zanzibar local for known seed", () => {
    const url = placeholderPhoto("hero-dhow-sunset");
    expect(url).toBe("/photos/zanzibar_ai_06.jpg");
  });
  it("falls back to picsum for unknown", () => {
    expect(placeholderPhoto("unknown-xyz")).toContain("picsum.photos");
  });
});
