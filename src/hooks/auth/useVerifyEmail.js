
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../../api/authApi";
import { updateUser } from "../../store/slices/authSlice";
import { broadcastAuthReload } from "../../utils/authReload";
import toast from "react-hot-toast";

export default function useVerifyEmail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({token, portal}) => {
      return verifyEmail({ token, portal });
    },

    onSuccess: (response) => {
      // Refresh the stored user — otherwise the snapshot keeps saying false and
      // the client-side gates (booking, login redirect) keep firing until the
      // next login. updateUser is a no-op when nobody is logged in.
      const verifiedUser = response?.data?.user;
      dispatch(updateUser({
        ...(verifiedUser ?? {}),
        emailVerification: true,
        verified: true,
      }));

      // Other tabs are still rendering this account as unverified. Reload them,
      // but not this one — it's about to show the success screen.
      broadcastAuthReload({ reloadSelf: false });

      // Show success message
      toast.success("Email verified successfully! Welcome to Horizon.");

      // Navigate to home after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },

    onError: (error) => {
      // Normalized Error from apiHelper — no `.response`.
      const message =
        error?.message ||
        "Verification failed. The link may be expired or invalid.";
      
      toast.error(message);
    },
  });
}
