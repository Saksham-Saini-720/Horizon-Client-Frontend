// src/components/explore/filters/PriceFilterModal.jsx
import { memo, useState } from 'react';

const PRICE_RANGES = [
  { label: 'Under $100K', min: 0, max: 100000 },
  { label: '$100K - $250K', min: 100000, max: 250000 },
  { label: '$250K - $500K', min: 250000, max: 500000 },
  { label: '$500K - $1M', min: 500000, max: 1000000 },
  { label: 'Over $1M', min: 1000000, max: null },
];

const PriceFilterModal = memo(({ isOpen, onClose, onApply, currentFilters = {} }) => {
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });
    onClose();
  };

  const handleRangeSelect = (range) => {
    setMinPrice(range.min);
    setMaxPrice(range.max || '');
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    onApply({ minPrice: undefined, maxPrice: undefined });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
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
            <h2 className="text-[22px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              Price Range
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

        {/* Quick Ranges */}
        <div className="px-6 py-4">
          <p className="text-[13px] font-semibold text-gray-500 mb-3 font-['DM_Sans',sans-serif]">
            Quick Select
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PRICE_RANGES.map((range, index) => (
              <button
                key={index}
                onClick={() => handleRangeSelect(range)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-95"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Range */}
        <div className="px-6 py-4">
          <p className="text-[13px] font-semibold text-gray-500 mb-3 font-['DM_Sans',sans-serif]">
            Custom Range
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-2 font-['DM_Sans',sans-serif]">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-2 font-['DM_Sans',sans-serif]">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-[#1C2A3A] text-[16px] font-bold font-['DM_Sans',sans-serif] hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-4 rounded-2xl bg-[#1C2A3A] text-white text-[16px] font-bold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] transition-all active:scale-[0.98] shadow-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
});

PriceFilterModal.displayName = 'PriceFilterModal';

export default PriceFilterModal;
