
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelTourModal from '../tours/CancelTourModal';
import RescheduleTourModal from '../tours/RescheduleTourModal';
import DeleteTourModal from '../tours/DeleteTourModal';

/**
 * TourCard Component
 * Displays individual tour with confirmed/pending/cancelled status
 * NOW WITH CANCELLED UI + DELETE OPTION
 */
const TourCard = memo(({ tour }) => {
  const navigate = useNavigate();
  const { property, status, visitType, date, time, agent, proposedTimes } = tour;

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if cancelled
  const isCancelled = status === 'cancelled';

  // Status banner config
  const statusConfig = {
    'confirmed': {
      label: 'Confirmed',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600'
    },
    'pending': {
      label: 'Pending',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-secondary'
    },
    'cancelled': {
      label: 'Cancelled',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      color: 'bg-gray-100 border-gray-300',
      textColor: 'text-gray-600'
    }
  };

  // Visit type config
  const visitTypeConfig = {
    'in-person': {
      label: 'In Person',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    'virtual': {
      label: 'Virtual',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      )
    }
  };

  const currentStatus = statusConfig[status];
  const currentVisitType = visitTypeConfig[visitType];

  // Navigate to property details
  const handlePropertyClick = useCallback(() => {
    navigate(`/property/${property.id}`);
  }, [navigate, property.id]);

  return (
    <>
      <div className={`bg-white rounded-2xl border overflow-hidden shadow-md transition-all ${
        isCancelled 
          ? 'opacity-75 border-gray-200 hover:shadow-md' 
          : 'border-gray-100 hover:shadow-lg'
      }`}>
        {/* Status Banner */}
        <div className={`px-5 py-2 border-b ${currentStatus?.color} flex items-center justify-between`}>
          <div className={`flex items-center gap-2 ${currentStatus?.textColor}`}>
            {currentStatus?.icon}
            <span className="text-[12px] font-semibold font-inter">
              {currentStatus?.label}
            </span>
            {isCancelled && (
              <span className="text-[10px] font-medium text-gray-500 font-inter">
                • Request no longer active
              </span>
            )}
          </div>

          <div className={`flex items-center gap-2 ${currentStatus?.textColor}`}>
            {currentVisitType?.icon}
            <span className="text-[12px] font-semibold font-inter">
              {currentVisitType?.label}
            </span>
          </div>
        </div>

        {/* Property Info */}
        <div
          onClick={handlePropertyClick}
          className={`flex items-center gap-4 p-5 cursor-pointer transition-colors ${
            isCancelled ? 'hover:bg-gray-50' : 'hover:bg-gray-50'
          }`}
        >
          {/* Property Image */}
          <div className={`w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 ${
            isCancelled ? 'opacity-60 grayscale' : ''
          }`}>
            <img
              src={property.img}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Property Details */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-[15px] font-inter mb-1 line-clamp-1 ${
              isCancelled 
                ? 'text-gray-500 line-through' 
                : 'text-primary font-semibold'
            }`}>
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-[12px] text-gray-500 font-inter">
                {property.location}
              </p>
            </div>
          </div>
        </div>

        {/* Date/Time or Proposed Times or Cancelled Info */}
        {isCancelled ? (
          <div className="mx-5 mb-5 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-gray-500 font-inter line-through">
                {date || 'Tour Request'}
              </p>
              <p className="text-[12px] text-gray-400 font-inter">
                This tour was cancelled
              </p>
            </div>
          </div>
        ) : status === 'confirmed' ? (
          <div className="mx-5 mb-5 px-4 py-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-primary font-inter">
                {date}
              </p>
              <p className="text-[12px] text-gray-600 font-inter">
                at {time}
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-5 mb-5">
            <p className="text-[12px] text-gray-500 font-inter mb-2">
              Proposed times:
            </p>
            <div className="flex flex-wrap gap-2">
              {proposedTimes?.map((time, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 text-[12px] font-medium text-secondary font-inter"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Agent Info & Actions */}
        <div className={`px-4 py-3 border-t ${
          isCancelled ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-100'
        }`}>
          {/* Agent Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Agent Photo */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center text-white text-[16px] font-semibold font-inter ${
                isCancelled ? 'opacity-50 grayscale' : ''
              }`}>
                {agent.avatar ? (
                  <img 
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{agent.name.charAt(0)}</span>
                )}
              </div>

              {/* Agent Name */}
              <p className={`text-[12px] font-semibold font-inter ${
                isCancelled ? 'text-gray-400' : 'text-primary'
              }`}>
                {agent.name}
              </p>
            </div>

            {/* Contact Button - Always visible */}
            {!isCancelled && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg
                  className="w-4 h-4 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="text-[15px] font-semibold text-gray-700 font-inter">
                  Contact
                </span>
              </button>
            )}
          </div>

          {/* Action Buttons - Different for cancelled vs active */}
          {
          // isCancelled ? (
          //   // Cancelled tour - only show delete button
          //   <button
          //     onClick={() => setShowDeleteModal(true)}
          //     className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-[15px] font-semibold text-gray-700 font-inter hover:bg-gray-50 hover:border-red-400 hover:text-red-600 transition-all flex items-center justify-center gap-2"
          //   >
          //     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          //       <polyline points="3 6 5 6 21 6" />
          //       <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          //     </svg>
          //     Remove from List
          //   </button>
          // ) : 
          (
            // Active tour - show reschedule and cancel
            <div className="flex gap-2">
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-700 font-[inter hover:bg-white hover:border-secondary hover:text-secondary transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Reschedule
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-700 font-inter hover:bg-white hover:border-red-500 hover:text-red-600 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {!isCancelled && (
        <>
          <CancelTourModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            tour={tour}
          />
          <RescheduleTourModal
            isOpen={showRescheduleModal}
            onClose={() => setShowRescheduleModal(false)}
            tour={tour}
          />
        </>
      )}
      
      {/* <DeleteTourModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        tour={tour}
      /> */}
    </>
  );
});

TourCard.displayName = 'TourCard';

export default TourCard;
