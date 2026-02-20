
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, sendOtp, verifyOtp } from "../api/authApi";
import { setTokens } from "../utils/token";

/**
 * Email login mutation
 */
export function useEmailLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = location.state?.from?.pathname || "/";

  return useMutation({
    mutationFn: async ({ email, password }) => {
      return await loginUser({ email, password, device: "web" });
    },

    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Invalidate auth query
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      navigate(from, { replace: true });
    },

    retry: false,
  });
}

/**
 * Send OTP mutation
 */
export function useSendOtpMutation() {
  return useMutation({
    mutationFn: async ({ phone }) => {
      return await sendOtp({ phone });
    },
    retry: 1,
  });
}

/**
 * Verify OTP mutation
 */
export function useVerifyOtpMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = location.state?.from?.pathname || "/";

  return useMutation({
    mutationFn: async ({ phone, otp }) => {
      return await verifyOtp({ phone, otp });
    },

    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Invalidate auth query
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      navigate(from, { replace: true });
    },

    retry: false,
  });
}
