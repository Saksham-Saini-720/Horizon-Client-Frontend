import { test, expect } from "@playwright/test";
import { EXPECTED } from "../../horizon-prop/tests/e2e/seed-properties.mjs";

/**
 * Every remaining filter the search UI offers, driven through the real controls.
 *
 * The presets and posted-within specs cover their own files; this one sweeps the
 * rest — purpose, bedrooms, bathrooms, property type, amenities and the area
 * range — so that "the filters work" is a claim backed by each one individually
 * rather than by the two that happened to get looked at.
 *
 * Assertions are exact orderings for the same reason as elsewhere: a filter that
 * is dropped returns all six listings, which passes any weaker check.
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

const openSearch = async (page) => {
  await page.goto("/search");
  await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({
    timeout: 30_000,
  });
};

const expectTitles = async (page, expected) =>
  expect.poll(() => titlesInOrder(page), { timeout: 15_000 }).toEqual(expected);

const openFullFilters = (page) =>
  page.getByRole("button", { name: "Filters", exact: true }).click();

const showResults = (page) => page.getByRole("button", { name: /show results/i }).click();

/**
 * Clicks a bedroom/bathroom pill inside the named section.
 *
 * Scoped to the section because both rows render the same circular pills with
 * the same labels — an unscoped `getByRole("button", { name: "3" })` matches the
 * bedrooms row first and silently filters the wrong field.
 */
const pickRoomCount = (page, section, label) =>
  page
    .locator("div")
    .filter({ has: page.getByText(section, { exact: true }) })
    .last()
    .getByRole("button", { name: label, exact: true })
    .click();

test.describe("purpose", () => {
  test("Buy returns only listings for sale", async ({ page }) => {
    await openSearch(page);
    await page.getByRole("button", { name: "Buy", exact: true }).click();
    await expectTitles(page, EXPECTED.purposeSale);
  });

  test("Rent returns only listings for rent", async ({ page }) => {
    await openSearch(page);
    await page.getByRole("button", { name: "Rent", exact: true }).click();
    await expectTitles(page, EXPECTED.purposeRent);
  });
});

test.describe("rooms", () => {
  test("Bedrooms filter matches an exact count", async ({ page }) => {
    await openSearch(page);
    await page.getByRole("button", { name: "Bedrooms", exact: true }).click();
    await page.getByRole("button", { name: "2", exact: true }).click();
    await page.getByRole("button", { name: /apply|show results/i }).click();
    await expectTitles(page, EXPECTED.bedrooms2);
  });

  test("Bathrooms filter matches an exact count", async ({ page }) => {
    await openSearch(page);
    await openFullFilters(page);
    await pickRoomCount(page, "BATHROOMS", "3");
    await showResults(page);
    await expectTitles(page, EXPECTED.bathrooms3);
  });

  /**
   * The open-ended pill. Alpha and Foxtrot have 4 bedrooms, Bravo has 5, so
   * "5+" must return Bravo alone and "4" must not return Bravo — which together
   * distinguish a lower bound from an exact match. Previously '5+' was parsed as
   * exactly 5 by luck of `parseInt`, so it happened to return Bravo too; the
   * pairing with the 4-bedroom case below is what makes the distinction real.
   */
  test("Bedrooms 5+ is a minimum, not an exact count", async ({ page }) => {
    await openSearch(page);
    await openFullFilters(page);
    await pickRoomCount(page, "BEDROOMS", "5+");
    await showResults(page);
    await expectTitles(page, EXPECTED.bedrooms5plus);
  });

  test("Bedrooms 4 is an exact count and excludes the 5-bedroom listing", async ({ page }) => {
    await openSearch(page);
    await openFullFilters(page);
    await pickRoomCount(page, "BEDROOMS", "4");
    await showResults(page);
    await expectTitles(page, EXPECTED.bedrooms4);
  });
});

test.describe("property type", () => {
  test("Apartment returns only apartments", async ({ page }) => {
    await openSearch(page);
    await openFullFilters(page);
    await page.getByRole("button", { name: "Apartment", exact: true }).click();
    await showResults(page);
    await expectTitles(page, EXPECTED.typeApartment);
  });
});

test.describe("amenities", () => {
  test("Swimming pool returns only listings with a pool", async ({ page }) => {
    await openSearch(page);
    await openFullFilters(page);
    await page
      .locator("div")
      .filter({ hasText: /^Swimming pool$/ })
      .getByRole("button")
      .click();
    await showResults(page);
    await expectTitles(page, EXPECTED.amenityPool);
  });

  /**
   * The amenity list is built by lowercasing its own display keys
   * (`amenity.toLowerCase()` in FullFiltersModal), but the API's enum is
   * camelCase. For single-word amenities the two agree by accident; for the four
   * multi-word ones they do not, and the request is rejected.
   *
   * "Pet friendly" sends `petfriendly` where the validator expects `petFriendly`.
   * Bravo Residence has the amenity and should come back; nothing does.
   */
  test("Pet friendly returns the listing that has it", async ({ page }) => {
    await openSearch(page);
    await openFullFilters(page);
    await page
      .locator("div")
      .filter({ hasText: /^Pet friendly$/ })
      .getByRole("button")
      .click();
    await showResults(page);
    await expectTitles(page, ["Bravo Residence"]);
  });
});

test.describe("area range", () => {
  test("100–600 m² excludes listings at both ends", async ({ page }) => {
    await openSearch(page);
    await openFullFilters(page);

    await page.getByPlaceholder(/min/i).fill("100");
    await page.getByPlaceholder(/max/i).fill("600");
    await page.getByRole("combobox").selectOption("sqm");

    await showResults(page);
    await expectTitles(page, EXPECTED.area100to600);
  });
});
