// src/components/property/ConfirmTourModal.jsx
import { memo, useState, useCallback } from 'react';
import TourSuccessModal from './TourSuccessModal';

/**
 * ConfirmTourModal Component
 * Step 2: Review and confirm tour details
 */
const ConfirmTourModal = memo(({ onClose, onBack, property, agent, visitType, selectedDate, selectedTimes, note }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle confirm
  const handleConfirm = useCallback(() => {
    setShowSuccess(true);
  }, []);

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

      {/* Modal */}
      <div className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
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
              {property?.img ? (
                <img src={property.img} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1 line-clamp-1">
                {property?.title || 'Elegant Townhouse in Woodlands'}
              </h3>
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
                  {property?.location || 'Woodlands, Lusaka'}
                </p>
              </div>
              <p className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                {property?.price || '$275,000'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Visit Type */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif]">
                Visit Type
              </span>
              <div className="flex items-center gap-2">
                {visitType === 'virtual' && (
                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                )}
                <span className="text-[14px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                  {visitType === 'virtual' ? 'Virtual Tour' : 'In Person'}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif]">
                Date
              </span>
              <span className="text-[14px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                2026-03-{selectedDate?.date.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Preferred Times */}
            <div className="flex items-start justify-between py-3">
              <span className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif]">
                Preferred Times
              </span>
              <div className="text-right">
                {selectedTimes.map((time, index) => (
                  <div key={index} className="text-[14px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[18px] font-bold font-['DM_Sans',sans-serif]">
              {agent?.name?.charAt(0) || 'G'}
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                {agent?.name || 'Grace Tembo'}
              </p>
              <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
                Will confirm your slot
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Back Button - Yellow on hover */}
            <button
              onClick={onBack}
              className="flex-1 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-[#1C2A3A] text-[16px] font-bold font-['DM_Sans',sans-serif] hover:bg-amber-400 hover:border-amber-400 transition-all"
            >
              Back
            </button>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-4 rounded-2xl bg-[#1C2A3A] text-white text-[16px] font-bold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] transition-all shadow-lg"
            >
              Confirm Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

ConfirmTourModal.displayName = 'ConfirmTourModal';

export default ConfirmTourModal;
