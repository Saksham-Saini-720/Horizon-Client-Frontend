
import { memo, useState } from "react";
import { HorizonLogo } from "../layouts/Navbar";
import SearchBar from "../layouts/SearchBar";
import LocationPickerModal from "./LocationPickerModal";
import leading from "../../assets/icons/leading.png";
import village from "../../assets/icons/green_village.png";
import auction from "../../assets/icons/auction_logo.png";
import tree from "../../assets/icons/tree.png";

const ExploreHeader = memo(({
  onSubmitSearch,
  recentSearches,
  onRemoveRecent,
  onClearAllRecent,
  currentLocation,
  onLocationChange,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 animate-in fade-in duration-300 bg-secondary">
        {/* ── Logo Row ── */}
        <div className="flex items-center gap-1 justify-between pl-4 pr-2">
          {/* LEFT — Horizon logo */}
          <HorizonLogo size={20} />

          {/* RIGHT — Leading real estate logo */}
          <div className="flex flex-col items-end">
            <img
              src={village}
              alt="Leading Real Estate"
              className="h-[50px]"
            />
          </div>
          <div className="flex flex-col items-end">
            <img
              src={auction}
              alt="Leading Real Estate"
              className="h-[50px]"
            />
          </div>
          <div className="flex flex-col items-end">
            <img
              src={tree}
              alt="Leading Real Estate"
              className="h-[60px]"
            />
          </div>
          <div className="flex flex-col items-end">
            <img
              src={leading}
              alt="Leading Real Estate"
              className="invert h-[60px]"
            />
          </div>
        </div>

        {/* subtle gold separator */}
        <div className="mx-4" style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(210,175,80,0.4), transparent)'
        }} />

        {/* ── Location Row ── */}
        <div className="px-4 pt-2.5 pb-1.5">
          <p className="text-[9px] font-bold uppercase tracking-[2.2px] mb-1.5"
            style={{ color: 'rgba(255,255,255,0.42)' }}>
            Your Location
          </p>
          <button
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center gap-1.5 group"
          >
            <svg style={{ width: 13, height: 13, color: '#D4B46A', flexShrink: 0 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-[16px] font-myriad font-bold text-white tracking-[0.1px]">
              {currentLocation?.name || 'Lusaka, Zambia'}
            </span>
            <svg style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* ── Search Bar ── */}
        <div className="px-4 py-2">
          <SearchBar
            recentSearches={recentSearches}
            onSubmit={onSubmitSearch}
            onRemoveRecent={onRemoveRecent}
            onClearAllRecent={onClearAllRecent}
          />
        </div>

        {/* bottom gold rule */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(210,175,80,0.22), transparent)'
        }} />
      </div>

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
