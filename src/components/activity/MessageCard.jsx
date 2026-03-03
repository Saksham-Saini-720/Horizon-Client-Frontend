
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * MessageCard Component
 * Displays individual message thread
 */
const MessageCard = memo(({ message }) => {
  const navigate = useNavigate();
  const { agent, property, lastMessage, isFromAgent, timestamp } = message;

  // Navigate to message thread (placeholder)
  const handleMessageClick = useCallback(() => {
    // In real app, navigate to message thread
    console.log('Open message thread', message.id);
  }, [message.id]);

  return (
    <div
      onClick={handleMessageClick}
      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-md hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Agent Photo */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[18px] font-bold font-['DM_Sans',sans-serif] flex-shrink-0">
          {agent.avatar ? (
            <img 
              src={agent.avatar }
              alt={agent.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{agent.name[0]}</span>
          )}

        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Agent Name */}
          <h3 className="text-[13px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
            {agent.name}
          </h3>

          {/* Property Title (Re:) */}
          <p className="text-[10px] text-amber-600 font-['DM_Sans',sans-serif] mb-1">
            Re: {property.title}
          </p>

          {/* Last Message */}
          <p className="text-[12px] text-gray-700 font-['DM_Sans',sans-serif] line-clamp-2 leading-relaxed">
            {isFromAgent ? lastMessage : `You: ${lastMessage}`}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          {/* Timestamp */}
          <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif]">
            {timestamp}
          </p>

          {/* Chevron */}
          <svg
            className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
});

MessageCard.displayName = 'MessageCard';

export default MessageCard;
