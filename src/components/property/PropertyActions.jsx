
import { memo, useCallback, useState } from 'react';
import SendMessageModal from './SendMessageModal';
import RequestTourModal from './RequestTourModal';

const PropertyActions = memo(({ agent, property }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  const handleMessage = useCallback(() => {
    setShowMessageModal(true);
  }, []);

  const handleTour = useCallback(() => {
    setShowTourModal(true);
  }, []);

  return (
    <>
      {/* Fixed action bar — sits above the bottom nav (Footer ~72px tall) */}
      <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">

        {/* "Schedule a tour →" primary orange button */}
        <button
          onClick={handleTour}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-light rounded-full text-white text-[15px] font-semibold font-myriad transition-all active:scale-[0.98] shadow-md"
        >
          Schedule a tour
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Enquiry chat button — white circle with speech bubble icon */}
        <button
          onClick={handleMessage}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0 active:scale-95 transition-all hover:bg-gray-50"
          title="Send enquiry"
        >
          <svg
            className="w-5 h-5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

      </div>

      {/* Send Enquiry Modal */}
      <SendMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        agent={agent}
        property={property}
      />

      {/* Request Tour Modal */}
      <RequestTourModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        property={property}
        agent={agent}
      />
    </>
  );
});

PropertyActions.displayName = 'PropertyActions';
export default PropertyActions;
