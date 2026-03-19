
import { memo, useState } from "react";
import { HorizonLogo } from "../layouts/Navbar";
import SearchBar from "../layouts/SearchBar";
import FilterChips from "./FilterChips";
import LocationPickerModal from "./LocationPickerModal";

const ExploreHeader = memo(({
  // Search
  onSubmitSearch,
  recentSearches,
  onRemoveRecent,
  onClearAllRecent,
  // Filters
  activeFilter,
  onFilterToggle,
  filtersDimmed,
  // NEW: Location
  currentLocation,
  onLocationChange,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 bg-surface backdrop-blur-sm animate-in fade-in duration-300">
        {/* Location row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-1">
              Your Location
            </p>
            {/*  UPDATED: Clickable location button */}
            <button 
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-1 group max-w-full"
            >
              <svg className="w-3.5 h-3.5 text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-[16px] font-semibold text-primary font-myriad truncate">
                {currentLocation?.name || 'Lusaka, Zambia'}
              </span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-secondary transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          <HorizonLogo size={50} />
        </div>

        {/* Search bar */}
        <div className="px-4 py-2">
          <SearchBar
            recentSearches={recentSearches}
            onSubmit={onSubmitSearch}
            onRemoveRecent={onRemoveRecent}
            onClearAllRecent={onClearAllRecent}
          />
        </div>

        {/* Filter chips */}
        <FilterChips
          activeFilter={activeFilter}
          onToggle={onFilterToggle}
          dimmed={filtersDimmed}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/*  NEW: Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        currentLocation={currentLocation}
        onSelectLocation={onLocationChange}
      />
    </>
  );
});

ExploreHeader.displayName = 'ExploreHeader';

export default ExploreHeader;
