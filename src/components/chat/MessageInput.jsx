
import { memo, useState, useCallback, useRef } from 'react';

/**
 * MessageInput
 * Bottom input bar for typing and sending messages
 * Matches screenshot - paperclip, text input, emoji, send button
 */
const MessageInput = memo(({ onSend, isSending = false, disabled = false }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;
    onSend(trimmed);
    setText('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, isSending, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
    // Auto-resize textarea
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const canSend = text.trim().length > 0 && !isSending && !disabled;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-3 py-3">
      <div className="flex items-end gap-2 max-w-md mx-auto">
        {/* Attachment button */}
        <button
          className="p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0 mb-0.5"
          onClick={() => {/* TODO: file attachment */}}
          disabled={disabled}
        >
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Text input */}
        <div className="flex-1 flex items-end bg-gray-100 rounded-2xl px-3.5 py-2.5 min-h-[44px]">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-[14px] text-[#1C2A3A] placeholder-gray-400 font-['DM_Sans',sans-serif] resize-none outline-none leading-[1.4] max-h-[120px] overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          />
          {/* Emoji button */}
          <button
            className="ml-1.5 flex-shrink-0 mb-0.5 hover:opacity-75 transition-opacity"
            onClick={() => {/* TODO: emoji picker */}}
            disabled={disabled}
          >
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 13s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </button>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            canSend
              ? 'bg-[#1C2A3A] hover:bg-[#2E4057] active:scale-95 shadow-md'
              : 'bg-gray-200'
          }`}
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className={`w-5 h-5 ${canSend ? 'text-white' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
