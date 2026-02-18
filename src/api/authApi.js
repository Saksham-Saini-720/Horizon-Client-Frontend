import { apiPost, apiGet } from "./apiHelper";

export const registerUser = (payload) =>
  apiPost("/api/v1/auth/register", payload);

export const loginUser = (payload) =>
  apiPost("/api/v1/auth/login", payload);

export const logoutUser = (refreshToken) =>
  apiPost("/auth/logout", { refreshToken });

export const getCurrentUser = () =>
  apiGet("/auth/me");

export const forgotPassword = (email) =>
  apiPost("/auth/forgot-password", { email });

export const resetPassword = (payload) =>
  apiPost("/auth/reset-password", payload);

export const changePassword = (payload) =>
  apiPost("/auth/change-password", payload);

export const sendOtp = (payload) =>
  apiPost("/auth/send-otp", payload);

export const verifyOtp = (payload) =>
  apiPost("/auth/verify-otp", payload);