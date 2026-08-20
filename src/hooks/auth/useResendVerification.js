
import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "../../api/authApi";
import toast from "react-hot-toast";

export default function useResendVerification() {
  return useMutation({
    mutationFn: async () => {
      const response = await resendVerification();
      return response.data;
    },
    
    onSuccess: () => {
      toast.success("Verification email sent! Check your inbox.");
    },
    
    onError: (error) => {
      // Normalized Error from apiHelper — no `.response`.
      const message =
        error?.message || "Failed to resend email. Please try again.";
      toast.error(message);
    },
  });
}
