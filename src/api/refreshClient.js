import axios from "axios";
import { BASE_URL, TUNNEL_HEADERS } from "./config";
import { getRefreshToken, setTokens, clearTokens } from "../utils/token";

/**
 * Single-flight token refresh.
 *
 * Every refresh in the app must go through here. Backends that rotate refresh
 * tokens invalidate the old one on use, so two concurrent refreshes mean the
 * second call replays a consumed token, gets a 401, and wipes localStorage.
 * Callers that arrive while a refresh is in progress share the same promise.
 *
 * Uses bare axios (not axiosInstance) so a 401 here can never re-enter the
 * response interceptor and trigger another refresh.
 */
let inFlight = null;

export function refreshAccessToken() {
  if (inFlight) return inFlight;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available"));
  }

  inFlight = axios
    .post(
      `${BASE_URL}/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json", ...TUNNEL_HEADERS } }
    )
    .then((res) => {
      const accessToken = res.data?.data?.accessToken;
      // Not every backend rotates the refresh token — keep the old one if so.
      const newRefreshToken = res.data?.data?.refreshToken || refreshToken;

      if (!accessToken) {
        throw new Error("Refresh response did not contain an access token");
      }

      setTokens(accessToken, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    })
    .catch((err) => {
      // Refresh token is dead — nothing to salvage.
      clearTokens();
      localStorage.removeItem("user");
      throw err;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export const isRefreshInFlight = () => inFlight !== null;
