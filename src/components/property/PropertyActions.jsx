
import { memo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SendMessageModal from './SendMessageModal';
import RequestTourModal from './RequestTourModal';
import { needsEmailVerification } from '../../utils/roles';

const PropertyActions = memo(({ agent, property }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Tours and enquiries require a logged-in, email-verified client.
  const ensureCanContact = useCallback(() => {
    if (!user) {
      toast.error('Please log in to continue.');
      navigate('/login');
      return false;
    }
    // Admins/managers on the client portal skip the email-verification gate.
    if (needsEmailVerification(user)) {
      toast.error('Please verify your email before booking.');
      return false;
    }
    return true;
  }, [user, navigate]);

  const handleMessage = useCallback(() => {
    if (!ensureCanContact()) return;
    setShowMessageModal(true);
  }, [ensureCanContact]);

  const handleTour = useCallback(() => {
    if (!ensureCanContact()) return;
    setShowTourModal(true);
  }, [ensureCanContact]);

  return (
    <>
      {/*
        Fixed action bar — sits above the bottom nav (Footer ~72px tall).

        Deliberately no background, border or shadow. As an opaque white panel
        it read as a third stacked bar and its square bottom edge filled the
        notches beside the nav's rounded top corners, flattening that shape. The
        buttons carry their own elevation, so they float over the page instead.
        pointer-events are re-enabled per button so the transparent strip does
        not block the sheet behind it.
      */}
      <div
        className="fixed left-0 right-0 px-4 py-3 flex items-center gap-3 z-50 pointer-events-none [&>*]:pointer-events-auto"
        // Was bottom-[80px], a guess at the nav's height. On any device with a
        // home-indicator inset the nav is taller than that, so this bar sank
        // into it. Positioned against the nav's actual height now.
        style={{ bottom: 'var(--nav-h)' }}
      >

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
