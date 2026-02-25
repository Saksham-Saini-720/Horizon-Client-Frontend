
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

// Mock API - replace with real endpoint
const updateProfileApi = async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Simulate API response
  return {
    success: true,
    user: data,
  };
};

export default function useUpdateProfile() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileApi,

    onSuccess: (response) => {
      // Update Redux state
      dispatch(updateUser(response.user));
      
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Show success message
      toast.success("Profile updated successfully");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
