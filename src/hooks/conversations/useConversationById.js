
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getConversationById } from '../../api/conversationApi';

export const useConversationById = (conversationId, options = {}) => {
  const { messagePage = 1, messageLimit = 50 } = options;

  // Get current user ID — same fix as useConversations
  const currentUserId = useSelector(
    (state) => state.auth?.user?._id || state.auth?.user?.id
  );

  const query = useQuery({
    queryKey: ['conversation', conversationId, { messagePage, messageLimit }],
    queryFn: () => getConversationById(conversationId, { messagePage, messageLimit }),
    enabled: !!conversationId,
    select: (data) => {
      const conv = data?.data?.conversation || data?.data || {};
      return normalizeConversationDetail(conv, currentUserId);
    },
    staleTime: 1000 * 15,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 15,
    refetchIntervalInBackground: false,
    retry: 1,
  });

  return {
    conversation: query.data ?? null,
    messages:     query.data?.messages    ?? [],
    participant:  query.data?.participant  ?? null,
    property:     query.data?.property    ?? null,
    isLoading:    query.isLoading,
    isFetching:   query.isFetching,
    isError:      query.isError,
    error:        query.error,
    refetch:      query.refetch,
  };
};

// ─── Normalize ────────────────────────────────────────────────────────────────

const normalizeConversationDetail = (conv, currentUserId) => {
  // participants is an array — find the OTHER person (not current user)
  const participants = conv.participants || [];

  const otherParticipantObj = participants.find((p) => {
    const uid = p.user?._id || p.user?.id;
    return uid !== currentUserId;
  }) || participants[0];

  const otherUser = otherParticipantObj?.user || {};

  return {
    id: conv._id || conv.id,

    participant: {
      id:       otherUser._id || otherUser.id || '',
      name:     otherUser.name ||
                [otherUser.firstName, otherUser.lastName].filter(Boolean).join(' ') ||
                'Unknown',
      avatar:   otherUser.avatar || otherUser.profileImage || null,
      isOnline: otherUser.isOnline || false,
      lastSeen: otherUser.lastSeen || null,
    },

    property: (conv.property && conv.property !== null)
      ? {
          id:       conv.property._id || conv.property.id,
          title:    conv.property.title || 'Property',
          location: conv.property.location || conv.property.address || '',
          // Fix image path
          image:    conv.property.images?.featured?.thumbnail?.url ||
                    conv.property.images?.featured?.original?.url ||
                    conv.property.images?.[0] || null,
          purpose:  conv.property.purpose || conv.property.listingType || 'sale',
        }
      : null,

    // Fix isFromMe — check sender against currentUserId
    messages: (conv.messages || []).map((msg) => normalizeMessage(msg, currentUserId)),

    status:     conv.status || 'active',
    subject:    conv.subject || '',
    unreadCount: conv.unreadCount || 0,
  };
};

const normalizeMessage = (msg, currentUserId) => {
  // sender can be object or string ID
  const senderId = msg.sender?._id || msg.sender?.id || msg.sender || msg.senderId || '';
  const isFromMe = senderId === currentUserId ||
                   msg.isFromCurrentUser === true ||
                   msg.isMine === true;

  return {
    id:         msg._id || msg.id,
    content:    msg.content || '',
    createdAt:  msg.createdAt,
    isFromMe,
    senderId,
    senderName: msg.sender?.name || msg.sender?.firstName || '',
    isRead:     msg.isRead || false,
    readAt:     msg.readAt || null,
  };
};

export default useConversationById;
