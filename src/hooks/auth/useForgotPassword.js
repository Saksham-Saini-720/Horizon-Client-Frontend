
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/authApi";
import toast from "react-hot-toast";

export default function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => {
      return forgotPassword(email);
    },

    onSuccess: () => {
      toast.success("Password reset link sent! Check your email.");
    },

    onError: (error) => {
      const message = 
        error.response?.data?.message || 
        "Failed to send reset link. Please try again.";
      
      toast.error(message);
    },
  });
}
