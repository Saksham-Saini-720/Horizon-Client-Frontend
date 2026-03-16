
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getConversationById, getThreads, getThreadMessages } from '../../api/conversationApi';

// Now accepts optional threadId to load specific thread
export const useConversationById = (conversationId, options = {}) => {
  const { messageLimit = 50, threadId: specificThreadId = null } = options;
  const queryClient = useQueryClient();

  const currentUserId = useSelector(
    (state) => state.auth?.user?._id || state.auth?.user?.id
  );

  const query = useQuery({
    queryKey: ['conversation', conversationId, specificThreadId, { messageLimit }],
    queryFn: async () => {
      // Step 1: Get conversation
      const convResponse = await getConversationById(conversationId);
      const conv = convResponse?.data?.conversation || convResponse?.data || {};

      // Step 2: Get threads
      const threadsResponse = await getThreads(conversationId);
      const threads = threadsResponse?.data?.threads || [];

      // Use specificThreadId if provided, else first active thread
      let activeThread;
      if (specificThreadId) {
        activeThread = threads.find(t => (t._id || t.id) === specificThreadId) || threads[0];
      } else {
        activeThread = threads.find(t => t.status !== 'closed') || threads[0];
      }

      const threadId = activeThread?._id || activeThread?.id;

      // Cache for useSendMessage
      if (threadId) {
        queryClient.setQueryData(['activeThread', conversationId], threadId);
      }

      // Step 3: Get messages for this specific thread
      let messages = [];
      if (threadId) {
        const messagesResponse = await getThreadMessages(conversationId, threadId, { limit: messageLimit });
        messages = messagesResponse?.data?.messages || messagesResponse?.messages || [];
      }

      return normalizeConversation(conv, messages, currentUserId, activeThread);
    },
    enabled: !!conversationId,
    staleTime: 1000 * 15,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 15,
    refetchIntervalInBackground: false,
    retry: 1,
  });

  return {
    conversation: query.data ?? null,
    messages:     query.data?.messages   ?? [],
    participant:  query.data?.participant ?? null,
    property:     query.data?.property   ?? null,
    isLoading:    query.isLoading,
    isFetching:   query.isFetching,
    isError:      query.isError,
    error:        query.error,
    refetch:      query.refetch,
  };
};

const normalizeConversation = (conv, rawMessages, currentUserId, thread) => {
  const participants = conv.participants || [];
  const otherParticipantObj = participants.find((p) => {
    const uid = p.user?._id || p.user?.id;
    return uid !== currentUserId;
  }) || participants[0];
  const otherUser = otherParticipantObj?.user || {};

  const prop = thread?.property;
  const property = prop
    ? {
        id:       prop._id || prop.id,
        title:    prop.title || 'Property',
        location: prop.location || '',
        image:    prop.images?.featured?.thumbnail?.url ||
                  prop.images?.featured?.original?.url ||
                  prop.images?.[0] || null,
        purpose:  prop.purpose || 'sale',
      }
    : null;

  return {
    id: conv._id || conv.id,

    participant: {
      id:       otherUser._id || otherUser.id || '',
      name:     [otherUser.firstName, otherUser.lastName].filter(Boolean).join(' ') ||
                otherUser.name || 'Support',
      avatar:   otherUser.avatar || otherUser.profileImage || null,
      isOnline: false,
      lastSeen: null,
    },

    property,

    messages: rawMessages.map((msg) => {
      const senderId = msg.sender?._id || msg.sender?.id || msg.sender || '';
      return {
        id:         msg._id || msg.id,
        content:    msg.content || '',
        createdAt:  msg.createdAt,
        isFromMe:   senderId.toString() === currentUserId?.toString(),
        senderId,
        senderName: [msg.sender?.firstName, msg.sender?.lastName].filter(Boolean).join(' ') || '',
        isRead:     msg.isRead || false,
        readAt:     msg.readAt || null,
      };
    }),

    status:     conv.status || 'active',
    subject:    thread?.subject || conv.subject || '',
    unreadCount: conv.unreadCount || 0,
  };
};

export default useConversationById;
