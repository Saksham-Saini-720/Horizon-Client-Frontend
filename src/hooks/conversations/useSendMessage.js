
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, getThreads } from '../../api/conversationApi';
import { addOptimisticMessage, removeOptimisticMessage } from '../../store/slices/conversationSlice';
import toast from 'react-hot-toast';

export const useSendMessage = (conversationId) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state) => state.auth.user);

  const mutation = useMutation({
    mutationFn: async (content) => {
      //  Get threadId — first check cache, then fetch
      let threadId = queryClient.getQueryData(['activeThread', conversationId]);

      if (!threadId) {
        // Fetch threads for this conversation
        const threadsResponse = await getThreads(conversationId);
        const threads = threadsResponse?.data?.threads || [];
        // Use the first active thread
        const activeThread = threads.find(t => t.status !== 'closed') || threads[0];
        threadId = activeThread?._id || activeThread?.id;

        if (threadId) {
          // Cache it for subsequent messages
          queryClient.setQueryData(['activeThread', conversationId], threadId);
        }
      }

      if (!threadId) throw new Error('No thread found for this conversation');

      // New endpoint: /conversations/:conversationId/threads/:threadId/messages
      return sendMessage(conversationId, threadId, content);
    },

    retry: 1,

    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ['conversation', conversationId] });

      const tempId = `optimistic-${Date.now()}`;
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
      return { tempId };
    },

    onSuccess: (response, content, context) => {
      if (context?.tempId) {
        dispatch(removeOptimisticMessage({ conversationId, tempId: context.tempId }));
      }
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId], exact: true });
      queryClient.refetchQueries({ queryKey: ['conversations'], type: 'active' });
    },

    onError: (error, content, context) => {
      if (context?.tempId) {
        dispatch(removeOptimisticMessage({ conversationId, tempId: context.tempId }));
      }
      toast.error(error.message || 'Failed to send message', { duration: 3000, position: 'top-center' });
    },
  });

  return {
    sendMsg:      mutation.mutate,
    sendMsgAsync: mutation.mutateAsync,
    isSending:    mutation.isPending,
    isError:      mutation.isError,
    error:        mutation.error,
  };
};

export default useSendMessage;
