
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTokenRefresh } from '../../hooks/auth/useTokenRefresh';
import { getTokens } from '../../utils/token';

/**
 * Check if JWT token is expired or about to expire
 * @param {string} token - JWT token
 * @param {number} bufferMinutes - Refresh buffer in minutes (default: 2)
 * @returns {boolean}
 */
const isTokenExpiring = (token, bufferMinutes = 2) => {
  if (!token) return false;

  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const bufferTime = bufferMinutes * 60 * 1000;

    // Return true if token expires within buffer time
    return (expiryTime - currentTime) < bufferTime;
  } catch  {
    return false;
  }
};

/**
 * TokenRefreshManager Component
 * 
 * Handles:
 * 1. Automatic token refresh before expiry (15 min tokens → refresh at 13 min)
 * 2. Manual token deletion detection and recovery
 * 3. Smart logout when both tokens deleted
 */
export default function TokenRefreshManager() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mutateAsync: refreshTokens } = useTokenRefresh();

  // ─── Proactive Token Refresh ────────────────────────────────────────────────

  const checkAndRefreshToken = useCallback(async () => {
    if (!isAuthenticated) return;

    const { accessToken, refreshToken } = getTokens();

    // Case 1: Both tokens missing → Handled by AuthSync (logout)
    if (!accessToken && !refreshToken) {
      return;
    }

    // Case 2: Only accessToken missing but refreshToken exists
    if (!accessToken && refreshToken) {
      try {
        await refreshTokens();
      } catch {
        // onError in useTokenRefresh will clearAuth if refresh fails
      }
      return;
    }

    // Case 3: Check if token is expiring soon (within 2 minutes)
    if (accessToken && isTokenExpiring(accessToken, 2)) {
      try {
        await refreshTokens();
      } catch {
        // onError in useTokenRefresh will clearAuth if refresh fails
      }
    }
  }, [isAuthenticated, refreshTokens]);

  // ─── Check Token Every Minute ────────────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check immediately on mount
    checkAndRefreshToken();

    // Then check every minute
    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 60 * 1000); // 60 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, checkAndRefreshToken]);

  // ─── Monitor localStorage for Manual Token Deletion (other tabs only) ────────

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleStorageChange = async (e) => {
      if (e.key !== 'accessToken' && e.key !== 'refreshToken') return;

      const { accessToken, refreshToken } = getTokens();

      // Only accessToken missing in another tab → try to refresh
      if (!accessToken && refreshToken) {
        try {
          await refreshTokens();
        } catch {
          // AuthSync's interval will detect both tokens gone and trigger logout
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated, refreshTokens]);

  return null; // This component doesn't render anything
}
