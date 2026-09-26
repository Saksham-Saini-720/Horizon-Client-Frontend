/**
 * Business features that can be switched on and off — at runtime.
 *
 * These used to be build-time `VITE_*` flags. The referral programme is now a
 * database setting on the API (Settings → Business in the admin console), so
 * it can be switched on or off without redeploying this app. Read features
 * through `hooks/useFeatures`.
 *
 * Anything unknown or not yet loaded reads as OFF: a hidden programme flashing
 * into view while the request is in flight would be the worse failure.
 */
export const FEATURE_KEYS = ["referrals"];

export const NO_FEATURES = Object.freeze(
  Object.fromEntries(FEATURE_KEYS.map((key) => [key, false])),
);

export default { FEATURE_KEYS, NO_FEATURES };
