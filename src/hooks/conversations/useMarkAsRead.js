
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { markConversationAsRead, getUnreadCount } from '../../api/conversationApi';
import { setUnreadCount, decrementUnread } from '../../store/slices/conversationSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { useEffect } from 'react';

/**
 * useMarkAsRead
 * Marks a conversation as read when user opens it
 * Updates Redux unread count
 * 
 * UPDATED: Smarter cache invalidation
 * 
 * Usage:
 * const { markRead } = useMarkAsRead();
 * markRead(conversationId);
 */
export const useMarkAsRead = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (conversationId) => markConversationAsRead(conversationId),
    onMutate: () => {
      // Optimistically decrement unread
      dispatch(decrementUnread());
    },
    onSuccess: (_, conversationId) => {
      // UPDATED: Smarter cache invalidation
      
      // Only invalidate specific conversation
      queryClient.invalidateQueries({ 
        queryKey: ['conversation', conversationId],
        exact: true // Only this exact query
      });
      
      // Refetch conversations list (but keep cache temporarily)
      queryClient.refetchQueries({ 
        queryKey: ['conversations'],
        type: 'active' // Only active queries
      });
      
      // Update unread count
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
    onError: () => {
      // Revert if failed — just re-fetch
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
    retry: false,
  });

  return {
    markRead: mutation.mutate,
    isMarking: mutation.isPending,
  };
};

/**
 * useUnreadCount
 * Fetches total unread message count
 * Syncs to Redux store
 * 
 * Usage:
 * const { unreadCount } = useUnreadCount();
 */
export const useUnreadCount = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const query = useQuery({
    queryKey: ['unreadCount'],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    select: (data) => {
      return data?.data?.totalUnreadMessages ?? data?.data?.unreadThreads ?? 0;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Sync to Redux when data changes
  useEffect(() => {
    if (query.data !== undefined) {
      dispatch(setUnreadCount(query.data));
    }
  }, [query.data, dispatch]);

  return {
    unreadCount: query.data ?? 0,
    isLoading: query.isLoading,
  };
};

export default useMarkAsRead;
