// src/hooks/conversations/useConversationById.js - UPDATED WITH FIXES
import { useQuery } from '@tanstack/react-query';
import { getConversationById } from '../../api/conversationApi';

/**
 * useConversationById
 * Fetches a single conversation with its messages
 * 
 * UPDATED: Added deleted property handling
 * 
 * Usage:
 * const { conversation, messages, isLoading } = useConversationById(conversationId);
 */
export const useConversationById = (conversationId, options = {}) => {
  const { messagePage = 1, messageLimit = 50 } = options;

  const query = useQuery({
    queryKey: ['conversation', conversationId, { messagePage, messageLimit }],
    queryFn: () =>
      getConversationById(conversationId, { messagePage, messageLimit }),
    enabled: !!conversationId, // Only fetch when ID exists
    select: (data) => {
      const conv = data?.data?.conversation || data?.data || {};
      return normalizeConversationDetail(conv);
    },
    staleTime: 1000 * 15, // 15 seconds
    gcTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 15, // Poll every 15 seconds for new messages
    refetchIntervalInBackground: false,
    retry: 1,
  });

  return {
    conversation: query.data ?? null,
    messages: query.data?.messages ?? [],
    participant: query.data?.participant ?? null,
    property: query.data?.property ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// ─── Helper: Normalize conversation detail ───────────────────────────────────

const normalizeConversationDetail = (conv) => ({
  id: conv._id || conv.id,
  participant: {
    id: conv.otherParticipant?._id || conv.otherParticipant?.id || '',
    name:
      conv.otherParticipant?.name ||
      [conv.otherParticipant?.firstName, conv.otherParticipant?.lastName]
        .filter(Boolean)
        .join(' ') ||
      'Unknown',
    avatar: conv.otherParticipant?.avatar || conv.otherParticipant?.profileImage || null,
    isOnline: conv.otherParticipant?.isOnline || false,
    lastSeen: conv.otherParticipant?.lastSeen || null,
  },
  
  // ⭐ UPDATED: Handle deleted properties (same as tours/enquiries fix)
  property: (conv.property && conv.property !== null)
    ? {
        id: conv.property._id || conv.property.id,
        title: conv.property.title || 'Property',
        location: conv.property.location || conv.property.address || '',
        image: conv.property.images?.[0] || conv.property.image || null,
        purpose: conv.property.purpose || conv.property.listingType || 'sale',
      }
    : null, // ✅ Return null if property is deleted
  
  messages: (conv.messages || []).map(normalizeMessage),
  status: conv.status || 'active',
  subject: conv.subject || '',
  unreadCount: conv.unreadCount || 0,
});

const normalizeMessage = (msg) => ({
  id: msg._id || msg.id,
  content: msg.content || '',
  createdAt: msg.createdAt,
  isFromMe: msg.isFromCurrentUser || msg.isMine || false,
  senderId: msg.sender?._id || msg.sender?.id || msg.senderId || '',
  senderName: msg.sender?.name || '',
  isRead: msg.isRead || false,
  readAt: msg.readAt || null,
});

export default useConversationById;
