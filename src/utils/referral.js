/**
 * Carrying a referral code from a shared link to the signup form.
 *
 * A referral link points at whatever the referrer was looking at — usually a
 * property — not at the signup page: `/property/123?ref=HZ-4M7XQP`. The person
 * who follows it browses for a while and registers later, by which time the
 * query string is long gone. So the code has to be picked up the moment it is
 * seen and kept until it is used.
 *
 * Stored in `localStorage` rather than held in memory or in a store: the
 * journey routinely spans a page reload, and a code lost to a refresh means a
 * referrer who never gets credited and no way to tell that it happened.
 *
 * ## First code wins, here as well as on the server
 *
 * A stored code is never overwritten by a later one. The API enforces the same
 * rule — the unique index on the referral's referee is what actually decides —
 * but doing it here too means the code shown on the signup form is the one
 * that will be honoured, rather than one that is silently discarded on submit.
 */

const STORAGE_KEY = "horizon:referral-code";

/** Matches the server's generator: HZ- plus six confusable-free characters. */
const CODE_PATTERN = /^HZ-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;

/**
 * Every read and write is wrapped: `localStorage` throws in a private window
 * on some browsers, and in an in-app webview with site data blocked. A
 * referral that cannot be remembered is a shame; a property page that will not
 * render because of it is a bug.
 */
const safely = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

/**
 * Take the code out of a query string and keep it.
 *
 * Returns the code now in force — which may be one stored earlier, not the one
 * just seen.
 */
export const captureReferralCode = (search) => {
  const incoming = new URLSearchParams(search ?? "").get("ref");
  if (!incoming) return getStoredReferralCode();

  const code = incoming.trim().toUpperCase();
  if (!CODE_PATTERN.test(code)) return getStoredReferralCode();

  const existing = getStoredReferralCode();
  if (existing) return existing;

  safely(() => window.localStorage.setItem(STORAGE_KEY, code));
  return code;
};

export const getStoredReferralCode = () =>
  safely(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && CODE_PATTERN.test(stored) ? stored : null;
  });

/**
 * Forget it.
 *
 * Called once the account exists, whether or not the referral was accepted —
 * the code has done its job either way, and leaving it behind would attach it
 * to the next person who signs up on a shared device.
 */
export const clearReferralCode = () =>
  safely(() => window.localStorage.removeItem(STORAGE_KEY));

/** A shareable link to `path` that carries `code`. */
export const buildReferralLink = (code, path = "/") => {
  const url = new URL(path, window.location.origin);
  if (code) url.searchParams.set("ref", code);
  return url.toString();
};
