
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { refresh } from '../../api/authApi';
import { getTokens, setTokens, clearTokens } from '../../utils/token';
import { setAuth, clearAuth } from '../../store/slices/authSlice';

/**
 * Hook for refreshing access token
 * Handles token refresh, localStorage update, and Redux sync
 */
export const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {

      // Get refresh token from localStorage
      const { refreshToken } = getTokens();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh API
      const response = await refresh(refreshToken);
      
      return response.data;
    },

    onSuccess: (data) => {
      const { accessToken, refreshToken: newRefreshToken } = data;

      // Update localStorage
      setTokens(accessToken, newRefreshToken);

      // Update Redux state
      dispatch(setAuth({
        accessToken,
        refreshToken: newRefreshToken,
      }));

      // Invalidate all queries to refetch with new token
      queryClient.invalidateQueries();
    },

    onError: (error) => {
      // Clear tokens and logout
      clearTokens();
      dispatch(clearAuth());
    },

    retry: 1, // Retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  });
};

/**
 * Hook to manually trigger token refresh
 */
export const useManualRefresh = () => {
  const { mutate, mutateAsync, isPending, error } = useTokenRefresh();

  return {
    refresh: mutate,
    refreshAsync: mutateAsync,
    isRefreshing: isPending,
    error,
  };
};
