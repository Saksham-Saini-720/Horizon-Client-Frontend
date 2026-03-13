// src/hooks/conversations/useConversations.js - UPDATED WITH FIXES
import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../../api/conversationApi';

/**
 * useConversations
 * Fetches paginated list of conversations for the current user
 * 
 * UPDATED: 
 * - Added deleted property handling
 * - Better UX with placeholderData & keepPreviousData
 * 
 * Usage:
 * const { conversations, isLoading, isError, refetch } = useConversations();
 * const { conversations } = useConversations({ status: 'active', search: 'Sarah' });
 */
export const useConversations = (filters = {}) => {
  const { status, search, page = 1, limit = 20 } = filters;

  const query = useQuery({
    queryKey: ['conversations', { status, search, page, limit }],
    queryFn: () => getConversations({ status, search, page, limit }),
    select: (data) => {
      // Normalize API response
      const conversations = data?.data?.conversations || data?.data || [];
      const pagination = data?.data?.pagination || null;

      return {
        conversations: conversations.map(normalizeConversation),
        pagination,
        total: pagination?.total || conversations.length,
      };
    },
    
    // ⭐ UPDATED: Better UX
    placeholderData: { conversations: [], pagination: null, total: 0 }, // Show empty while loading
    keepPreviousData: true, // Keep old data while refetching
    
    staleTime: 1000 * 30, // 30 seconds (messages are time-sensitive)
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    retry: 1,
  });

  return {
    conversations: query.data?.conversations ?? [],
    pagination: query.data?.pagination ?? null,
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// ─── Helper: Normalize conversation from API ─────────────────────────────────

const normalizeConversation = (conv) => ({
  id: conv._id || conv.id,
  
  // Other participant (not current user)
  participant: {
    id: conv.otherParticipant?._id || conv.otherParticipant?.id || '',
    name: conv.otherParticipant?.name ||
      [conv.otherParticipant?.firstName, conv.otherParticipant?.lastName]
        .filter(Boolean)
        .join(' ') || 'Unknown',
    avatar: conv.otherParticipant?.avatar || conv.otherParticipant?.profileImage || null,
    isOnline: conv.otherParticipant?.isOnline || false,
  },
  
  // ⭐ UPDATED: Handle deleted properties (same as tours/enquiries fix)
  property: (conv.property && conv.property !== null)
    ? {
        id: conv.property._id || conv.property.id,
        title: conv.property.title || 'Property',
        location: conv.property.location || conv.property.address || '',
        image: conv.property.images?.[0] || conv.property.image || null,
      }
    : null, // ✅ Return null if property is deleted
  
  // Last message preview
  lastMessage: conv.lastMessage?.content || '',
  lastMessageAt: conv.lastMessage?.createdAt || conv.updatedAt,
  lastMessageIsFromMe: conv.lastMessage?.isFromCurrentUser || false,
  
  // Unread
  unreadCount: conv.unreadCount || 0,
  hasUnread: (conv.unreadCount || 0) > 0,
  
  // Status
  status: conv.status || 'active',
  subject: conv.subject || '',
});

export default useConversations;
