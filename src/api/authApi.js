import { apiPost, apiGet } from "./apiHelper";

export const registerUser = (payload) =>
  apiPost("/auth/register", payload);

export const loginUser = (payload, ) =>
  apiPost("/auth/login", payload);

export const logoutUser = (refreshToken) =>
  apiPost("/auth/logout", { refreshToken });

export const getCurrentUser = () =>
  apiGet("/auth/me");

export const refresh = (refreshToken) =>
  apiPost("/auth/refresh", { refreshToken });

export const forgotPassword = (email) =>
  apiPost("/auth/forgot-password", { email });

export const resetPassword = (payload) =>
  apiPost("/auth/reset-password", payload);

export const changePassword = (payload) =>
  apiPost("/auth/change-password", payload);

export const verifyEmail = (payload) =>
  apiPost("/auth/verify-email", payload);

export const resendVerification = () =>
  apiPost("/auth/resend-verification");

