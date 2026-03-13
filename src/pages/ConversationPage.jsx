// src/pages/ConversationPage.jsx
import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ConversationHeader from '../components/chat/ConversationHeader';
import PropertyBanner from '../components/chat/PropertyBanner';
import MessageBubble, { DateSeparator, groupMessagesByDate } from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import { useConversationById } from '../hooks/conversations/useConversationById';
import { useSendMessage } from '../hooks/conversations/useSendMessage';
import { useMarkAsRead } from '../hooks/conversations/useMarkAsRead';
import { selectOptimisticMessages } from '../store/slices/conversationSlice';

/**
 * ConversationPage
 * Individual chat conversation - /chat/:id
 * Shows messages with real-time-like polling + optimistic updates
 */
const ConversationPage = () => {
  const { id: conversationId } = useParams();
  const messagesEndRef = useRef(null);
  const hasMarkedRead = useRef(false);

  // Fetch conversation
  const { conversation, messages, participant, property, isLoading, isError, error, refetch } =
    useConversationById(conversationId);

  // Send message hook
  const { sendMsg, isSending } = useSendMessage(conversationId);

  // Mark as read
  const { markRead } = useMarkAsRead();

  // Optimistic messages from Redux
  const optimisticMessages = useSelector(selectOptimisticMessages(conversationId));

  // Mark as read when conversation opens
  useEffect(() => {
    if (conversationId && !hasMarkedRead.current && !isLoading) {
      markRead(conversationId);
      hasMarkedRead.current = true;
    }
  }, [conversationId, isLoading, markRead]);

  // Merge real messages with optimistic ones (avoid duplicates)
  const allMessages = useCallback(() => {
    const optimisticIds = new Set(optimisticMessages.map((m) => m.id));
    const serverMessages = messages.filter((m) => !optimisticIds.has(m.id));
    return [...serverMessages, ...optimisticMessages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [messages, optimisticMessages])();

  // Group messages by date
  const messageGroups = groupMessagesByDate(allMessages);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (allMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
        <ConversationHeaderSkeleton />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="mt-3 text-[13px] text-gray-400 font-['DM_Sans',sans-serif]">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
        <ConversationHeaderSkeleton />
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-[#1C2A3A] mb-1 font-['DM_Sans',sans-serif]">
            Couldn't load conversation
          </p>
          <p className="text-[13px] text-gray-400 text-center mb-5 font-['DM_Sans',sans-serif]">
            {error?.message || 'Something went wrong'}
          </p>
          <button
            onClick={refetch}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-white text-[14px] font-semibold font-['DM_Sans',sans-serif]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      {/* Fixed Header */}
      <ConversationHeader
        participant={participant}
        onCallPress={() => {}}
        onVideoPress={() => {}}
        onMorePress={() => {}}
      />

      {/* Scrollable content area */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: '88px', paddingBottom: '80px' }}
      >
        {/* Property Banner */}
        {property && (
          <div className="py-3">
            <PropertyBanner property={property} />
          </div>
        )}

        {/* Empty state */}
        {allMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[14px] text-gray-400 font-['DM_Sans',sans-serif] text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {/* Messages grouped by date */}
        {messageGroups.map((group) => (
          <div key={group.date}>
            <DateSeparator date={group.date} />
            {group.messages.map((msg, idx) => {
              const nextMsg = group.messages[idx + 1];
              // Only show time on last message in a consecutive group
              const showTime =
                !nextMsg ||
                nextMsg.isFromMe !== msg.isFromMe ||
                isTimeDiffSignificant(msg.createdAt, nextMsg.createdAt);

              return (
                <MessageBubble key={msg.id} message={msg} showTime={showTime} />
              );
            })}
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Fixed Message Input */}
      <MessageInput onSend={sendMsg} isSending={isSending} />
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isTimeDiffSignificant(date1, date2) {
  if (!date1 || !date2) return true;
  const diff = Math.abs(new Date(date2) - new Date(date1));
  return diff > 1000 * 60 * 2; // 2 minutes
}

// ─── Skeleton for loading header ────────────────────────────────────────────

const ConversationHeaderSkeleton = () => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 pt-12 pb-3 px-4 flex items-center gap-3 animate-pulse">
    <div className="w-6 h-6 bg-gray-200 rounded" />
    <div className="w-10 h-10 rounded-full bg-gray-200" />
    <div className="flex-1">
      <div className="h-3.5 bg-gray-200 rounded-full w-24 mb-1.5" />
      <div className="h-3 bg-gray-200 rounded-full w-16" />
    </div>
  </div>
);

export default ConversationPage;
