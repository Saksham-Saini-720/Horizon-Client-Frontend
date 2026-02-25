
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

// Mock API - replace with real endpoint
const uploadAvatarApi = async (file) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // In real app, upload to server/S3 and return URL
  const mockAvatarUrl = URL.createObjectURL(file);
  
  return {
    success: true,
    avatarUrl: mockAvatarUrl,
  };
};

export default function useUploadAvatar() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: uploadAvatarApi,

    onSuccess: (response) => {
      // Update Redux state with new avatar
      dispatch(updateUser({ avatar: response.avatarUrl }));
      
      toast.success("Avatar updated successfully");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to upload avatar");
    },
  });
}
