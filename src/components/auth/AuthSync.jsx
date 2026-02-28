
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syncAuthState } from "../../store/slices/authSlice";
import { getTokens } from "../../utils/token";

/**
 * AuthSync Component
 * 
 * Handles:
 * 1. Initial auth state sync from localStorage
 * 2. Cross-tab synchronization
 * 3. Logout when both tokens deleted manually
 */
export default function AuthSync() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ─── Initial Sync on Mount ────────────────────────────────────────────────────

  useEffect(() => {
    dispatch(syncAuthState());
  }, [dispatch]);

  // ─── Cross-Tab Synchronization ────────────────────────────────────────────────

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === "refreshToken" || e.key === "user") {
        dispatch(syncAuthState());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  // ─── Detect Both Tokens Deletion (Logout Trigger) ─────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check every second for both tokens deletion
    const interval = setInterval(() => {
      const { accessToken, refreshToken } = getTokens();

      // If both tokens missing while authenticated → Force logout
      if (!accessToken && !refreshToken && isAuthenticated) {
        dispatch(syncAuthState());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  return null; // This component doesn't render anything
}
