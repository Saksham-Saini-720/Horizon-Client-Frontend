
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syncAuthState } from "../../store/slices/authSlice";

/**
 * AuthSync - Global component that syncs auth state with localStorage
 * Detects when tokens are manually removed and logs user out
 * 
 * Add this to App.jsx to run globally
 */
export default function AuthSync() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initial sync on mount
    dispatch(syncAuthState());

    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === "refreshToken" || e.key === "user") {
        dispatch(syncAuthState());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll localStorage every 1 second to detect same-tab changes
    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      
      // Token removed but Redux thinks user is logged in
      if (!token && isAuthenticated) {
        dispatch(syncAuthState());
      }
      
      // Token exists but Redux thinks user is logged out
      if (token && !isAuthenticated) {
        dispatch(syncAuthState());
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [dispatch, isAuthenticated]);

  return null; // This component doesn't render anything
}
