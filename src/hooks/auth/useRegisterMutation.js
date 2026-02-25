
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../store/slices/authSlice";
import { registerUser } from "../../api/authApi";
import toast from "react-hot-toast";

export default function useRegisterMutation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await registerUser(userData);
      return response.data;
    },

    onSuccess: (data) => {
      // Set auth in Redux
      dispatch(setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));

      // Show success message
      toast.success("Registration successful! Please verify your email.");

      // Navigate to email verification page
      navigate("/verify-email");
    },

    onError: (error) => {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    },
  });
}

