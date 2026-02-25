
import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "../../api/authApi";
import toast from "react-hot-toast";

export default function useResendVerification() {
  return useMutation({
    mutationFn: async () => {
      const response = await resendVerification();
      console.log("Resend verification response:", response);
      return response.data;
    },
    
    onSuccess: () => {
      toast.success("Verification email sent! Check your inbox.");
    },
    
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to resend email. Please try again.";
      toast.error(message);
    },
  });
}
