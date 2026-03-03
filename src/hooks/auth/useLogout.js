
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/slices/authSlice";
import { clearActivity } from "../../store/slices/activitySlice"; 
import { logoutUser } from "../../api/authApi";
import { getTokens } from "../../utils/token";
import toast from "react-hot-toast";

/**
 * useLogout Hook
 * Handles logout with API call and complete state cleanup
 */
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
      
      // Call logout API
      return await logoutUser(refreshToken);
    },

    onSuccess: () => {
      // Clear Redux auth state
      dispatch(clearAuth());
      
      // Clear activity state (if you have it)
      // Uncomment if you have activity slice:
      // dispatch(clearActivity());
      
      // Clear TanStack Query cache
      queryClient.clear();
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Navigate to login (replace: true prevents going back)
      navigate("/login", { replace: true });
    },

    onError: (error) => {
      
      // Clear Redux auth state anyway
      dispatch(clearAuth());
      
      // Clear activity state (if you have it)
      // Uncomment if you have activity slice:
      // dispatch(clearActivity());
      
      // Clear TanStack Query cache
      queryClient.clear();
      
      // Navigate to login
      navigate("/login", { replace: true });
      
      // Show warning toast
      toast("Logged out (API error occurred)", {
        icon: "⚠️",
      });
    },

    onSettled: () => {
      // This runs whether success or error
      // Additional cleanup can go here if needed
    },
  });
}
