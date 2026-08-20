import axios from "axios";
import { BASE_URL, TUNNEL_HEADERS } from "./config";
import { refreshAccessToken } from "./refreshClient";
import { getAccessToken } from "../utils/token";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    ...TUNNEL_HEADERS,
  },
});

// ===== REQUEST INTERCEPTOR =====
axiosInstance.interceptors.request.use(
  (config) => {

    if (config.skipAuthRefresh) return config;

    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR (AUTO REFRESH) =====

// Routes that must never trigger a token refresh on 401 — either they are
// unauthenticated to begin with, or (in the case of /auth/refresh) refreshing
// them would recurse into this same handler.
const NO_REFRESH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/reset-password",
  "/auth/forgot-password",
  "/auth/verify-email",
  "/auth/change-password",
];

// Stash why the session ended so the login page can explain it. The redirect
// below is a full page load, so component state would not survive it.
const redirectToLogin = (reason = "expired") => {
  try {
    sessionStorage.setItem("auth:endedReason", reason);
  } catch {
    // Private mode / storage disabled — the redirect still happens.
  }

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    const url = originalRequest?.url || "";
    const isNoRefreshRoute = NO_REFRESH_ROUTES.some((route) => url.includes(route));

    // only handle 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isNoRefreshRoute
    ) {
      originalRequest._retry = true;

      try {
        // Shared single-flight refresh — concurrent 401s all await the same
        // call instead of each burning a rotating refresh token.
        const { accessToken } = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // refreshAccessToken already cleared storage on failure.
        // The backend distinguishes an idle session from an ordinary expiry.
        const refreshMsg = err?.response?.data?.error?.message || err?.message || "";
        redirectToLogin(/inactivity/i.test(refreshMsg) ? "inactivity" : "expired");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
