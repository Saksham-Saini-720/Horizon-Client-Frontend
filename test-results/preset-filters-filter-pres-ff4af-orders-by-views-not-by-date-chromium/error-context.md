# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: preset-filters.spec.js >> filter presets >> Most Viewed preset orders by views, not by date
- Location: e2e\preset-filters.spec.js:58:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 3

  Array [
-   "Alpha Court",
-   "Charlie Heights",
+   "Foxtrot Manor",
    "Echo Park Villa",
    "Delta Gardens",
+   "Charlie Heights",
    "Bravo Residence",
-   "Foxtrot Manor",
+   "Alpha Court",
  ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e8]:
        - button "Go back" [ref=e9] [cursor=pointer]
        - textbox "Search properties…" [ref=e17]
      - generic [ref=e19]:
        - button "Buy" [ref=e20] [cursor=pointer]
        - button "Rent" [ref=e21] [cursor=pointer]
        - button "Price" [ref=e22] [cursor=pointer]
        - button "Bedrooms" [ref=e23] [cursor=pointer]
        - button "Location" [ref=e24] [cursor=pointer]
        - button "Filters" [ref=e25] [cursor=pointer]
    - generic [ref=e29]:
      - button "Map view" [ref=e30] [cursor=pointer]:
        - generic [ref=e32]: Map
      - button "Grid view" [ref=e33] [cursor=pointer]
    - paragraph [ref=e40]: 6 properties found
    - generic [ref=e41]:
      - generic [ref=e42] [cursor=pointer]:
        - generic [ref=e44]:
          - img "Foxtrot Manor 1" [ref=e48]
          - generic [ref=e49]:
            - generic [ref=e50]: Verified
            - generic [ref=e54]: For Sale
          - generic "Posted 24 September 2026" [ref=e56]: 6 hours ago
          - button "Save property" [ref=e60]
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]: ZMW
            - paragraph [ref=e67]: 990,000
          - paragraph [ref=e68]: Foxtrot Manor
          - generic [ref=e69]: Livingstone, Livingstone
          - generic [ref=e74]:
            - generic [ref=e75]: 4 Beds
            - generic [ref=e79]: 3 Baths
            - generic [ref=e83]: 500 m²
      - generic [ref=e88] [cursor=pointer]:
        - generic [ref=e90]:
          - img "Echo Park Villa 1" [ref=e94]
          - generic [ref=e95]:
            - generic [ref=e96]: Verified
            - generic [ref=e100]: For Sale
          - generic "Posted 21 September 2026" [ref=e102]: 3 days ago
          - button "Save property" [ref=e106]
        - generic [ref=e110]:
          - generic [ref=e111]:
            - generic [ref=e112]: ZMW
            - paragraph [ref=e113]: 640,000
          - paragraph [ref=e114]: Echo Park Villa
          - generic [ref=e115]: Lusaka, Lusaka
          - generic [ref=e120]:
            - generic [ref=e121]: 3 Beds
            - generic [ref=e125]: 2 Baths
            - generic [ref=e129]: 250 m²
      - generic [ref=e134] [cursor=pointer]:
        - generic [ref=e136]:
          - img "Delta Gardens 1" [ref=e140]
          - generic [ref=e141]:
            - generic [ref=e142]: Verified
            - generic [ref=e146]: For Rent
          - generic "Posted 15 August 2026" [ref=e148]: 15 Aug
          - button "Save property" [ref=e152]
        - generic [ref=e156]:
          - generic [ref=e157]:
            - generic [ref=e158]: ZMW
            - paragraph [ref=e159]: 4,200/mo
          - paragraph [ref=e160]: Delta Gardens
          - generic [ref=e161]: Kitwe, Kitwe
          - generic [ref=e166]:
            - generic [ref=e167]: 1 Bed
            - generic [ref=e171]: 1 Bath
            - generic [ref=e175]: 60 m²
      - generic [ref=e180] [cursor=pointer]:
        - generic [ref=e182]:
          - img "Charlie Heights 1" [ref=e186]
          - generic [ref=e187]:
            - generic [ref=e188]: Verified
            - generic [ref=e192]: For Rent
          - generic "Posted 26 July 2026" [ref=e194]: 26 Jul
          - button "Save property" [ref=e198]
        - generic [ref=e202]:
          - generic [ref=e203]:
            - generic [ref=e204]: ZMW
            - paragraph [ref=e205]: 7,500/mo
          - paragraph [ref=e206]: Charlie Heights
          - generic [ref=e207]: Ndola, Ndola
          - generic [ref=e212]:
            - generic [ref=e213]: 2 Beds
            - generic [ref=e217]: 2 Baths
            - generic [ref=e221]: 90 m²
      - generic [ref=e226] [cursor=pointer]:
        - generic [ref=e228]:
          - img "Bravo Residence 1" [ref=e232]
          - generic [ref=e233]:
            - generic [ref=e234]: Verified
            - generic [ref=e238]: For Sale
          - generic "Posted 6 July 2026" [ref=e240]: 6 Jul
          - button "Save property" [ref=e244]
        - generic [ref=e248]:
          - generic [ref=e249]:
            - generic [ref=e250]: ZMW
            - paragraph [ref=e251]: 1,200,000
          - paragraph [ref=e252]: Bravo Residence
          - generic [ref=e253]: Lusaka, Lusaka
          - generic [ref=e258]:
            - generic [ref=e259]: 5 Beds
            - generic [ref=e263]: 4 Baths
            - generic [ref=e267]: 800 m²
      - generic [ref=e272] [cursor=pointer]:
        - generic [ref=e274]:
          - img "Alpha Court 1" [ref=e278]
          - generic [ref=e279]:
            - generic [ref=e280]: Verified
            - generic [ref=e284]: For Sale
          - generic "Posted 16 June 2026" [ref=e286]: 16 Jun
          - button "Save property" [ref=e290]
        - generic [ref=e294]:
          - generic [ref=e295]:
            - generic [ref=e296]: ZMW
            - paragraph [ref=e297]: 850,000
          - paragraph [ref=e298]: Alpha Court
          - generic [ref=e299]: Lusaka, Lusaka
          - generic [ref=e304]:
            - generic [ref=e305]: 4 Beds
            - generic [ref=e309]: 3 Baths
            - generic [ref=e313]: 400 m²
  - contentinfo [ref=e318]:
    - navigation [ref=e319]:
      - link "Home" [ref=e320] [cursor=pointer]:
        - /url: /
      - link "Saved" [ref=e328] [cursor=pointer]:
        - /url: /saved
      - link "Inquiries" [ref=e335] [cursor=pointer]:
        - /url: /inquiries
      - link "Inbox" [ref=e342] [cursor=pointer]:
        - /url: /chat
      - link "Profile" [ref=e350] [cursor=pointer]:
        - /url: /profile
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import { EXPECTED } from "../../horizon-prop/tests/e2e/seed-properties.mjs";
  3   | 
  4   | /**
  5   |  * The filter presets: the "See All" links on Explore that carry their filter in
  6   |  * the URL rather than in app state.
  7   |  *
  8   |  * These are written against the LINKS, not against hand-built URLs, because the
  9   |  * bug can live on either side — Explore can emit a parameter the API doesn't
  10  |  * accept (`?featured=true`), or Search can ignore a parameter Explore correctly
  11  |  * emits (everything but `?q=`). Clicking the real link is the only way a spec
  12  |  * spans both.
  13  |  *
  14  |  * Each expectation is an ORDER, never a count. A preset that silently falls back
  15  |  * to the API default returns the same six listings — the set is identical and
  16  |  * only the sequence differs, so `toHaveCount(6)` passes against a completely
  17  |  * broken preset. See seed-properties.mjs for how the fixture forces the three
  18  |  * orderings apart.
  19  |  */
  20  | 
  21  | // A first visit mounts the three-step onboarding overlay, and OnboardingGate
  22  | // renders the whole app under `visibility: hidden` until it is dismissed — so
  23  | // without this every spec here would fail on an invisible results grid rather
  24  | // than on anything to do with filters. addInitScript rather than a click-through
  25  | // of "Skip": it runs before the app's first render, so the overlay never mounts.
  26  | test.beforeEach(async ({ page }) => {
  27  |   await page.addInitScript(() => {
  28  |     localStorage.setItem("onboardingComplete", "true");
  29  |   });
  30  | });
  31  | 
  32  | const titlesInOrder = async (page) =>
  33  |   page.locator('[data-testid="property-card"]').evaluateAll((cards) =>
  34  |     cards.map((c) => c.getAttribute("data-title")),
  35  |   );
  36  | 
  37  | /**
  38  |  * Waits for the results grid, so order is read after the fetch rather than during.
  39  |  *
  40  |  * The generous timeout is for Vite's dev server, not for the app: /search is a
  41  |  * lazy route, so the first spec to reach it pays for an on-demand compile of the
  42  |  * chunk and everything it imports. That alone exceeded the 5s expect default and
  43  |  * failed every spec here on the Suspense "Loading..." fallback — a cold-start
  44  |  * artefact that looks exactly like a broken filter.
  45  |  *
  46  |  * Deliberately not followed by waitForLoadState("networkidle"): the fixture's
  47  |  * image URLs are unresolvable by design, so "idle" depends on DNS failure timing.
  48  |  * The grid renders in one pass once the query resolves, so the first card being
  49  |  * visible already means the order below is final.
  50  |  */
  51  | const resultsSettled = async (page) => {
  52  |   await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({
  53  |     timeout: 30_000,
  54  |   });
  55  | };
  56  | 
  57  | test.describe("filter presets", () => {
  58  |   test("Most Viewed preset orders by views, not by date", async ({ page }) => {
  59  |     await page.goto("/");
  60  | 
  61  |     await page.getByRole("button", { name: /see all/i }).first().click();
  62  |     // Guard the premise: if this link ever stops carrying the parameter, the
  63  |     // order assertion below would fail for a misleading reason.
  64  |     await expect(page).toHaveURL(/sort=/);
  65  | 
  66  |     await resultsSettled(page);
> 67  |     expect(await titlesInOrder(page)).toEqual(EXPECTED.mostViewed);
      |                                       ^ Error: expect(received).toEqual(expected) // deep equality
  68  |   });
  69  | 
  70  |   test("Featured preset returns only featured listings", async ({ page }) => {
  71  |     await page.goto("/search?featured=true");
  72  |     await resultsSettled(page);
  73  | 
  74  |     expect(await titlesInOrder(page)).toEqual(EXPECTED.featured);
  75  |   });
  76  | 
  77  |   /**
  78  |    * Read this one's green tick carefully: it does NOT mean `?new=true` works.
  79  |    * The parameter is dropped like the others, and the API's fallback sort is
  80  |    * newest-first — which is what this preset wanted anyway, so the two are
  81  |    * indistinguishable from outside. It is kept because it pins the default and
  82  |    * would catch a regression in the fallback; it is not evidence the preset is
  83  |    * wired up. The other two specs are what prove that, and they fail.
  84  |    */
  85  |   test("New Listings preset orders by real post date", async ({ page }) => {
  86  |     await page.goto("/search?new=true");
  87  |     await resultsSettled(page);
  88  | 
  89  |     expect(await titlesInOrder(page)).toEqual(EXPECTED.newest);
  90  |   });
  91  | 
  92  |   /**
  93  |    * The control. `?q=` is the one parameter SearchPage already reads, so this
  94  |    * passing while the three above fail localises the fault precisely: the page
  95  |    * reads the URL, it just reads only this key.
  96  |    */
  97  |   test("search query from the URL is applied", async ({ page }) => {
  98  |     await page.goto("/search?q=Foxtrot");
  99  |     await resultsSettled(page);
  100 | 
  101 |     expect(await titlesInOrder(page)).toEqual(["Foxtrot Manor"]);
  102 |   });
  103 | });
  104 | 
```