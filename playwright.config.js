import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config for the client-facing frontend.
 *
 * First suite here covers the filter presets — the "See All" links on Explore
 * that navigate by URL parameter (`/search?sort=views`, `?featured=true`,
 * `?new=true`). Those are worth a browser test specifically because the failure
 * mode is silent: SearchPage reads only `q`, so a dropped preset renders a
 * perfectly healthy-looking unfiltered list. Nothing throws, nothing 500s, and
 * no unit test on either side is wrong — the frontend sends a valid request and
 * the API answers it correctly. Only clicking the link and looking at what comes
 * back catches it.
 *
 * Ports are fixed and deliberately not the usual dev ports, matching the
 * convention in Horizon-Admin's config: a run must not collide with a dev server
 * someone already has open, and must not talk to a real environment.
 */

const WEB_PORT = 5198;
const API_PORT = 8101;
const BASE_URL = `http://localhost:${WEB_PORT}`;
const API_URL = `http://localhost:${API_PORT}`;

export default defineConfig({
  testDir: "./e2e",

  // A preset filter that passes on the second attempt is still broken. Retries
  // would only hide ordering races behind a green tick.
  retries: 0,
  forbidOnly: !!process.env.CI,

  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // The real property service against an in-memory Mongo, seeded with the
  // six-listing public fixture. E2E_SEED_PROPERTIES is what turns that fixture
  // on; without it the harness seeds only users and roles, which is what the
  // admin suite wants.
  //
  // reuseExistingServer is off for both: a leftover server holds stale seed
  // data, and a suite that passes against the wrong database is worse than one
  // that fails to start.
  webServer: [
    {
      command: "node ../horizon-prop/tests/e2e/harness.mjs",
      url: `${API_URL}/api/v1/our-world`,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        E2E_API_PORT: String(API_PORT),
        E2E_ORIGIN: BASE_URL,
        E2E_SEED_PROPERTIES: "1",
      },
    },
    {
      command: `npx vite --port ${WEB_PORT} --strictPort`,
      url: BASE_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { VITE_API_BASE_URL: `${API_URL}/api/v1` },
    },
  ],
});
