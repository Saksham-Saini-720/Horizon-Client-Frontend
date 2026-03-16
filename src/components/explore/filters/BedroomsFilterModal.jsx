
import { memo, useState } from 'react';

const BEDROOM_OPTIONS = ['1', '2', '3', '4+'];

const BedroomsFilterModal = memo(({ isOpen, onClose, onApply, currentFilters = {} }) => {
  const [selected, setSelected] = useState(currentFilters.bedrooms || null);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ bedrooms: selected });
    onClose();
  };

  const handleClear = () => {
    setSelected(null);
    onApply({ bedrooms: undefined });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bold/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-semibold text-primary font-inter">
              Number of Bedrooms
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors active:scale-90"
            >
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-4 gap-3">
            {BEDROOM_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`
                  aspect-square rounded-2xl border-2 text-[18px] font-semibold font-inter transition-all active:scale-95
                  ${selected === option
                    ? 'border-secondary bg-amber-50 text-primary'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pb-4">
          <p className="text-[15px] text-gray-500 font-inter">
            Select 4+ to see properties with 4 or more bedrooms
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-primary text-[16px] font-semibold font-inter hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={!selected}
            className="flex-1 px-6 py-4 rounded-2xl bg-primary text-white text-[16px] font-semibold font-inter hover:bg-primary-light transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
});

BedroomsFilterModal.displayName = 'BedroomsFilterModal';

export default BedroomsFilterModal;
