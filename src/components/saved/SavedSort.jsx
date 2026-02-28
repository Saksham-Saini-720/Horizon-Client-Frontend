
import { memo, useState, useRef, useEffect } from 'react';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Saved', icon: '🕐' },
  { value: 'price-low', label: 'Price: Low to High', icon: '↗️' },
  { value: 'price-high', label: 'Price: High to Low', icon: '↘️' },
  { value: 'name-az', label: 'Name A-Z', icon: '🔤' },
];

/**
 * SavedSort Component
 * Dropdown for sorting saved properties
 */
const SavedSort = memo(({ activeSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  const activeOption = SORT_OPTIONS.find(opt => opt.value === activeSort);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="16" y2="6"/>
          <line x1="4" y1="12" x2="13" y2="12"/>
          <line x1="4" y1="18" x2="10" y2="18"/>
        </svg>
        <span className="text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif]">
          Sort
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors ${
                activeSort === option.value ? 'bg-amber-50' : ''
              }`}
            >
              <span className="text-[16px]">{option.icon}</span>
              <span className={`text-[14px] font-['DM_Sans',sans-serif] ${
                activeSort === option.value
                  ? 'font-semibold text-[#1C2A3A]'
                  : 'font-medium text-gray-700'
              }`}>
                {option.label}
              </span>
              {activeSort === option.value && (
                <svg className="w-4 h-4 text-amber-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

SavedSort.displayName = 'SavedSort';

export default SavedSort;
