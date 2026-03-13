// src/components/tours/CancelTourModal.jsx
import { memo, useState } from 'react';
import { useCancelTour } from '../../hooks/tours/useTourActions';

/**
 * CancelTourModal Component
 * Modal for cancelling a tour with optional reason
 */
const CancelTourModal = memo(({ isOpen, onClose, tour }) => {
  const [reason, setReason] = useState('');
  const cancelMutation = useCancelTour();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    cancelMutation.mutate(
      { tourId: tour.id, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          onClose();
          setReason('');
        },
      }
    );
  };

  const handleClose = () => {
    if (!cancelMutation.isPending) {
      onClose();
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                  Cancel Tour Request
                </h2>
                <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
                  {tour?.property?.title}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={cancelMutation.isPending}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Warning Message */}
          <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="text-[13px] font-semibold text-amber-800 font-['DM_Sans',sans-serif] mb-1">
                  Are you sure?
                </p>
                <p className="text-[12px] text-amber-700 font-['DM_Sans',sans-serif]">
                  This action cannot be undone. The agent will be notified about the cancellation.
                </p>
              </div>
            </div>
          </div>

          {/* Reason (Optional) */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Found another property, Schedule conflict..."
              rows={4}
              disabled={cancelMutation.isPending}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 font-['DM_Sans',sans-serif] resize-none focus:outline-none focus:border-[#1C2A3A] focus:ring-2 focus:ring-[#1C2A3A]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={500}
            />
            {reason.length > 0 && (
              <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif] mt-1">
                {reason.length}/500 characters
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={cancelMutation.isPending}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep Tour
            </button>
            <button
              type="submit"
              disabled={cancelMutation.isPending}
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white text-[14px] font-semibold font-['DM_Sans',sans-serif] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {cancelMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Tour'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

CancelTourModal.displayName = 'CancelTourModal';

export default CancelTourModal;
