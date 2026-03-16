
import { memo } from 'react';

/**
 * MessageBubble
 * Single message - sent (dark navy, right) or received (white, left)
 * Matches screenshot UI with timestamps and read ticks
 */
const MessageBubble = memo(({ message, showTime = true }) => {
  const { content, isFromMe, createdAt, isRead, isOptimistic } = message;

  const timeStr = formatTime(createdAt);

  if (isFromMe) {
    // Sent message - right side, dark navy
    return (
      <div className="flex justify-end mb-1.5 px-4">
        <div
          className="max-w-[75%] relative"
          style={{ opacity: isOptimistic ? 0.75 : 1 }}
        >
          <div
            className="px-4 py-2.5 rounded-[18px] rounded-tr-[4px]"
            style={{ backgroundColor: '#1C2A3A' }}
          >
            <p className="text-[15px] text-white font-inter leading-[1.4]">
              {content}
            </p>
          </div>
          {showTime && (
            <div className="flex items-center justify-end gap-1 mt-0.5 pr-0.5">
              <span className="text-[12px] text-gray-400 font-inter">
                {timeStr}
              </span>
              {/* Read tick marks */}
              {isOptimistic ? (
                // Single grey tick - sending
                <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : isRead ? (
                // Double tick - read
                <DoubleCheckIcon color="#F5B731" />
              ) : (
                // Double tick - delivered (grey)
                <DoubleCheckIcon color="#9CA3AF" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Received message - left side, white
  return (
    <div className="flex justify-start mb-1.5 px-4">
      <div className="max-w-[75%]">
        <div className="px-4 py-2.5 rounded-[18px] rounded-tl-[4px] bg-white shadow-sm border border-gray-100">
          <p className="text-[15px] text-primary font-inter leading-[1.4]">
            {content}
          </p>
        </div>
        {showTime && (
          <div className="mt-0.5 pl-0.5">
            <span className="text-[11px] text-gray-400 font-inter">
              {timeStr}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ─── Date Separator ──────────────────────────────────────────────────────────

export const DateSeparator = memo(({ date }) => (
  <div className="flex items-center justify-center py-3 px-4">
    <div className="px-4 py-1 bg-gray-200 rounded-full">
      <span className="text-[12px] text-gray-500 font-inter font-medium">
        {date}
      </span>
    </div>
  </div>
));

DateSeparator.displayName = 'DateSeparator';

// ─── Double Check SVG ────────────────────────────────────────────────────────

const DoubleCheckIcon = ({ color = '#9CA3AF' }) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
    <polyline points="1,6 5,10 11,2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="6,6 10,10 16,2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Groups messages by date, returns array of { date, messages[] }
 * Used by ConversationPage to render date separators
 */
export function groupMessagesByDate(messages = []) {
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

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default MessageBubble;
