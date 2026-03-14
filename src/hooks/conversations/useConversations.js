
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getConversations } from '../../api/conversationApi';

export const useConversations = (filters = {}) => {
  const { status, search, page = 1, limit = 20 } = filters;

  // Get current user ID to find the "other" participant
  const currentUserId = useSelector(
    (state) => state.auth?.user?._id || state.auth?.user?.id
  );

  const query = useQuery({
    queryKey: ['conversations', { status, search, page, limit }],
    queryFn: () => getConversations({ status, search, page, limit }),
    select: (data) => {
      const conversations = data?.data?.conversations || data?.data || [];
      const pagination    = data?.data?.pagination || null;
      return {
        conversations: conversations.map((conv) =>
          normalizeConversation(conv, currentUserId)
        ),
        pagination,
        total: pagination?.total || conversations.length,
      };
    },
    placeholderData: { conversations: [], pagination: null, total: 0 },
    keepPreviousData: true,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return {
    conversations: query.data?.conversations ?? [],
    pagination:    query.data?.pagination    ?? null,
    total:         query.data?.total         ?? 0,
    isLoading:     query.isLoading,
    isFetching:    query.isFetching,
    isError:       query.isError,
    error:         query.error,
    refetch:       query.refetch,
  };
};

// ─── Normalize ────────────────────────────────────────────────────────────────

const normalizeConversation = (conv, currentUserId) => {
  // participants is an array — find the OTHER person (not current user)
  const participants = conv.participants || [];
  
  const otherParticipantObj = participants.find(
    (p) => {
      const uid = p.user?._id || p.user?.id;
      return uid !== currentUserId;
    }
  ) || participants[0]; // fallback to first if can't determine

  const otherUser = otherParticipantObj?.user || {};

  // unreadCounts is { [userId]: count } — get current user's unread
  const unreadCount = currentUserId
    ? (conv.unreadCounts?.[currentUserId] ?? 0)
    : 0;

  return {
    id: conv._id || conv.id,

    participant: {
      id:       otherUser._id  || otherUser.id  || '',
      name:     otherUser.name ||
                [otherUser.firstName, otherUser.lastName].filter(Boolean).join(' ') ||
                'Unknown',
      avatar:   otherUser.avatar || otherUser.profileImage || null,
      isOnline: otherUser.isOnline || false,
    },

    property: (conv.property && conv.property !== null)
      ? {
          id:       conv.property._id || conv.property.id,
          title:    conv.property.title || 'Property',
          location: conv.property.location || conv.property.address || '',
          image:    conv.property.images?.featured?.thumbnail?.url ||
                    conv.property.images?.[0] || null,
        }
      : null,

    lastMessage:          conv.lastMessage?.content || '',
    lastMessageAt:        conv.lastMessage?.sentAt  || conv.updatedAt,
    lastMessageIsFromMe:  conv.lastMessage?.sender === currentUserId,

    unreadCount,
    hasUnread: unreadCount > 0,

    status:  conv.status  || 'active',
    subject: conv.subject || '',
  };
};

export default useConversations;
