import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../store/slices/authSlice";
import { registerUser } from "../../api/authApi";
import toast from "react-hot-toast";
import { clearReferralCode } from "../../utils/referral";

export default function useRegisterMutation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await registerUser(userData);
      return response.data;
    },

    onSuccess: (data) => {
      // The code has done its job, whether or not a referral was actually
      // recorded. Leaving it behind would attach it to the next person who
      // signs up on a shared device.
      clearReferralCode();

      // Set auth in Redux
      dispatch(
        setAuth({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      );

      // Show success message
      toast.success("Registration successful! Please verify your email.");

      // Navigate to email verification page
      navigate("/verify-email");
    },

    onError: (error) => {
      // apiHelper rejects with a normalized Error (message/code/details/status),
      // not an axios error — there is no `.response` to read.
      const message =
        error?.details?.[0]?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });
}
