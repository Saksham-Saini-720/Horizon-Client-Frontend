
import { useRef, useState, useMemo, memo } from "react";

// ─── Dropdown ─────────────────────────────────────────────────────────────────

const Dropdown = ({ items, label, query, onSelect, onRemove, onClearAll }) => {
  if (!items.length) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-['DM_Sans',sans-serif]">
          {label}
        </p>
        {!query && (
  
          <button
            onMouseDown={(e) => e.preventDefault()} 
            onClick={onClearAll}
            className="text-[12px] font-semibold text-red-400 hover:text-red-500 transition-colors font-['DM_Sans',sans-serif]"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="h-px bg-gray-100 mx-4" />

      {/* Items */}
      <div className="py-1">
        {items.map((term) => (
          <div
            key={term}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              {query ? (
                
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              ) : (
                
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              )}
            </div>

            {/* Term */}
            <span
              onClick={() => onSelect(term)}
              className="flex-1 text-[14px] font-medium text-[#1C2A3A] font-['DM_Sans',sans-serif] truncate"
            >
              {/* Bold matching part */}
              {query ? (
                (() => {
                  const idx = term.toLowerCase().indexOf(query.toLowerCase());
                  if (idx === -1) return term;
                  return (
                    <>
                      {term.slice(0, idx)}
                      <span className="font-bold text-amber-500">{term.slice(idx, idx + query.length)}</span>
                      {term.slice(idx + query.length)}
                    </>
                  );
                })()
              ) : term}
            </span>

            {/* Arrow on hover */}
            <button
              onClick={() => onSelect(term)}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              aria-label="Search this"
            >
              <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </button>

            {!query && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(term); }}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 hover:border hover:border-red-200 flex items-center justify-center flex-shrink-0 transition-colors"
                aria-label={`Remove "${term}"`}
              >
                <svg className="w-3 h-3 text-gray-400 hover:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      {!query && (
        <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
          <p className="text-[11px] text-gray-300 font-['DM_Sans',sans-serif]">
            Tap to search · ✕ to remove one · Clear all to reset
          </p>
        </div>
      )}
    </div>
  );
};

// ─── SearchBar ────────────────────────────────────────────────────────────────

const SearchBar = memo(({
  recentSearches = [],    // string[]
  onSubmit,               // (query: string) => void
  onRemoveRecent,         // (term: string) => void
  onClearAllRecent,       // () => void
  placeholder = "Search location, city, or area...",
  initialQuery = "",
}) => {
  const inputRef             = useRef(null);
  const [query, setQuery]    = useState(initialQuery);
  const [isFocused, setFocused] = useState(false);
  
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return recentSearches.filter((s) => s.toLowerCase().includes(q));
  }, [query, recentSearches]);

  const dropdownItems  = query.trim() ? suggestions : recentSearches;
  const dropdownLabel  = query.trim() ? "Suggestions" : "Recent Searches";
  const showDropdown   = isFocused && dropdownItems.length > 0;

  const handleSubmit = () => {
    const q = query.trim();
    if (!q) return;
    setFocused(false);
    inputRef.current?.blur();
    onSubmit?.(q);
  };

  const handleSelect = (term) => {
    setQuery(term);
    setFocused(false);
    inputRef.current?.blur();
    onSubmit?.(term);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")  handleSubmit();
    if (e.key === "Escape") { setFocused(false); inputRef.current?.blur(); }
  };

  return (
    <div className="relative">
      {/* Input row */}
      <div className={`flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border transition-all duration-150
        ${isFocused ? "border-amber-400 shadow-[0_0_0_3px_rgba(245,158,11,0.12)]" : "border-gray-200"}`}
      >
        {/* Search icon */}
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}   // no delay needed — onMouseDown preventDefault handles it
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none border-none text-[15px] text-gray-700 placeholder-gray-400 font-['DM_Sans',sans-serif]"
        />

        {/* Clear ✕ */}
        {query && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-300 transition-colors"
          >
            <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}

        <div className="w-px h-5 bg-gray-200 flex-shrink-0" />

        {/* Search button */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSubmit}
          className="flex-shrink-0 h-8 px-3 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #F5B731, #E8A020)" }}
        >
          Search
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <Dropdown
          items={dropdownItems}
          label={dropdownLabel}
          query={query.trim()}
          onSelect={handleSelect}
          onRemove={onRemoveRecent}
          onClearAll={onClearAllRecent}
        />
      )}
    </div>
  );
});

export default SearchBar;
