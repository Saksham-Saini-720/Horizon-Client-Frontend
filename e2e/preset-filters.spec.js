import { test, expect } from "@playwright/test";
import { EXPECTED } from "../../horizon-prop/tests/e2e/seed-properties.mjs";

/**
 * The filter presets: the "See All" links on Explore that carry their filter in
 * the URL rather than in app state.
 *
 * These are written against the LINKS, not against hand-built URLs, because the
 * bug can live on either side — Explore can emit a parameter the API doesn't
 * accept (`?featured=true`), or Search can ignore a parameter Explore correctly
 * emits (everything but `?q=`). Clicking the real link is the only way a spec
 * spans both.
 *
 * Each expectation is an ORDER, never a count. A preset that silently falls back
 * to the API default returns the same six listings — the set is identical and
 * only the sequence differs, so `toHaveCount(6)` passes against a completely
 * broken preset. See seed-properties.mjs for how the fixture forces the three
 * orderings apart.
 */

// A first visit mounts the three-step onboarding overlay, and OnboardingGate
// renders the whole app under `visibility: hidden` until it is dismissed — so
// without this every spec here would fail on an invisible results grid rather
// than on anything to do with filters. addInitScript rather than a click-through
// of "Skip": it runs before the app's first render, so the overlay never mounts.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("onboardingComplete", "true");
  });
});

const titlesInOrder = async (page) =>
  page.locator('[data-testid="property-card"]').evaluateAll((cards) =>
    cards.map((c) => c.getAttribute("data-title")),
  );

/**
 * Waits for the results grid, so order is read after the fetch rather than during.
 *
 * The generous timeout is for Vite's dev server, not for the app: /search is a
 * lazy route, so the first spec to reach it pays for an on-demand compile of the
 * chunk and everything it imports. That alone exceeded the 5s expect default and
 * failed every spec here on the Suspense "Loading..." fallback — a cold-start
 * artefact that looks exactly like a broken filter.
 *
 * Deliberately not followed by waitForLoadState("networkidle"): the fixture's
 * image URLs are unresolvable by design, so "idle" depends on DNS failure timing.
 * The grid renders in one pass once the query resolves, so the first card being
 * visible already means the order below is final.
 */
const resultsSettled = async (page) => {
  await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({
    timeout: 30_000,
  });
};

test.describe("filter presets", () => {
  test("Most Viewed preset orders by views, not by date", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /see all/i }).first().click();
    // Guard the premise: if this link ever stops carrying the parameter, the
    // order assertion below would fail for a misleading reason.
    await expect(page).toHaveURL(/sort=/);

    await resultsSettled(page);
    expect(await titlesInOrder(page)).toEqual(EXPECTED.mostViewed);
  });

  test("Featured preset returns only featured listings", async ({ page }) => {
    await page.goto("/search?featured=true");
    await resultsSettled(page);

    expect(await titlesInOrder(page)).toEqual(EXPECTED.featured);
  });

  /**
   * Read this one's green tick carefully: it does NOT mean `?new=true` works.
   * The parameter is dropped like the others, and the API's fallback sort is
   * newest-first — which is what this preset wanted anyway, so the two are
   * indistinguishable from outside. It is kept because it pins the default and
   * would catch a regression in the fallback; it is not evidence the preset is
   * wired up. The other two specs are what prove that, and they fail.
   */
  test("New Listings preset orders by real post date", async ({ page }) => {
    await page.goto("/search?new=true");
    await resultsSettled(page);

    expect(await titlesInOrder(page)).toEqual(EXPECTED.newest);
  });

  /**
   * The control. `?q=` is the one parameter SearchPage already reads, so this
   * passing while the three above fail localises the fault precisely: the page
   * reads the URL, it just reads only this key.
   */
  test("search query from the URL is applied", async ({ page }) => {
    await page.goto("/search?q=Foxtrot");
    await resultsSettled(page);

    expect(await titlesInOrder(page)).toEqual(["Foxtrot Manor"]);
  });
});
