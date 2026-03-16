
import { memo, useState, useCallback } from 'react';
import { useSubmitTourRequest } from '../../hooks/tours/useSubmitTourRequest';
import TourSuccessModal from './TourSuccessModal';

/**
 * ConfirmTourModal Component
 * Step 2: Review and confirm tour details
 * FIXED: Sends correct format to match backend API
 */
const ConfirmTourModal = memo(({ onClose, onBack, property, agent, visitType, selectedDate, selectedTimes, note }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const submitMutation = useSubmitTourRequest();

  // Handle confirm - NOW WITH CORRECT API FORMAT
  const handleConfirm = useCallback(async () => {
    // Format date as YYYY-MM-DD
    const year = selectedDate.fullDate.getFullYear();
    const month = String(selectedDate.fullDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.fullDate.getDate()).padStart(2, '0');
    const preferredDate = `${year}-${month}-${day}`;

    // Send FIRST selected time as preferredTime (API expects single time)
    const preferredTime = selectedTimes[0]; // e.g., "10:00"

    // Submit tour request
    submitMutation.mutate(
      {
        propertyId: property.id,
        preferredDate: preferredDate, // "2026-03-15"
        preferredTime: preferredTime, // "10:00"
        preferredTimes: selectedTimes, // Keep all selected times for frontend display
        numberOfPeople: 1, // Default to 1, can be made configurable later
        message: note || '',
        visitType: visitType, // Keep in frontend state (not sent to API)
        property: {
          id: property.id,
          title: property.title,
          location: property.location,
          img: property.images?.[0] || property.img,
          price: property.price,
        },
        agent: agent,
      },
      {
        onSuccess: () => {
          // Show success modal after API success
          setShowSuccess(true);
        },
        // Error is handled by the hook (toast)
      }
    );
  }, [selectedDate, selectedTimes, visitType, note, property, agent, submitMutation]);

  if (showSuccess) {
    return (
      <TourSuccessModal
        onClose={onClose}
        property={property}
        agent={agent}
        visitType={visitType}
        selectedTimes={selectedTimes}
      />
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-bold/50 backdrop-blur-sm z-40
          transition-opacity duration-200
          opacity-100
        `}
      />

      {/* Modal */}
      <div className={`
        fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50
        max-h-[90vh] overflow-y-auto
        transform transition-transform duration-300 ease-out
        translate-y-0
      `}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-semibold text-primary font-inter">
              Confirm Tour
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

        <div className="px-6 py-6 space-y-6">
          {/* Property Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {(property?.images?.[0] || property?.img) ? (
                <img 
                  src={property?.images?.[0] || property?.img} 
                  alt={property.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-semibold text-primary font-inter mb-1 line-clamp-1">
                {property?.title || 'Property'}
              </h3>
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-[12px] text-gray-500 font-inter">
                  {property?.location || 'Location'}
                </p>
              </div>
              <p className="text-[16px] font-semibold text-primary font-inter">
                {property?.price || 'Price'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Visit Type */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[15px] text-gray-500 font-inter">
                Visit Type
              </span>
              <div className="flex items-center gap-2">
                {visitType === 'virtual' && (
                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                )}
                <span className="text-[15px] font-semibold text-primary font-inter">
                  {visitType === 'virtual' ? 'Virtual Tour' : 'In Person'}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[15px] text-gray-500 font-inter">
                Date
              </span>
              <span className="text-[15px] font-semibold text-primary font-inter">
                {selectedDate.fullDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {/* Preferred Times */}
            <div className="flex items-start justify-between py-3">
              <span className="text-[15px] text-gray-500 font-inter">
                Preferred Times
              </span>
              <div className="text-right">
                {selectedTimes.map((time, index) => (
                  <div key={index} className="text-[15px] font-semibold text-primary font-inter flex items-center gap-1.5 justify-end">
                    {index === 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        Primary
                      </span>
                    )}
                    {time}
                  </div>
                ))}
                {selectedTimes.length > 1 && (
                  <p className="text-[11px] text-gray-400 font-inter mt-1">
                    Agent will confirm one slot
                  </p>
                )}
              </div>
            </div>

            {/* Note (if provided) */}
            {note && (
              <div className="py-3 border-t border-gray-100">
                <span className="text-[15px] text-gray-500 font-inter block mb-2">
                  Note for Agent
                </span>
                <p className="text-[15px] text-gray-700 font-inter leading-relaxed p-3 bg-gray-50 rounded-lg">
                  {note}
                </p>
              </div>
            )}
          </div>

          {/* Agent Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            {agent?.avatar ? (
              <img 
                src={agent.avatar} 
                alt={agent.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center text-white text-[18px] font-semibold font-inter">
                {agent?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <p className="text-[15px] font-semibold text-primary font-inter">
                {agent?.name || 'Agent'}
              </p>
              <p className="text-[12px] text-gray-500 font-inter">
                Will confirm your slot
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Back Button */}
            <button
              onClick={onBack}
              disabled={submitMutation.isPending}
              className="flex-1 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-primary text-[16px] font-semibold font-inter hover:bg-secondary hover:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={submitMutation.isPending}
              className="flex-1 px-6 py-4 rounded-2xl bg-primary text-white text-[16px] font-semibold font-inter hover:bg-primary-light transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Confirm Request'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

ConfirmTourModal.displayName = 'ConfirmTourModal';

export default ConfirmTourModal;
