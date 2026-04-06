
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ConversationItem from '../components/chat/ConversationItem';
import { useConversations } from '../hooks/conversations/useConversations';
import { useUnreadCount } from '../hooks/conversations/useMarkAsRead';
import { selectUnreadCount } from '../store/slices/conversationSlice';

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useUnreadCount();
  const unreadCount = useSelector(selectUnreadCount);

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(window._chatSearchTimeout);
    window._chatSearchTimeout = setTimeout(() => setDebouncedSearch(val), 300);
  }, []);

  const { conversations, isLoading, isError, error, refetch } = useConversations({
    search: debouncedSearch || undefined,
  });

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Header ── */}
      <div className="sticky top-0 z-50 bg-secondary">
        <div className="px-4 pb-4 bg-secondary">
          <div className="flex items-center justify-between mb-4">
            
            {unreadCount > 0 && (
              <span className="bg-secondary text-white text-[12px] font-semibold px-3 py-1 rounded-full font-myriad">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 bg-white/10 rounded-2xl px-4 py-2.5 ">
            <svg className="w-4 h-4 text-white/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-[15px] text-white placeholder-white/50 outline-none font-myriad"
            />
            {searchQuery.length > 0 && (
              <button onClick={() => { setSearchQuery(''); setDebouncedSearch(''); }}>
                <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* ── Content ── */}
      <div className="flex-1 pb-28">

        {isLoading ? (
          <div className="bg-white mt-2">
            {Array(6).fill(0).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-primary mb-2 font-myriad">Couldn't load messages</p>
            <p className="text-[15px] text-gray-400 mb-5 font-myriad">{error?.message}</p>
            <button onClick={refetch} className="px-6 py-2.5 bg-primary text-white rounded-xl text-[15px] font-semibold font-myriad">
              Try Again
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[17px] font-semibold text-primary mb-1 font-myriad">No messages yet</p>
            <p className="text-[15px] text-gray-400 text-center font-myriad">
              Inquire about a property to start a conversation
            </p>
          </div>
        ) : (
          <div className="mt-2">
            {/* Section label */}
            <div className="px-4 py-2">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest font-myriad">
                All conversations
              </p>
            </div>
            <div className="bg-white rounded-2xl mx-3 overflow-hidden shadow-sm">
              {conversations.map((conv, idx) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isLast={idx === conversations.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton
const ConversationSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"/>
    <div className="flex-1">
      <div className="flex justify-between mb-2">
        <div className="h-3.5 bg-gray-200 rounded-full w-28"/>
        <div className="h-3 bg-gray-200 rounded-full w-10"/>
      </div>
      <div className="h-3 bg-gray-200 rounded-full w-48"/>
    </div>
  </div>
);

export default ChatPage;
