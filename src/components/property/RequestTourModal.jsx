
import { memo, useState, useCallback } from 'react';
import ConfirmTourModal from './ConfirmTourModal';

/**
 * RequestTourModal Component
 * Step 1: Visit type, date, time selection
 * UPDATED: Removed Redux dispatch (now handled by API hook in ConfirmTourModal)
 */
const RequestTourModal = memo(({ isOpen, onClose, property, agent }) => {
  const [visitType, setVisitType] = useState('in-person');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [note, setNote] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // Generate next 6 days starting from tomorrow
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date,
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  // Time slots
  const timeSlots = [
    '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00'
  ];

  // Handle date selection
  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setShowTimeSlots(true);
  }, []);

  // Handle time selection (max 3)
  const handleTimeToggle = useCallback((time) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else if (prev.length < 3) {
        return [...prev, time];
      }
      return prev;
    });
  }, []);

  // Handle review - Just move to confirm modal
  const handleReview = useCallback(() => {
    if (!selectedDate || selectedTimes.length === 0) return;
    setShowConfirm(true);
  }, [selectedDate, selectedTimes]);

  if (!isOpen) return null;

  // Show confirm modal
  if (showConfirm) {
    return (
      <ConfirmTourModal
        onClose={onClose}
        onBack={() => setShowConfirm(false)}
        property={property}
        agent={agent}
        visitType={visitType}
        selectedDate={selectedDate}
        selectedTimes={selectedTimes}
        note={note}
      />
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bold/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-semibold text-primary font-myriad">
              Request a Tour
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
          {/* Visit Type */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-700 font-myriad mb-3">
              Visit Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* In Person */}
              <button
                onClick={() => setVisitType('in-person')}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                  visitType === 'in-person'
                    ? 'border-primary bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <div className="text-center">
                  <p className="text-[15px] font-semibold text-primary font-myriad">
                    In Person
                  </p>
                  <p className="text-[12px] text-gray-500 font-myriad">
                    Visit the property
                  </p>
                </div>
              </button>

              {/* Virtual Tour */}
              <button
                onClick={() => setVisitType('virtual')}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                  visitType === 'virtual'
                    ? 'border-primary bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <div className="text-center">
                  <p className="text-[15px] font-semibold text-primary font-myriad">
                    Virtual Tour
                  </p>
                  <p className="text-[12px] text-gray-500 font-myriad">
                    Video call tour
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-700 font-myriad mb-3">
              Select Date
            </label>
            <div className="grid grid-cols-6 gap-3">
              {dates.map((d, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(d)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    selectedDate?.date === d.date
                      ? 'border-primary bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[11px] text-gray-500 font-myriad mb-1">
                    {d.day}
                  </span>
                  <span className="text-[18px] font-semibold text-primary font-myriad mb-1">
                    {d.date}
                  </span>
                  <span className="text-[10px] text-gray-400 font-myriad">
                    {d.month}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots (show after date selection) */}
          {showTimeSlots && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[15px] font-semibold text-gray-700 font-myriad">
                  Select Time (up to 3)
                </label>
                <span className="text-[12px] text-gray-500 font-myriad">
                  {selectedTimes.length}/3 selected
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeToggle(time)}
                    disabled={!selectedTimes.includes(time) && selectedTimes.length >= 3}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      selectedTimes.includes(time)
                        ? 'border-primary bg-secondary text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-[15px] font-semibold font-myriad">
                      {time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-[15px] font-semibold text-gray-700 font-myriad mb-2">
              Note for Agent (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any specific areas you'd like to see, accessibility needs, etc."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] text-gray-700 font-myriad placeholder-gray-400 focus:outline-none focus:border-secondary resize-none"
            />
            <p className="text-[11px] text-gray-400 font-myriad mt-1">
              {note.length}/500 characters
            </p>
          </div>

          {/* Info */}
          <div className="flex gap-3 p-4 rounded-xl bg-blue-50">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="text-[12px] text-gray-600 font-myriad leading-relaxed">
              The agent will review your request and confirm the best available slot. You'll receive a notification once confirmed.
            </p>
          </div>

          {/* Review Button */}
          <button
            onClick={handleReview}
            disabled={!selectedDate || selectedTimes.length === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-400 text-white text-[16px] font-semibold font-myriad hover:bg-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-secondary enabled:hover:bg-primary-light shadow-lg"
          >
            Review & Request Tour
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
});

RequestTourModal.displayName = 'RequestTourModal';

export default RequestTourModal;
