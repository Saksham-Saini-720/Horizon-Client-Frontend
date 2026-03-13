// src/components/chat/ConversationItem.jsx
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ConversationItem
 * Single conversation row in the messages list
 * Matches screenshot UI exactly
 */
const ConversationItem = memo(({ conversation }) => {
  const navigate = useNavigate();

  const {
    id,
    participant,
    property,
    lastMessage,
    lastMessageAt,
    lastMessageIsFromMe,
    hasUnread,
    unreadCount,
  } = conversation;

  const formattedDate = formatDate(lastMessageAt);
  const avatarInitials = getInitials(participant?.name);
  const avatarColor = getAvatarColor(participant?.name);

  return (
    <button
      onClick={() => navigate(`/chat/${id}`)}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-0"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: participant?.avatar ? 'transparent' : avatarColor }}
        >
          {participant?.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-white text-[16px] font-bold">${avatarInitials}</span>`;
              }}
            />
          ) : (
            <span className="text-white text-[16px] font-bold font-['DM_Sans',sans-serif]">
              {avatarInitials}
            </span>
          )}
        </div>

        {/* Unread dot */}
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
            {unreadCount <= 9 ? (
              <span className="text-white text-[9px] font-bold leading-none">
                {unreadCount}
              </span>
            ) : (
              <span className="text-white text-[8px] font-bold leading-none">9+</span>
            )}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + Date row */}
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-[15px] font-['DM_Sans',sans-serif] truncate ${
              hasUnread
                ? 'font-bold text-[#1C2A3A]'
                : 'font-semibold text-[#1C2A3A]'
            }`}
          >
            {participant?.name || 'Unknown'}
          </span>
          <span className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif] ml-2 flex-shrink-0">
            {formattedDate}
          </span>
        </div>

        {/* Property name */}
        {property && (
          <div className="flex items-center gap-1 mb-0.5">
            <svg
              className="w-3 h-3 text-gray-400 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif] truncate">
              {property.title}
            </span>
          </div>
        )}

        {/* Last message preview */}
        <p
          className={`text-[13px] truncate font-['DM_Sans',sans-serif] ${
            hasUnread ? 'text-[#1C2A3A] font-medium' : 'text-gray-500'
          }`}
        >
          {lastMessageIsFromMe && (
            <span className="text-gray-400">You: </span>
          )}
          {lastMessage || 'No messages yet'}
        </p>
      </div>
    </button>
  );
});

ConversationItem.displayName = 'ConversationItem';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today: show time
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

const AVATAR_COLORS = [
  '#1C2A3A', '#2E4057', '#3D6B8A', '#5B8DB8',
  '#7B5EA7', '#A06B9A', '#C97B6E', '#D4956A',
];

function getAvatarColor(name = '') {
  const charCode = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
}

export default ConversationItem;
