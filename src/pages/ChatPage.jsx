
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ConversationItem from '../components/chat/ConversationItem';
import { useConversations } from '../hooks/conversations/useConversations';
import { useUnreadCount } from '../hooks/conversations/useMarkAsRead';
import { selectUnreadCount } from '../store/slices/conversationSlice';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ConversationSkeleton = ({ isLast }) => (
  <div className={`flex items-center gap-3.5 px-4 py-4 animate-pulse ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-gray-100 flex-shrink-0" />
    <div className="flex-1">
      <div className="flex justify-between mb-2">
        <div className="h-3.5 bg-gray-100 rounded-full w-28" />
        <div className="h-3 bg-gray-100 rounded-full w-10" />
      </div>
      <div className="h-3 bg-gray-100 rounded-full w-36 mb-1.5" />
      <div className="h-3 bg-gray-100 rounded-full w-52" />
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ query }) => (
  <div className="flex flex-col items-center justify-center py-24 px-6">
    <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-5">
      <svg className="w-9 h-9 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
    <p className="text-[17px] font-bold text-primary font-myriad mb-1.5">
      {query ? 'No results found' : 'No messages yet'}
    </p>
    <p className="text-[14px] text-gray-400 text-center font-myriad leading-relaxed max-w-xs">
      {query
        ? `No conversations match "${query}"`
        : 'Inquire about a property to start a conversation with an agent'}
    </p>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6">
    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <p className="text-[16px] font-bold text-primary mb-1 font-myriad">Couldn't load messages</p>
    <p className="text-[14px] text-gray-400 mb-5 font-myriad text-center">{error?.message || 'Something went wrong'}</p>
    <button
      onClick={onRetry}
      className="px-7 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold font-myriad shadow-md active:scale-95 transition-all"
    >
      Try Again
    </button>
  </div>
);

// ─── ChatPage ─────────────────────────────────────────────────────────────────

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
    <div className="min-h-screen flex flex-col bg-gray-50 pb-24">

      {/* ── Premium Header ── */}
      <div className="sticky top-0 z-50 overflow-hidden shadow-xl bg-gradient-to-br from-[#1a2550] to-secondary">

        {/* Glow orbs */}
        <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full pointer-events-none" style={{ backgroundColor: "#C96C38", opacity: 0.30, filter: "blur(64px)" }} />
        <div className="absolute top-6 right-12 w-28 h-28 rounded-full pointer-events-none" style={{ backgroundColor: "#C96C38", opacity: 0.18, filter: "blur(40px)" }} />
        <div className="absolute top-8 -left-10 w-40 h-40 rounded-full pointer-events-none" style={{ backgroundColor: "#C96C38", opacity: 0.10, filter: "blur(56px)" }} />

        {/* Decorative arc lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
          <svg className="w-full h-full" viewBox="0 0 400 160" fill="none" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="370" cy="20"  rx="200" ry="200" stroke="white" strokeWidth="0.8" />
            <ellipse cx="395" cy="50"  rx="155" ry="155" stroke="white" strokeWidth="0.6" />
          </svg>
        </div>

        {/* Title row */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold text-white font-myriad tracking-tight">
              Inbox
            </h1>
            {unreadCount > 0 && (
              <span className="bg-primary-light text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full font-myriad min-w-[22px] text-center leading-tight">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Decorative chat icon */}
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative z-10 px-4 pb-4">
          <div className="flex items-center gap-2.5 bg-white/10 rounded-2xl px-4 py-2.5 border border-white/10">
            <svg className="w-4 h-4 text-white/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/40 outline-none font-myriad"
            />
            {searchQuery.length > 0 && (
              <button onClick={() => { setSearchQuery(''); setDebouncedSearch(''); }} className="active:scale-90 transition-all">
                <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── Content ── */}
      <div className="flex-1">

        {isLoading ? (
          <div className="bg-white mt-4 mx-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {Array(6).fill(0).map((_, i) => (
              <ConversationSkeleton key={i} isLast={i === 5} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : conversations.length === 0 ? (
          <EmptyState query={debouncedSearch} />
        ) : (
          <div className="mt-5 px-4">
            {/* Section label */}
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest font-myriad mb-3 px-1">
              {debouncedSearch ? 'Search results' : 'All conversations'}
            </p>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
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

export default ChatPage;
