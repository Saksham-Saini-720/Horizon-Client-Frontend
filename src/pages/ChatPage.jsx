// src/pages/ChatPage.jsx
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ChatPageHeader from '../components/chat/ChatPageHeader';
import ConversationList from '../components/chat/ConversationList';
import { useConversations } from '../hooks/conversations/useConversations';
import { useUnreadCount } from '../hooks/conversations/useMarkAsRead';
import { selectUnreadCount } from '../store/slices/conversationSlice';

/**
 * ChatPage
 * Messages list page - /chat
 * Shows all conversations with search
 */
const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Sync unread count to Redux
  useUnreadCount();

  const unreadCount = useSelector(selectUnreadCount);

  // Debounce search input
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchQuery(val);

    // Simple debounce
    clearTimeout(window._chatSearchTimeout);
    window._chatSearchTimeout = setTimeout(() => {
      setDebouncedSearch(val);
    }, 300);
  }, []);

  const { conversations, isLoading, isError, error, refetch } = useConversations({
    search: debouncedSearch || undefined,
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      {/* Header */}
      <ChatPageHeader unreadCount={unreadCount} />

      {/* Search */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center gap-2.5 bg-gray-100 rounded-2xl px-4 py-2.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-[14px] text-[#1C2A3A] placeholder-gray-400 outline-none font-['DM_Sans',sans-serif]"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => { setSearchQuery(''); setDebouncedSearch(''); }}
              className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Conversations */}
      <div className="px-4 pt-4 pb-28">
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
        />
      </div>
    </div>
  );
};

export default ChatPage;
