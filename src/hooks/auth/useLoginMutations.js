
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, sendOtp, verifyOtp } from "../../api/authApi";
import { setAuth } from "../../store/slices/authSlice";


/**
 * Email login mutation with Redux
 */
export function useEmailLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || "/";

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response  = await loginUser({ email, password, device: "web", portal: "client" });
      return response.data;
    },

    onSuccess: (data) => {
      // Dispatch to Redux - automatically syncs to localStorage
      dispatch(setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));
      
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
 * Verify OTP mutation with Redux
 */
export function useVerifyOtpMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || "/";

  return useMutation({
    mutationFn: async ({ phone, otp }) => {
      return await verifyOtp({ phone, otp });
    },

    onSuccess: (data) => {
      // Dispatch to Redux
      dispatch(setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));
      
      navigate(from, { replace: true });
    },

    retry: false,
  });
}
