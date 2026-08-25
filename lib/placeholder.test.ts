import { describe, it, expect } from "vitest";
import { placeholderPhoto } from "./placeholder";

describe("placeholderPhoto", () => {
  it("returns local /photos for photos/ seed", () => {
    expect(placeholderPhoto("photos/foo.jpg")).toBe("/photos/foo.jpg");
  });
  it("returns mapped owner photo for hero seed", () => {
    const url = placeholderPhoto("hero-dhow-sunset");
    expect(url).toMatch(/^\/photos\/.+\.jpg$/);
  });
  it("returns mapped local photo for stonetown seed", () => {
    expect(placeholderPhoto("stonetown-1")).toBe("/photos/sitmeir_real_12.jpg");
  });
  it("falls back to picsum for unknown", () => {
    expect(placeholderPhoto("unknown-xyz")).toContain("picsum.photos");
  });
});
