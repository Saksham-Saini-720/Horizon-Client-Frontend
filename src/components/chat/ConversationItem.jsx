
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const ConversationItem = memo(({ conversation, isLast = false }) => {
  const navigate = useNavigate();
  const {
    id, conversationId, threadId,
    participant, property,
    lastMessage, lastMessageAt,
    lastMessageIsFromMe, hasUnread, unreadCount,
  } = conversation;

  const formattedDate = formatDate(lastMessageAt);
  const avatarInitials = getInitials(participant?.name);

  return (
    <button
      onClick={() => navigate(`/chat/${conversationId || id}${threadId ? `?thread=${threadId}` : ''}`)}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 bg-white hover:bg-gray-50/70 active:bg-gray-100 transition-colors text-left ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`w-[52px] h-[52px] rounded-full overflow-hidden flex items-center justify-center ${
          hasUnread ? 'ring-2 ring-primary-light ring-offset-1' : ''
        }`}
          style={{ background: 'linear-gradient(135deg, #C96C38 0%, #E08050 100%)' }}
        >
          {participant?.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span className="text-white text-[17px] font-bold font-myriad leading-none">
              {avatarInitials}
            </span>
          )}
        </div>

        {/* Online dot */}
        {participant?.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">

        {/* Name + time row */}
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-[15px] font-myriad truncate pr-2 ${
            hasUnread ? 'font-bold text-primary' : 'font-semibold text-primary'
          }`}>
            {participant?.name || 'Unknown'}
          </span>
          <span className={`text-[11px] flex-shrink-0 font-myriad ${
            hasUnread ? 'text-primary-light font-semibold' : 'text-gray-400'
          }`}>
            {formattedDate}
          </span>
        </div>

        {/* Property tag */}
        {property && (
          <div className="flex items-center gap-1 mb-1">
            <svg className="w-3 h-3 text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[11px] text-secondary font-semibold font-myriad truncate">
              {property.title}
            </span>
          </div>
        )}

        {/* Last message + unread badge */}
        <div className="flex items-center justify-between gap-2">
          <p className={`text-[13px] truncate font-myriad flex-1 leading-snug ${
            hasUnread ? 'text-gray-700 font-medium' : 'text-gray-400'
          }`}>
            {lastMessageIsFromMe && (
              <span className="text-gray-400">You: </span>
            )}
            {lastMessage || 'No messages yet'}
          </p>

          {/* Unread badge — orange pill */}
          {hasUnread && (
            <span className="min-w-[20px] h-5 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0 px-1.5">
              <span className="text-white text-[10px] font-bold leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </div>

      </div>
    </button>
  );
});

ConversationItem.displayName = 'ConversationItem';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase()).join('');
}

export default ConversationItem;
