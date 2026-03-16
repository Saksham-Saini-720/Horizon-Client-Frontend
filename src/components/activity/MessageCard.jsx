
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const MessageCard = memo(({ message }) => {
  const navigate = useNavigate();
  const { agent, property, lastMessage, isFromAgent, timestamp } = message;

  const handleMessageClick = useCallback(() => {
    //  Use conversationId + threadId for correct thread navigation
    const convId   = message.conversationId || message.id;
    const threadId = message.threadId;
    const url = `/chat/${convId}${threadId ? `?thread=${threadId}` : ''}`;
    navigate(url);
  }, [message.conversationId, message.threadId, message.id, navigate]);

  return (
    <div
      onClick={handleMessageClick}
      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-md hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center text-white text-[18px] font-bold font-inter flex-shrink-0 overflow-hidden">
          {agent?.avatar ? (
            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover rounded-full"/>
          ) : (
            <span>{agent?.name?.[0] || 'A'}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-primary font-inter mb-1">
            {agent?.name}
          </h3>
          {property?.title && (
            <p className="text-[11px] text-secondary font-inter mb-1">
              Re: {property.title}
            </p>
          )}
          <p className="text-[12px] text-gray-600 font-inter line-clamp-2 leading-relaxed">
            {isFromAgent ? lastMessage : `You: ${lastMessage}`}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <p className="text-[11px] text-gray-400 font-inter">{timestamp}</p>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>
  );
});

MessageCard.displayName = 'MessageCard';
export default MessageCard;
