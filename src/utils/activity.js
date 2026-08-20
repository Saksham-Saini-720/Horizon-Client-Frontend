/**
 * Last-interaction tracking for the inactivity timeout.
 *
 * The access token's expiry is an absolute lifetime, so on its own it can never
 * expire an idle session — TokenRefreshManager renewing on a timer kept a
 * forgotten tab logged in indefinitely. This is the signal that says whether
 * anyone is still there.
 *
 * Stored in localStorage so activity in any open tab counts for all of them.
 */

const LAST_ACTIVITY_KEY = "auth:lastActivity";

// Must not exceed IDLE_SESSION_TIMEOUT on the backend (default 30m), which is
// the real enforcement point.
export const IDLE_LIMIT_MS = 30 * 60 * 1000;

export const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
];

export const markActivity = () => {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  } catch {
    // Storage unavailable (private mode); callers treat this as "active".
  }
};

export const getLastActivity = () => {
  try {
    const stored = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : null;
  } catch {
    return null;
  }
};

export const clearActivity = () => {
  try {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch {
    // Non-fatal.
  }
};

/**
 * True once the session has sat unused past the limit. Unknown last-activity
 * (first load, storage blocked) counts as active — this must never log someone
 * out spuriously; the backend is the authority either way.
 */
export const isIdleExpired = (limitMs = IDLE_LIMIT_MS) => {
  const lastActivity = getLastActivity();
  if (!lastActivity) return false;
  return Date.now() - lastActivity > limitMs;
};
