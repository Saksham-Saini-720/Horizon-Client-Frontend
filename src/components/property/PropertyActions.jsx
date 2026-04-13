
import { memo, useCallback, useState } from 'react';
import SendMessageModal from './SendMessageModal';
import RequestTourModal from './RequestTourModal';

/**
 * ActionButton Component
 */
const ActionButton = memo(({ icon, label, onClick, primary = false, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex max-w-40 items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-[15px] font-myriad transition-all active:scale-95 ${
      primary
        ? 'bg-secondary text-white shadow-lg hover:bg-secondary/90'
        : variant === 'yellow'
        ? 'bg-white text-primary border border-gray-200 hover:bg-secondary hover:border-secondary hover:text-white'
        : 'bg-white text-primary border border-gray-200 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
));

ActionButton.displayName = 'ActionButton';

/**
 * PropertyActions Component
 * Fixed action buttons at bottom with all modals
 */
const PropertyActions = memo(({ agent, property }) => {
  // const [showContactModal, setShowContactModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  // Handle call - opens contact modal
  // const handleCall = useCallback(() => {
  //   setShowContactModal(true);
  // }, []);

  // Handle message - opens message modal
  const handleMessage = useCallback(() => {
    setShowMessageModal(true);
  }, []);

  // Handle tour - opens tour modal
  const handleTour = useCallback(() => {
    setShowTourModal(true);
  }, []);

  return (
    <>
      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-center gap-3 z-40 shadow-lg">        

        {/* Message */}
        <ActionButton
          icon={
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          label="Enquiry"
          onClick={handleMessage}
          variant="yellow"
        />

        {/* Tour */}
        <ActionButton
          icon={
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          label="Tour"
          onClick={handleTour}
          primary
        />
      </div>

      {/* Contact Agent Modal
      <ContactAgentModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        agent={agent}
        property={property}
      /> */}

      {/* Send Message Modal */}
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
