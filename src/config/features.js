/**
 * Features that can be switched off without deleting their code.
 *
 * A build-time constant rather than anything fetched: Vite inlines
 * `import.meta.env` at build, so a route array and a nav item can be filtered
 * before the first render with no request and no loading state. The nearest
 * precedent in the workspace is Horizon-Admin's
 * `VITE_USE_MOCK_DASHBOARD === "true"`.
 *
 * Undefined reads as `false`, so a missing variable means hidden — the
 * direction that cannot surprise a customer.
 *
 * ## REFERRALS_ENABLED
 *
 * The referral programme is hidden, not removed. Every page, hook, util and
 * API call for it is still in this repo; these flags are what make them
 * reachable. Horizon takes a one-off introduction fee and never holds client
 * money, so paying a reward out had no counterpart in how the business works —
 * but the decision is reversible, so the code stays.
 *
 * Bringing it back is `VITE_REFERRALS_ENABLED=true` here, the same in
 * Horizon-Admin, and `REFERRALS_ENABLED=true` in horizon-prop. The service
 * answers 404 on every referral route until that last one is set, so turning
 * on only the frontends shows screens that cannot load — set all three.
 */
export const REFERRALS_ENABLED =
  import.meta.env.VITE_REFERRALS_ENABLED === "true";

export default { REFERRALS_ENABLED };
