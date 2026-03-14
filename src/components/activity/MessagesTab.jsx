// src/components/activity/MessagesTab.jsx
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '../../hooks/conversations/useConversations';

const MessagesTab = memo(() => {
  const navigate = useNavigate();
  const { conversations, isLoading, isError, refetch } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-2 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-[16px] font-semibold text-gray-600 font-inter mb-3">Failed to load messages</p>
        <button onClick={refetch} className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold text-[14px]">
          Try Again
        </button>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h3 className="text-[20px] font-bold text-gray-600 font-inter mb-2">No Messages Yet</h3>
        <p className="text-[16px] text-gray-400 font-inter">Your message threads will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => navigate(`/chat/${conv.id}`)}  
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-md hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[20px] font-bold font-inter flex-shrink-0 overflow-hidden">
              {conv.participant?.avatar ? (
                <img src={conv.participant.avatar} alt={conv.participant.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span>{conv.participant?.name?.[0] || 'A'}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-black text-primary font-playfair mb-1">
                {conv.participant?.name || 'Agent'}
              </h3>
              {conv.property && (
                <p className="text-[12px] text-amber-600 font-[inter mb-1">
                  Re: {conv.property.title}
                </p>
              )}
              <p className="text-[12px] text-gray-700 font-inter line-clamp-2 leading-relaxed">
                {conv.lastMessageIsFromMe
                  ? `You: ${conv.lastMessage}`
                  : conv.lastMessage || 'No messages yet'}
              </p>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              {conv.hasUnread && (
                <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-[12px] font-bold">
                  {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                </span>
              )}
              <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

MessagesTab.displayName = 'MessagesTab';
export default MessagesTab;
