
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
  } catch (error) {
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
      } catch (error) {
        throw new Error('Failed to refresh token after access token deletion');
      }
      return;
    }

    // Case 3: Check if token is expiring soon (within 2 minutes)
    if (accessToken && isTokenExpiring(accessToken, 2)) {
      try {
        await refreshTokens();
      } catch (error) {
        throw new Error('Failed to refresh token before expiry');
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

  // ─── Monitor localStorage for Manual Token Deletion ──────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;

    let lastAccessToken = getTokens().accessToken;
    let lastRefreshToken = getTokens().refreshToken;

    // Poll every second to detect same-tab manual deletion
    const pollInterval = setInterval(async () => {
      const { accessToken, refreshToken } = getTokens();

      // Both tokens deleted → AuthSync will handle logout
      if (!accessToken && !refreshToken) {
        if (lastAccessToken || lastRefreshToken) {
          throw new Error('Both tokens manually deleted - triggering logout'); // This will be caught by AuthSync
          // AuthSync will trigger logout
        }
        lastAccessToken = null;
        lastRefreshToken = null;
        return;
      }

      // Only accessToken deleted but refreshToken exists
      if (!accessToken && refreshToken && lastAccessToken) {
        try {
          await refreshTokens();
        } catch (error) {
          throw new Error('Failed to refresh token after manual access token deletion');
        }
      }

      // Update last known values
      lastAccessToken = accessToken;
      lastRefreshToken = refreshToken;
    }, 1000); // Check every second

    // Listen for storage events (from other tabs)
    const handleStorageChange = async (e) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        
        const { accessToken, refreshToken } = getTokens();

        // If only accessToken missing, try to refresh
        if (!accessToken && refreshToken) {
          try {
            await refreshTokens();
          } catch (error) {
            throw new Error('Failed to refresh token after access token deletion in another tab');
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, refreshTokens]);

  return null; // This component doesn't render anything
}
