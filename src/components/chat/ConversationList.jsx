
import { memo } from 'react';
import ConversationItem from './ConversationItem';

/**
 * ConversationList
 * Renders the list of conversations or skeleton/empty/error state
 */
const ConversationList = memo(({ conversations, isLoading, isError, error, onRetry }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {Array(5).fill(0).map((_, i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-[16px] font-semibold text-primary mb-1 font-inter">
          Couldn't load messages
        </p>
        <p className="text-[15px] text-gray-400 text-center mb-4 font-inter">
          {error?.message || 'Something went wrong'}
        </p>
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-xl bg-secondary text-white text-[15px] font-semibold font-inter"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[16px] font-semibold text-primary mb-1 font-inter">
          No messages yet
        </p>
        <p className="text-[15px] text-gray-400 text-center font-inter">
          Start a conversation by inquiring about a property
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm">
      {conversations.map((conv) => (
        <ConversationItem key={conv.id} conversation={conv} />
      ))}
    </div>
  );
});

ConversationList.displayName = 'ConversationList';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ConversationSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-gray-100 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1">
      <div className="flex justify-between mb-2">
        <div className="h-3.5 bg-gray-200 rounded-full w-28" />
        <div className="h-3 bg-gray-200 rounded-full w-10" />
      </div>
      <div className="h-3 bg-gray-200 rounded-full w-36 mb-1.5" />
      <div className="h-3 bg-gray-200 rounded-full w-48" />
    </div>
  </div>
);

export default ConversationList;
