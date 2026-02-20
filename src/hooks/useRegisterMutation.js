
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { setTokens } from "../utils/token";

export default function useRegisterMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await registerUser(userData);
      return response;
    },

    onSuccess: (data) => {
      // Save tokens + user
      setTokens(data.accessToken, data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // CRITICAL: Invalidate auth query so ProtectedRoute knows user is logged in
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Navigate to home
      navigate("/", { replace: true });
    },

    onError: (error) => {
      console.error("Registration failed:", error);
    },

    retry: false,
  });
}
