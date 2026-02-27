
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/authApi";
import toast from "react-hot-toast";

export default function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, newPassword }) => {
      return changePassword({ token, newPassword });
    },

    onSuccess: () => {
      toast.success("Password changed successfully! You can now log in.");
      
      // Navigate to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    },

    onError: (error) => {
      const message = 
        error.response?.data?.message || 
        "Failed to reset password. The link may be expired.";
      
      toast.error(message);
    },
  });
}
