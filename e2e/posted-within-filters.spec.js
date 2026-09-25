import { test, expect } from "@playwright/test";
import { EXPECTED } from "../../horizon-prop/tests/e2e/seed-properties.mjs";

/**
 * The "Last 24 hours" / "Last 7 days" chips in the full filters modal.
 *
 * Driven through the real UI — open Filters, pick the window, Show Results —
 * rather than by calling the hook, because every individual piece of this
 * feature is already correct in isolation: the modal emits `postedWithinDays`,
 * the query builder translates it, the validator accepts it and the service
 * queries `sourcePostedAt` with it. Only the assembled path is broken, so only
 * an assembled test can see it.
 *
 * As with the presets, the assertions are orderings rather than counts, and the
 * two windows are asserted separately: a filter that is ignored entirely returns
 * all six listings, which would satisfy any "returns some results" check.
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("onboardingComplete", "true");
  });
});

const titlesInOrder = async (page) =>
  page.locator('[data-testid="property-card"]').evaluateAll((cards) =>
    cards.map((c) => c.getAttribute("data-title")),
  );

/** Opens the filters modal, picks a posted-within window, and applies it. */
const applyPostedWithin = async (page, label) => {
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.getByRole("button", { name: /show results/i }).click();
};

test.describe("posted-within filters", () => {
  test("Last 24 hours returns only listings posted in the last day", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({
      timeout: 30_000,
    });

    await applyPostedWithin(page, "Last 24 hours");

    await expect
      .poll(() => titlesInOrder(page), { timeout: 15_000 })
      .toEqual(EXPECTED.postedWithin[1]);
  });

  test("Last 7 days returns only listings posted in the last week", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({
      timeout: 30_000,
    });

    await applyPostedWithin(page, "Last 7 days");

    await expect
      .poll(() => titlesInOrder(page), { timeout: 15_000 })
      .toEqual(EXPECTED.postedWithin[7]);
  });
});
