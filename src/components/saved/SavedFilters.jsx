
import { memo } from 'react';

const FilterButton = memo(({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-[13px] font-semibold font-['DM_Sans',sans-serif] transition-all active:scale-95 whitespace-nowrap ${
      active
        ? 'bg-[#1C2A3A] text-white shadow-md'
        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
    }`}
  >
    {children}
    {count !== undefined && (
      <span className={`ml-1.5 ${active ? 'text-white/80' : 'text-gray-400'}`}>
        ({count})
      </span>
    )}
  </button>
));

FilterButton.displayName = 'FilterButton';

/**
 * SavedFilters Component
 * Filter buttons for saved properties: All, For Sale, For Rent
 */
const SavedFilters = memo(({ activeFilter, onFilterChange, counts }) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide -mx-1 px-1 py-1">
      <FilterButton
        active={activeFilter === 'all'}
        onClick={() => onFilterChange('all')}
        count={counts.all}
      >
        All
      </FilterButton>

      <FilterButton
        active={activeFilter === 'for-sale'}
        onClick={() => onFilterChange('for-sale')}
        count={counts.forSale}
      >
        For Sale
      </FilterButton>

      <FilterButton
        active={activeFilter === 'for-rent'}
        onClick={() => onFilterChange('for-rent')}
        count={counts.forRent}>
        For Rent
      </FilterButton>
    </div>
  );
});

SavedFilters.displayName = 'SavedFilters';

export default SavedFilters;
