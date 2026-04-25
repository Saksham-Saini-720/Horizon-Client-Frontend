
import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useConversationById } from '../hooks/conversations/useConversationById';
import { useSendMessage } from '../hooks/conversations/useSendMessage';
import { useMarkAsRead } from '../hooks/conversations/useMarkAsRead';
import { selectOptimisticMessages } from '../store/slices/conversationSlice';
import PropertyBanner from '../components/chat/PropertyBanner';

const ConversationPage = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get('thread') || null;
  const messagesEndRef = useRef(null);
  const hasMarkedRead = useRef(false);
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const { messages, participant, property, isLoading, isError, error, refetch } =
    useConversationById(conversationId, { threadId });
  const { sendMsg, isSending } = useSendMessage(conversationId);
  const { markRead } = useMarkAsRead();
  const optimisticMessages = useSelector(selectOptimisticMessages(conversationId));

  useEffect(() => {
    if (conversationId && !hasMarkedRead.current && !isLoading) {
      markRead(conversationId);
      hasMarkedRead.current = true;
    }
  }, [conversationId, isLoading, markRead]);

  const allMessages = useCallback(() => {
    const optimisticIds = new Set(optimisticMessages.map(m => m.id));
    const serverMessages = messages.filter(m => !optimisticIds.has(m.id));
    return [...serverMessages, ...optimisticMessages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [messages, optimisticMessages])();

  const messageGroups = groupMessagesByDate(allMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    sendMsg(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [text, isSending, sendMsg]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const avatarInitials = getInitials(participant?.name || '');
  const canSend = !!text.trim() && !isSending;

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeaderSkeleton />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-primary-light rounded-full animate-spin" />
            <p className="text-[14px] text-gray-400 font-myriad">Loading messages…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeaderSkeleton />
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-[16px] font-bold text-primary mb-1 font-myriad">Couldn't load conversation</p>
          <p className="text-[14px] text-gray-400 text-center mb-5 font-myriad">
            {error?.message || 'Something went wrong'}
          </p>
          <button
            onClick={refetch}
            className="px-7 py-2.5 rounded-full bg-primary-light text-white text-[14px] font-semibold font-myriad shadow-md active:scale-95 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── Fixed Header ── */}
      <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden shadow-xl bg-gradient-to-br from-[#1a2550] to-secondary">

        {/* Glow orbs */}
        <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full pointer-events-none" style={{ backgroundColor: "#C96C38", opacity: 0.30, filter: "blur(64px)" }} />
        <div className="absolute top-6 right-12 w-28 h-28 rounded-full pointer-events-none" style={{ backgroundColor: "#C96C38", opacity: 0.18, filter: "blur(40px)" }} />
        <div className="absolute top-4 -left-10 w-40 h-40 rounded-full pointer-events-none" style={{ backgroundColor: "#C96C38", opacity: 0.10, filter: "blur(56px)" }} />

        {/* Decorative arc lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
          <svg className="w-full h-full" viewBox="0 0 400 100" fill="none" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="370" cy="10"  rx="180" ry="180" stroke="white" strokeWidth="0.8" />
            <ellipse cx="395" cy="35"  rx="140" ry="140" stroke="white" strokeWidth="0.6" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-3 px-3 pt-12 pb-3.5">

          {/* Back button */}
          <button
            onClick={() => navigate('/chat')}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C96C38 0%, #E08050 100%)' }}
            >
              {participant?.avatar ? (
                <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[14px] font-bold font-myriad leading-none">
                  {avatarInitials}
                </span>
              )}
            </div>
          </div>

          {/* Name + subtitle */}
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-white font-myriad truncate leading-tight">
              {participant?.name || 'Support'}
            </p>
            <p className="text-[11px] text-white/50 font-myriad leading-tight">
              Property Support
            </p>
          </div>

        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: '96px', paddingBottom: '80px' }}
      >

        {/* Property banner */}
        {property && (
          <div className="pt-3 pb-1">
            <PropertyBanner property={property} />
          </div>
        )}

        {/* Empty state */}
        {allMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-[14px] text-gray-400 font-myriad text-center">
              No messages yet. Say hello! 👋
            </p>
          </div>
        )}

        {/* Message groups */}
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-3 px-4">
              <span className="px-4 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] text-gray-400 font-myriad font-medium shadow-sm border border-gray-100">
                {group.date}
              </span>
            </div>

            {group.messages.map((msg, idx) => {
              const nextMsg = group.messages[idx + 1];
              const showTime = !nextMsg || nextMsg.isFromMe !== msg.isFromMe
                || isTimeDiffSignificant(msg.createdAt, nextMsg?.createdAt);
              const isFirst = idx === 0 || group.messages[idx - 1]?.isFromMe !== msg.isFromMe;
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  showTime={showTime}
                  isFirst={isFirst}
                />
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* ── Input bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-end gap-2">

          {/* Text field */}
          <div className="flex-1 flex items-end bg-gray-100 rounded-2xl px-3.5 py-2.5 min-h-[44px]">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 bg-transparent text-[15px] text-primary placeholder-gray-400 font-myriad resize-none outline-none leading-[1.4] max-h-[120px] overflow-y-auto"
              style={{ scrollbarWidth: 'none' }}
            />
          </div>

          {/* Send button — orange when active */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              canSend
                ? 'bg-primary-light shadow-md active:scale-95'
                : 'bg-gray-200'
            }`}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className={`w-5 h-5 ${canSend ? 'text-white' : 'text-gray-400'}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>

        </div>
      </div>

    </div>
  );
};

// ── MessageBubble ─────────────────────────────────────────────────────────────

const MessageBubble = ({ message, showTime, isFirst }) => {
  const { content, isFromMe, createdAt, isOptimistic } = message;
  const timeStr = formatTime(createdAt);

  if (isFromMe) {
    return (
      <div className="flex justify-end mb-1 px-3">
        <div className="max-w-[75%]" style={{ opacity: isOptimistic ? 0.7 : 1 }}>
          <div
            className="px-4 py-2.5 shadow-sm"
            style={{
              backgroundColor: '#2D368E',
              borderRadius: isFirst ? '18px 18px 4px 18px' : '18px 4px 4px 18px',
            }}
          >
            <p className="text-[15px] text-white font-myriad leading-[1.5] whitespace-pre-wrap">
              {content}
            </p>
          </div>
          {showTime && (
            <div className="flex justify-end mt-0.5 pr-0.5">
              <span className="text-[11px] text-gray-400 font-myriad">{timeStr}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-1 px-3">
      <div className="max-w-[75%]">
        <div
          className="px-4 py-2.5 shadow-sm"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: isFirst ? '18px 18px 18px 4px' : '4px 18px 18px 18px',
            border: '1px solid #f0f0f0',
          }}
        >
          <p className="text-[15px] text-primary font-myriad leading-[1.5] whitespace-pre-wrap">
            {content}
          </p>
        </div>
        {showTime && (
          <div className="mt-0.5 pl-0.5">
            <span className="text-[11px] text-gray-400 font-myriad">{timeStr}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Header Skeleton ───────────────────────────────────────────────────────────

const HeaderSkeleton = () => (
  <div className="fixed top-0 left-0 right-0 z-50 pt-12 pb-3.5 px-4 flex items-center gap-3 animate-pulse bg-gradient-to-br from-[#1a2550] to-secondary">
    <div className="w-9 h-9 rounded-full bg-white/20" />
    <div className="w-10 h-10 rounded-full bg-white/20" />
    <div className="flex-1">
      <div className="h-3.5 bg-white/20 rounded-full w-24 mb-1.5" />
      <div className="h-3 bg-white/20 rounded-full w-16" />
    </div>
  </div>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function groupMessagesByDate(messages = []) {
  const groups = [];
  let currentDate = null;
  let currentGroup = null;
  for (const msg of messages) {
    const msgDate = getDateLabel(msg.createdAt);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      currentGroup = { date: msgDate, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  }
  return groups;
}

function getDateLabel(dateStr) {
  if (!dateStr) return 'Today';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function isTimeDiffSignificant(date1, date2) {
  if (!date1 || !date2) return true;
  return Math.abs(new Date(date2) - new Date(date1)) > 1000 * 60 * 2;
}

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase()).join('');
}

export default ConversationPage;
