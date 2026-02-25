
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/slices/authSlice";
import { logoutUser } from "../../api/authApi";
import { getTokens } from "../../utils/token";
import toast from "react-hot-toast";

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { refreshToken } = getTokens();
      
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      
      return await logoutUser(refreshToken);
    },

    onSuccess: () => {
      // Clear Redux state
      dispatch(clearAuth());
      
      // Clear TanStack Query cache
      queryClient.clear();
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Navigate to login
      navigate("/login");
    },

    onError: (error) => {
      // Even if API fails, still logout locally
      console.error("Logout API error:", error);
      
      // Clear Redux state anyway
      dispatch(clearAuth());
      
      // Clear TanStack Query cache
      queryClient.clear();
      
      // Navigate to login
      navigate("/login");
      
      // Show warning toast
      toast("Logged out (API error occurred)", {
        icon: "⚠️",
      });
    },
  });
}
