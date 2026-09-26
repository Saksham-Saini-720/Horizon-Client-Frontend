/**
 * Carrying a referral code from a shared link or QR scan to the signup form.
 *
 * A referral link points at whatever the referrer was looking at — usually a
 * property — not at the signup page: `/property/123?ref=HZ-4M7XQP&src=qr`.
 * The person who follows it browses for a while and registers later, by which
 * time the query string is long gone. So the code has to be picked up the
 * moment it is seen and kept until it is used.
 *
 * Stored in `localStorage` rather than held in memory or in a store: the
 * journey routinely spans a page reload, and a code lost to a refresh means a
 * referrer who never gets credited and no way to tell that it happened.
 *
 * ## Latest wins
 *
 * Codes are per campaign now, so a code seen months ago may belong to a
 * campaign that has ended. The most recent link a person followed is the one
 * they are acting on — the same rule as promo codes (`utils/promo.js`). The
 * signup form shows the code in an editable field, so what is sent is always
 * what the person could see.
 *
 * ## The source is a hint
 *
 * `src` (qr / email / link) is what the share buttons put in the URL. A
 * customer can edit a query string, so the server records it for reporting
 * and nothing rests on it.
 */

const STORAGE_KEY = "horizon:referral-code";

/**
 * Loose on purpose: whether a code is real is the server's call (the register
 * form asks it live). This only keeps obvious junk out of storage.
 */
const CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,39}$/;

const SOURCES = ["link", "qr", "email"];

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
 * Returns `{ code, source }` now in force — the incoming one if there was one,
 * otherwise whatever was stored earlier.
 */
export const captureReferralCode = (search) => {
  const params = new URLSearchParams(search ?? "");
  const incoming = params.get("ref");
  if (!incoming) return getStoredReferral();

  const code = incoming.trim().toUpperCase();
  if (!CODE_PATTERN.test(code)) return getStoredReferral();

  const claimed = (params.get("src") ?? "").toLowerCase();
  const source = SOURCES.includes(claimed) ? claimed : "link";

  const value = { code, source };
  safely(() => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value)));
  return value;
};

/** `{ code, source }`, or null. Reads the pre-campaign plain-string format too. */
export const getStoredReferral = () =>
  safely(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { code: raw, source: "link" };
    }
    if (!parsed?.code || !CODE_PATTERN.test(parsed.code)) return null;
    return {
      code: parsed.code,
      source: SOURCES.includes(parsed.source) ? parsed.source : "link",
    };
  });

/** Just the code, for callers that do not care how it arrived. */
export const getStoredReferralCode = () => getStoredReferral()?.code ?? null;

/**
 * Forget it.
 *
 * Called once the account exists, whether or not the referral was accepted —
 * the code has done its job either way, and leaving it behind would attach it
 * to the next person who signs up on a shared device.
 */
export const clearReferralCode = () =>
  safely(() => window.localStorage.removeItem(STORAGE_KEY));

const VISITOR_KEY = "horizon:visitor-id";
const VISITED_KEY = "horizon:referral-visited";

/**
 * A random id for this browser, kept in storage. Used only to count unique
 * visitors to a referral link — it is not tied to a person and never leaves
 * the referral-visit request.
 */
export const getVisitorKey = () =>
  safely(() => {
    let key = window.localStorage.getItem(VISITOR_KEY);
    if (!key) {
      key =
        window.crypto?.randomUUID?.() ??
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      window.localStorage.setItem(VISITOR_KEY, key);
    }
    return key;
  });

/**
 * True the first time this browser opens a link with `code`; false after.
 * Saves a request per navigation — the server counts once per browser anyway.
 */
export const firstVisitOf = (code) =>
  safely(() => {
    const seen = JSON.parse(window.localStorage.getItem(VISITED_KEY) || "[]");
    if (seen.includes(code)) return false;
    window.localStorage.setItem(VISITED_KEY, JSON.stringify([...seen, code].slice(-50)));
    return true;
  }, false);

/** A shareable link to `path` carrying `code`. `src` marks the channel. */
export const buildReferralLink = (code, path = "/", src = "link") => {
  const url = new URL(path, window.location.origin);
  if (code) url.searchParams.set("ref", code);
  if (SOURCES.includes(src)) url.searchParams.set("src", src);
  return url.toString();
};
