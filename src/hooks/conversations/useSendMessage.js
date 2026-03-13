
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../api/conversationApi';
import {
  addOptimisticMessage,
  removeOptimisticMessage,
} from '../../store/slices/conversationSlice';
import toast from 'react-hot-toast';

/**
 * useSendMessage
 * Sends a message with optimistic UI update
 * - Instantly shows message in UI
 * - Removes it if API fails, shows error
 * 
 * UPDATED: Added retry logic for better reliability
 * 
 * Usage:
 * const { sendMsg, isSending } = useSendMessage(conversationId);
 * sendMsg('Hello there!');
 */
export const useSendMessage = (conversationId) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state) => state.auth.user);

  const mutation = useMutation({
    mutationFn: (content) => sendMessage(conversationId, content),
    
    // UPDATED: Add retry logic for network failures
    retry: 2, // Retry twice on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    onMutate: async (content) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['conversation', conversationId],
      });

      // Generate temp ID for optimistic message
      const tempId = `optimistic-${Date.now()}`;

      // Add optimistic message to Redux (instant UI)
      const optimisticMsg = {
        id: tempId,
        tempId,
        content,
        createdAt: new Date().toISOString(),
        isFromMe: true,
        senderId: currentUser?._id || currentUser?.id || '',
        senderName: currentUser?.name || currentUser?.firstName || '',
        isRead: false,
        isOptimistic: true,
      };

      dispatch(addOptimisticMessage({ conversationId, message: optimisticMsg }));

      // Also update the conversations list cache (last message preview)
      queryClient.setQueryData(
        ['conversations', { status: undefined, search: undefined, page: 1, limit: 20 }],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            conversations: oldData.conversations?.map((conv) =>
              conv.id === conversationId
                ? { ...conv, lastMessage: content, lastMessageAt: new Date().toISOString(), lastMessageIsFromMe: true }
                : conv
            ),
          };
        }
      );

      return { tempId };
    },

    onSuccess: (response, content, context) => {
      // Remove optimistic message (real one will come from refetch)
      if (context?.tempId) {
        dispatch(
          removeOptimisticMessage({ conversationId, tempId: context.tempId })
        );
      }
      
      //  UPDATED: Smarter cache invalidation
      // Only invalidate specific conversation
      queryClient.invalidateQueries({ 
        queryKey: ['conversation', conversationId],
        exact: true
      });
      
      // Refetch conversations list
      queryClient.refetchQueries({ 
        queryKey: ['conversations'],
        type: 'active'
      });
    },

    onError: (error, content, context) => {
      // Remove the failed optimistic message
      if (context?.tempId) {
        dispatch(
          removeOptimisticMessage({ conversationId, tempId: context.tempId })
        );
      }

      toast.error(error.message || 'Failed to send message', {
        duration: 3000,
        position: 'top-center',
      });
    },
  });

  return {
    sendMsg: mutation.mutate,
    sendMsgAsync: mutation.mutateAsync,
    isSending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useSendMessage;
