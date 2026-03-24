
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../api/authApi";
import toast from "react-hot-toast";

export default function useResetPassword() {

  return useMutation({
    mutationFn: ({ token, newPassword, portal }) => {
      return resetPassword({ token, newPassword, portal }, {skipAuthRefresh : true});
    },

    onSuccess: () => {
      toast.success("Password reset successfully! You can now log in.");      
    },

    onError: (error) => {
      const message = 
        error.response?.data?.message || 
        "Failed to reset password. The link may be expired.";
      
      toast.error(message);
    },
  });
}
