
import { memo, useState, useEffect } from 'react';
import TourNotification from './TourNotification';

/**
 * TourSuccessModal Component
 * Step 3: Success confirmation screen
 */
const TourSuccessModal = memo(({ onClose, property, agent, visitType, selectedTimes }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
    

  // Show notification after modal appears
  useEffect(() => {
  // Slight delay so animation triggers properly
    const openTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const notifyTimer = setTimeout(() => {
      setShowNotification(true);
    }, 400);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(notifyTimer);
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40
          transition-opacity duration-200
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Modal */}
      <div className={`
        fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50
        transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-black text-primary font-playfair">
              Tour Requested
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Success Content */}
        <div className="px-6 py-12 flex flex-col items-center">
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
          <h3 className="text-[24px] font-bold text-primary text-center font-inter mb-3">
            Tour Request Sent!
          </h3>

          <p className="text-[14px] text-gray-500 text-center font-inter mb-8 max-w-sm">
            {agent?.name || 'Grace Tembo'} will review your preferred times and confirm shortly.
          </p>

          {/* Details */}
          <div className="w-full space-y-3 mb-8">
            {/* Time Slot */}
            <div className="flex items-center gap-3 text-[13px] text-gray-600 font-inter">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>
                {selectedTimes?.length || 1} time slot{selectedTimes?.length > 1 ? 's' : ''} proposed
              </span>
            </div>

            {/* Virtual Tour */}
            {visitType === 'virtual' && (
              <div className="flex items-center gap-3 text-[13px] text-gray-600 font-inter">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span>Virtual tour</span>
              </div>
            )}
          </div>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full max-w-xs px-8 py-4 rounded-2xl bg-primary text-white text-[16px] font-bold font-inter hover:bg-primary-light transition-all shadow-lg"
          >
            Done
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      <TourNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        agent={agent}
      />
    </>
  );
});

TourSuccessModal.displayName = 'TourSuccessModal';

export default TourSuccessModal;
