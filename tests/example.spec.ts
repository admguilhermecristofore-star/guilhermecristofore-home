import { test, expect } from "@playwright/test";

test("página carrega corretamente", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
});
