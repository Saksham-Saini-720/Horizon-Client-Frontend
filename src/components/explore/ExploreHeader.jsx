import { memo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import { HorizonLogo } from "../layouts/Navbar";
import LocationPickerModal from "./LocationPickerModal";
import FilterChips from "./FilterChips";
import leading from "../../assets/icons/Leading.png";

const ExploreHeader = memo(({
  onSubmitSearch,
  recentSearches = [],
  onRemoveRecent,
  onClearAllRecent,
  currentLocation,
  onLocationChange,
  activeFilter,
  onToggle,
  dimmed,
  onOpenFilters,
}) => {
  const navigate = useNavigate();
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [searchQuery, setSearchQuery]               = useState("");
  const [searchFocused, setSearchFocused]           = useState(false);
  const searchInputRef = useRef(null);
  const user = useSelector(selectUser);

  const firstName = user?.firstName || null;
  const initials  = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  const suggestions = searchQuery.trim()
    ? recentSearches.filter((s) =>
        s.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : recentSearches;

  const showDropdown = searchFocused && suggestions.length > 0;

  const handleSubmit = useCallback(() => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchFocused(false);
    searchInputRef.current?.blur();
    onSubmitSearch?.(q);
  }, [searchQuery, onSubmitSearch]);

  const handleSelect = useCallback(
    (term) => {
      setSearchQuery(term);
      setSearchFocused(false);
      searchInputRef.current?.blur();
      onSubmitSearch?.(term);
    },
    [onSubmitSearch]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") {
        setSearchFocused(false);
        searchInputRef.current?.blur();
      }
    },
    [handleSubmit]
  );

  return (
    <>
      {/* ── Sticky header shell ── */}
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(165deg, #3641a8 0%, #2D368E 48%, #1d2670 100%)",
        }}
      >
        {/* Decorative ambient orbs + arc */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-12 -right-6 w-56 h-56 rounded-full blur-3xl"
            style={{ background: "rgba(201,108,56,0.18)" }}
          />
          <div
            className="absolute top-8 -left-14 w-44 h-44 rounded-full blur-3xl"
            style={{ background: "rgba(100,120,220,0.12)" }}
          />
          <div
            className="absolute bottom-0 right-1/3 w-32 h-32 rounded-full blur-2xl"
            style={{ background: "rgba(201,108,56,0.08)" }}
          />
          {/* Single decorative arc */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 280"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: 0.11 }}
          >
            <ellipse cx="390" cy="40" rx="210" ry="210" stroke="white" strokeWidth="0.8" />
          </svg>
        </div>

        {/* ── All content sits above orbs ── */}
        <div className="relative">

          {/* ── Row 1: Logo + Avatar ── */}
          <div className="flex items-center justify-between px-4 pt-4 pb-1.5">
            <HorizonLogo size={20} />

            {user ? (
              <button
                onClick={() => navigate("/profile")}
                className="relative active:scale-95 transition-transform"
                aria-label="Go to profile"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: "#C96C38",
                    boxShadow:
                      "0 0 0 2.5px rgba(255,255,255,0.28), 0 4px 16px rgba(201,108,56,0.5)",
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-full h-full object-cover"
                      alt={initials}
                    />
                  ) : (
                    <span className="text-white font-bold text-[15px] font-myriad tracking-wide">
                      {initials}
                    </span>
                  )}
                </div>
                {/* Online dot */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{
                    backgroundColor: "#34D399",
                    borderColor: "#2D368E",
                    boxShadow: "0 0 6px rgba(52,211,153,0.7)",
                  }}
                />
              </button>
            ) : (
              <img
                src={leading}
                alt="Leading Real Estate"
                className="invert h-[46px] mt-1 opacity-90"
              />
            )}
          </div>

          {/* ── Location row ── */}
          <button
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center gap-1.5 px-4 pt-1 pb-0.5 active:opacity-75 transition-opacity"
          >
            {/* Glowing dot */}
            <span
              className="w-[7px] h-[7px] rounded-full flex-shrink-0"
              style={{
                backgroundColor: "#34D399",
                boxShadow: "0 0 6px 2px rgba(52,211,153,0.55)",
              }}
            />
            <span
              className="text-[10.5px] font-bold uppercase font-myriad"
              style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "2px" }}
            >
              {currentLocation?.name || "Lusaka, Zambia"}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                width: 10,
                height: 10,
                color: "rgba(255,255,255,0.35)",
                flexShrink: 0,
              }}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* ── Greeting ── */}
          <div className="px-4 pt-2.5 pb-5">
            <h1
              className="font-bold text-white font-myriad leading-tight"
              style={{ fontSize: 30, letterSpacing: "-0.4px" }}
            >
              {firstName ? `Hi ${firstName}, find your` : "Find your"}
            </h1>
            <h1
              className="font-bold leading-tight"
              style={{
                fontSize: 30,
                fontStyle: "italic",
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#C96C38",
                letterSpacing: "-0.3px",
              }}
            >
              perfect home
            </h1>
          </div>

          {/* ── Search row ── */}
          <div className="px-4 pb-3.5 flex items-center gap-2.5">

            {/* Custom search input with inline dropdown */}
            <div className="flex-1 relative">
              <div
                className="flex items-center gap-2.5 rounded-2xl px-4 py-3 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: searchFocused
                    ? "1.5px solid rgba(201,108,56,0.7)"
                    : "1.5px solid rgba(255,255,255,0.30)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: searchFocused
                    ? "0 0 0 3px rgba(201,108,56,0.2), 0 8px 28px rgba(0,0,0,0.25)"
                    : "0 4px 18px rgba(0,0,0,0.2)",
                }}
              >
                {/* Magnifier icon — white */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ width: 17, height: 17, color: "rgba(255,255,255,0.65)", flexShrink: 0 }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>

                {/* Input — white text */}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setSearchFocused(false), 160)
                  }
                  placeholder="Search neighbourhoods, lofts..."
                  className="flex-1 bg-transparent outline-none border-none text-[15px] text-white font-myriad placeholder:text-white/45"
                />

                {/* Clear button */}
                {searchQuery ? (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: "rgba(255,255,255,0.18)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ width: 11, height: 11, color: "rgba(255,255,255,0.8)" }}
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                ) : null}
              </div>

              {/* Recent searches dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50"
                  style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }}
                >
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest font-myriad">
                      {searchQuery.trim() ? "Suggestions" : "Recent Searches"}
                    </p>
                    {!searchQuery.trim() && (
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={onClearAllRecent}
                        className="text-[11px] font-semibold text-red-400 hover:text-red-500 transition-colors font-myriad"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="h-px bg-gray-100 mx-4" />
                  <div className="py-1" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {suggestions.map((term) => (
                      <div
                        key={term}
                        onMouseDown={(e) => e.preventDefault()}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            style={{ width: 13, height: 13, color: "#9CA3AF" }}
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <span
                          onClick={() => handleSelect(term)}
                          className="flex-1 text-[14px] font-medium text-gray-700 font-myriad truncate"
                        >
                          {term}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveRecent(term);
                          }}
                          className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{ width: 10, height: 10, color: "#9CA3AF" }}
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/60">
                    <p className="text-[10.5px] text-gray-300 font-myriad">
                      Tap to search · ✕ to remove
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Orange filter button */}
            <button
              onClick={onOpenFilters}
              className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center active:scale-95 transition-all duration-150"
              style={{
                backgroundColor: "#C96C38",
                boxShadow: "0 4px 16px rgba(201,108,56,0.55)",
              }}
              aria-label="Open filters"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Filter chips ── */}
          <div className="px-4 pb-4">
            <FilterChips
              activeFilter={activeFilter}
              onToggle={onToggle}
              dimmed={dimmed}
            />
          </div>

          {/* Gold rule */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(210,175,80,0.35), transparent)",
            }}
          />
        </div>
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

ExploreHeader.displayName = "ExploreHeader";
export default ExploreHeader;
