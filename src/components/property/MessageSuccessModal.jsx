
import { memo } from 'react';

/**
 * MessageSuccessModal Component
 * Full width, slides from bottom (same as form modal)
 */
const MessageSuccessModal = memo(({ agent }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-bold/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

      {/* Success Modal - Full width, slides from bottom */}
      <div className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-[22px] font-semibold text-primary font-inter">
            Send Message
          </h2>
        </div>

        {/* Success Content */}
        <div className="px-6 py-16 flex flex-col items-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6 animate-in zoom-in-95 duration-300">
            <svg
              className="w-10 h-10 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Success Text */}
          <h3 className="text-[24px] font-semibold text-primary text-center font-inter mb-3">
            Message Sent!
          </h3>

          <p className="text-[15px] text-gray-500 text-center font-inter">
            {agent?.name || 'Grace Tembo'} typically responds within 2 hours
          </p>
        </div>
      </div>
    </>
  );
});

MessageSuccessModal.displayName = 'MessageSuccessModal';

export default MessageSuccessModal;
