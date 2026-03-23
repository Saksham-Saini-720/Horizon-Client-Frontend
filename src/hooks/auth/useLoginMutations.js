
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../api/authApi";
import { setAuth } from "../../store/slices/authSlice";

export function useEmailLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || "/";

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await loginUser({ email, password, device: "web", portal: "client" });
      return { ...response.data, _email: email };
    },

    onSuccess: (data) => {
      const isVerified = data.user?.emailVerification === true;

      if (!isVerified) {
        
        dispatch(setAuth({
          user:         data.user,
          accessToken:  data.accessToken,
          refreshToken: data.refreshToken,
        }));

        // Navigate to verify-email page
        navigate("/verify-email", {
          replace: true,
          state: { email: data._email, fromLogin: true },
        });
        return;
      }

      dispatch(setAuth({
        user:         data.user,
        accessToken:  data.accessToken,
        refreshToken: data.refreshToken,
      }));

      navigate(from, { replace: true });
    },


    retry: false,
  });
}

