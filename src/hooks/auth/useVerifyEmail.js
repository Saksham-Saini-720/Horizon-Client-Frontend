
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../api/authApi";
import toast from "react-hot-toast";

export default function useVerifyEmail() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (token) => {
      return verifyEmail({ token });
    },

    onSuccess: () => {
      // Show success message
      toast.success("Email verified successfully! Welcome to Horizon.");
      
      // Navigate to home after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },

    onError: (error) => {
      const message = 
        error.response?.data?.message || 
        "Verification failed. The link may be expired or invalid.";
      
      toast.error(message);
    },
  });
}
