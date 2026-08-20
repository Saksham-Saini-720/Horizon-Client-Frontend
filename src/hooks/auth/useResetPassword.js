
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
      // apiHelper normalizes failures into a plain Error carrying
      // message/code/details/status — there is no `.response`, so the old
      // `error.response?.data?.message` was always undefined and every real
      // failure (a 400 from validation, a rate limit, a genuinely expired
      // token) surfaced as the same "link may be expired" guess.
      const message =
        error?.details?.[0]?.message ||
        error?.message ||
        "Failed to reset password. The link may be expired.";

      toast.error(message);
    },
  });
}
