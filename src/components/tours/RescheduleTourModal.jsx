
import { memo, useState } from 'react';
import { useRescheduleTour } from '../../hooks/tours/useTourActions';

/**
 * RescheduleTourModal Component
 * Modal for rescheduling a tour with new date and time
 */
const RescheduleTourModal = memo(({ isOpen, onClose, tour }) => {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const rescheduleMutation = useRescheduleTour();

  if (!isOpen) return null;

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!preferredDate || !preferredTime) {
      return;
    }

    rescheduleMutation.mutate(
      { 
        tourId: tour.id, 
        preferredDate,
        preferredTime 
      },
      {
        onSuccess: () => {
          onClose();
          setPreferredDate('');
          setPreferredTime('');
        },
      }
    );
  };

  const handleClose = () => {
    if (!rescheduleMutation.isPending) {
      onClose();
      setPreferredDate('');
      setPreferredTime('');
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
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <h2 className="text-[18px] font-black text-primary font-playfair">
                  Reschedule Tour
                </h2>
                <p className="text-[12px] text-gray-500 font-playfair">
                  {tour?.property?.title}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={rescheduleMutation.isPending}
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
          {/* Info Message */}
          <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <div>
                <p className="text-[13px] font-semibold text-blue-800 font-inter mb-1">
                  Choose New Date & Time
                </p>
                <p className="text-[12px] text-blue-700 font-inter">
                  The agent will confirm your new preferred time shortly.
                </p>
              </div>
            </div>
          </div>

          {/* Current Schedule (if confirmed) */}
          {tour?.status === 'confirmed' && tour?.date && (
            <div className="mb-5 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] text-gray-500 font-inter mb-1">
                Current Schedule:
              </p>
              <p className="text-[13px] font-semibold text-gray-700 font-inter">
                {tour.date} at {tour.time}
              </p>
            </div>
          )}

          {/* Date Input */}
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-gray-700 font-inter mb-2">
              Preferred Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={getMinDate()}
                required
                disabled={rescheduleMutation.isPending}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 font-inter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>

          {/* Time Input */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 font-inter mb-2">
              Preferred Time *
            </label>
            <div className="relative">
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
                disabled={rescheduleMutation.isPending}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-800 font-inter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={rescheduleMutation.isPending}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-700 font-inter hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rescheduleMutation.isPending || !preferredDate || !preferredTime}
              className="flex-1 px-6 py-3 rounded-xl bg-amber-500 text-white text-[14px] font-semibold font-inter hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {rescheduleMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rescheduling...
                </>
              ) : (
                'Reschedule'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

RescheduleTourModal.displayName = 'RescheduleTourModal';

export default RescheduleTourModal;
