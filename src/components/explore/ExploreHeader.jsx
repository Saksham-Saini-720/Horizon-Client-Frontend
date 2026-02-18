
import { memo } from "react";
import { HorizonLogo } from "../layouts/Navbar";
import SearchBar from "../layouts/SearchBar";
import FilterChips from "./FilterChips";

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
}) => (
  <div className="sticky top-0 z-50 bg-[#F7F6F2]">

    {/* Location row */}
    <div className="flex items-center justify-between px-4 pt-3 pb-2">
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-1">
          Your Location
        </p>
        <button className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
            Lusaka, Zambia
          </span>
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      <HorizonLogo size={40} />
    </div>

    {/* Search bar */}
    <div className="px-4 pb-2">
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
));

export default ExploreHeader;
