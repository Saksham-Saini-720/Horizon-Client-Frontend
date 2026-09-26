/**
 * Carrying a promo code from a poster, a link or a QR scan to the booking form.
 *
 * Modelled on `utils/referral.js`, and for the same reason: a promo link points
 * at whatever the campaign was advertising — usually a property — not at the
 * booking form. Somebody scans a QR on a billboard, browses for ten minutes,
 * then opens Request Tour, by which time the query string is long gone. So the
 * code is taken out of the URL the moment it is seen and kept until it is used.
 *
 * ## Why the source is stored alongside it
 *
 * A scan and a shared link both arrive as `?promo=`. They are told apart only
 * by the `src` the QR encodes, and that distinction is worth keeping: it is the
 * difference between "the billboard worked" and "people are forwarding this to
 * each other". Neither is trustworthy — a customer can edit a query string —
 * which is why the server treats it as a hint and nothing rests on it.
 *
 * Unlike a referral code, a promo code is NOT first-wins. The most recent
 * campaign a person encountered is the one they are acting on, and a stale code
 * from three campaigns ago outranking it would be perverse.
 */

const STORAGE_KEY = "horizon:promo-code";

/** Matches the server: 3-24 chars, letters, digits and inner hyphens. */
const CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,23}$/;

const SOURCES = ["manual", "link", "qr"];

/**
 * Every read and write is wrapped: `localStorage` throws in a private window on
 * some browsers, and in an in-app webview with site data blocked. A promo code
 * that cannot be remembered is a shame; a property page that will not render
 * because of it is a bug.
 */
const safely = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

/**
 * Take a promo code out of a query string and keep it.
 *
 * Returns what is now stored, which may be a code seen on an earlier page.
 */
export const capturePromoCode = (search) => {
  const params = new URLSearchParams(search ?? "");
  const incoming = params.get("promo");
  if (!incoming) return getStoredPromo();

  const code = incoming.trim().toUpperCase();
  if (!CODE_PATTERN.test(code)) return getStoredPromo();

  // `src=qr` is set by the QR the admin console generates. Anything else that
  // arrived by link is a link; anything with no query string at all was typed.
  const claimed = (params.get("src") ?? "").toLowerCase();
  const source = SOURCES.includes(claimed) && claimed !== "manual" ? claimed : "link";

  const value = { code, source };
  safely(() => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value)));
  return value;
};

/** `{ code, source }`, or null. */
export const getStoredPromo = () =>
  safely(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.code || !CODE_PATTERN.test(parsed.code)) return null;
    return {
      code: parsed.code,
      source: SOURCES.includes(parsed.source) ? parsed.source : "link",
    };
  });

/**
 * Forget it.
 *
 * Called once a booking carrying the code succeeds — leaving it behind would
 * attach a spent campaign to the next tour this person books, and to the next
 * person who uses the device.
 */
export const clearPromoCode = () =>
  safely(() => window.localStorage.removeItem(STORAGE_KEY));

/** A shareable link to `path` carrying `code`. `src` marks the channel. */
export const buildPromoLink = (code, path = "/", src = "link") => {
  const url = new URL(path, window.location.origin);
  if (code) url.searchParams.set("promo", code);
  if (src && src !== "manual") url.searchParams.set("src", src);
  return url.toString();
};
