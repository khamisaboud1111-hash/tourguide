import { test, expect } from "@playwright/test";
test("homepage loads and map exists", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("See Zanzibar")).toBeVisible();
  await expect(page.getByText("See the island on the map")).toBeVisible();
});
test("tours search works", async ({ page }) => {
  await page.goto("/tours");
  await expect(page.getByPlaceholder("Search tours")).toBeVisible();
});
test("booking form has 3 steps", async ({ page }) => {
  await page.goto("/tours/stone-town-walking-tour");
  await expect(page.getByText("About this experience")).toBeVisible();
  await expect(page.locator("#booking")).toBeVisible();
});
