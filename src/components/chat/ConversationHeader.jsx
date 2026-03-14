
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ConversationHeader
 * Top header for individual conversation page
 * Shows back button, avatar, name, online status, action icons
 * Matches screenshot exactly
 */
const ConversationHeader = memo(({ participant, onCallPress, onVideoPress, onMorePress }) => {
  const navigate = useNavigate();

  const avatarInitials = getInitials(participant?.name || '');
  const avatarColor = getAvatarColor(participant?.name || '');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 px-4 pt-12 pb-3">
        {/* Back button */}
        <button
          onClick={() => navigate('/chat')}
          className="p-1 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: participant?.avatar ? 'transparent' : avatarColor }}
          >
            {participant?.avatar ? (
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-white text-[14px] font-black font-playfair">
                {avatarInitials}
              </span>
            )}
          </div>

          {/* Online indicator */}
          {participant?.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Name & Status */}
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-black text-primary font-playfair truncate">
            {participant?.name || 'Unknown'}
          </p>
          <p className="text-[12px] font-inter text-gray-500">
            {participant?.isOnline ? (
              <span className="text-green-500 font-medium">Active now</span>
            ) : participant?.lastSeen ? (
              `Last seen ${formatLastSeen(participant.lastSeen)}`
            ) : (
              'Offline'
            )}
          </p>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          {/* <button
            onClick={onCallPress}
            className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16a2 2 0 0 1 .29.92z" />
            </svg>
          </button>

          <button
            onClick={onVideoPress}
            className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button> */}

          <button
            onClick={onMorePress}
            className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

ConversationHeader.displayName = 'ConversationHeader';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');
}

const AVATAR_COLORS = [
  '#1C2A3A', '#2E4057', '#3D6B8A', '#5B8DB8',
  '#7B5EA7', '#A06B9A', '#C97B6E', '#D4956A',
];

function getAvatarColor(name = '') {
  const charCode = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
}

function formatLastSeen(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default ConversationHeader;
