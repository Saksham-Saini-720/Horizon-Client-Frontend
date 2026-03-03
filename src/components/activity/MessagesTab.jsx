
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllMessages } from '../../store/slices/activitySlice';
import MessageCard from './MessageCard';

/**
 * MessagesTab Component
 * Lists all message threads from Redux
 */
const MessagesTab = memo(() => {
  // Get messages from Redux
  const messages = useSelector(selectAllMessages);

  // Show empty state if no messages
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h3 className="text-[18px] font-bold text-gray-600 font-['DM_Sans',sans-serif] mb-2">
          No Messages Yet
        </h3>
        <p className="text-[14px] text-gray-400 font-['DM_Sans',sans-serif]">
          Your message threads will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
});

MessagesTab.displayName = 'MessagesTab';

export default MessagesTab;
