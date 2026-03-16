
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getConversations, getThreads } from '../../api/conversationApi';

export const useConversations = (filters = {}) => {
  const { status, search, page = 1, limit = 20 } = filters;

  const currentUserId = useSelector(
    (state) => state.auth?.user?._id || state.auth?.user?.id
  );
  const currentUserRole = useSelector(
    (state) => state.auth?.user?.role
  );

  const query = useQuery({
    queryKey: ['conversations', { status, search, page, limit }],
    queryFn: async () => {
      const data = await getConversations({ status, search, page, limit });
      const conversations = data?.data?.conversations || data?.data || [];

      // Each conversation can have MULTIPLE threads (one per property)
      // Show one list item per thread — not per conversation
      const allItems = [];

      await Promise.all(
        conversations.map(async (conv) => {
          try {
            const threadsResp = await getThreads(conv._id || conv.id);
            const threads = threadsResp?.data?.threads || [];

            if (threads.length === 0) {
              // Conversation with no threads — show as one item
              allItems.push(normalizeItem(conv, null, currentUserId, currentUserRole));
            } else {
              // One item per thread
              threads.forEach(thread => {
                allItems.push(normalizeItem(conv, thread, currentUserId, currentUserRole));
              });
            }
          } catch {
            allItems.push(normalizeItem(conv, null, currentUserId, currentUserRole));
          }
        })
      );

      // Sort by latest message
      allItems.sort((a, b) => {
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      });

      return {
        conversations: allItems,
        total: allItems.length,
      };
    },
    placeholderData: { conversations: [], total: 0 },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return {
    conversations: query.data?.conversations ?? [],
    total:         query.data?.total         ?? 0,
    isLoading:     query.isLoading,
    isFetching:    query.isFetching,
    isError:       query.isError,
    error:         query.error,
    refetch:       query.refetch,
  };
};

// ─── Normalize one thread → one list item ────────────────────────────────────

const normalizeItem = (conv, thread, currentUserId, currentUserRole) => {
  const client = conv.client || {};
  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'manager';

  const participant = isAdmin
    ? {
        id:     client._id || client.id || '',
        name:   [client.firstName, client.lastName].filter(Boolean).join(' ') || 'Client',
        avatar: client.avatar || null,
        isOnline: false,
      }
    : {
        id:     'support',
        name:   'Support',
        avatar: null,
        isOnline: false,
      };

  // Property from thread
  const prop = thread?.property;
  const property = prop
    ? {
        id:       prop._id || prop.id,
        title:    prop.title || 'Property',
        location: prop.location || '',
        image:    prop.images?.featured?.thumbnail?.url ||
                  prop.images?.featured?.original?.url || null,
      }
    : null;

  // lastMessage from thread
  const lastMsg = thread?.lastMessage;
  const lastSenderId = lastMsg?.sender?._id || lastMsg?.sender?.id || lastMsg?.sender || '';
  const lastMessageIsFromMe = lastSenderId.toString() === currentUserId?.toString();

  // unreadCounts from thread
  const clientId = client._id || client.id || '';
  const isClient = clientId.toString() === currentUserId?.toString();
  const unreadCount = thread
    ? isClient
      ? (thread.unreadCounts?.[currentUserId] ?? 0)
      : (thread.unreadCounts?.['staff'] ?? 0)
    : 0;

  //Use conversationId for navigation — ConversationPage will find the right thread
  const conversationId = conv._id || conv.id;
  const threadId = thread?._id || thread?.id;

  return {
    // Unique ID per thread item
    id:                  threadId || conversationId,
    conversationId,
    threadId,
    participant,
    property,
    lastMessage:         lastMsg?.content || '',
    lastMessageAt:       lastMsg?.sentAt  || thread?.updatedAt || conv.updatedAt,
    lastMessageIsFromMe,
    unreadCount,
    hasUnread:           unreadCount > 0,
    status:              thread?.status || conv.status || 'active',
    subject:             thread?.subject || '',
  };
};

export default useConversations;
