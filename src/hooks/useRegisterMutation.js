
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../api/authApi";
import { setAuth } from "../store/slices/authSlice";

export default function useRegisterMutation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await registerUser(userData);
      return response;
    },

    onSuccess: (data) => {
      // Dispatch to Redux - automatically syncs to localStorage
      dispatch(setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));

      // Navigate to home
      navigate("/", { replace: true });
    },

    onError: (error) => {
      console.error("Registration failed:", error);
    },

    retry: false,
  });
}
