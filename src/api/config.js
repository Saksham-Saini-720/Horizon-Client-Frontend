// No fallback on purpose. The previous hardcoded default pointed at a port the
// backend does not use, so a missing .env failed as confusing request errors
// deep in the app instead of at startup.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Free-tier ngrok answers browser-looking requests with an HTML interstitial
 * instead of proxying them, so every XHR comes back as an unparseable warning
 * page. This header opts out of it.
 *
 * Only sent when the API really is behind an ngrok tunnel — an unknown header
 * on a normal backend risks tripping a strict CORS allowed-headers list for no
 * benefit.
 */
const isNgrokHost = (() => {
  try {
    return /\.ngrok(-free)?\.(app|dev|io)$/.test(new URL(BASE_URL).hostname);
  } catch {
    return false;
  }
})();

export const TUNNEL_HEADERS = isNgrokHost
  ? { "ngrok-skip-browser-warning": "true" }
  : {};
