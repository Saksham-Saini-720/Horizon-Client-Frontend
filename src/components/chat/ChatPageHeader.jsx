
import { memo } from 'react';

/**
 * ChatPageHeader
 * Top header for the Messages list page
 * Shows "Messages" title and unread count badge
 */
const ChatPageHeader = memo(({ unreadCount = 0 }) => {
  return (
    <div className="px-4 pt-12 pb-4 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
          Messages
        </h1>
        {unreadCount > 0 && (
          <span className="text-[13px] font-semibold text-amber-500 font-['DM_Sans',sans-serif]">
            {unreadCount} unread
          </span>
        )}
      </div>
    </div>
  );
});

ChatPageHeader.displayName = 'ChatPageHeader';

export default ChatPageHeader;
