
import { memo, useState, useRef } from "react";

const SearchHeader = memo(({
  query,
  onSearch,
  onClearSearch,
  onBack
}) => {
  const inputRef = useRef(null);
  const [localQuery, setLocalQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    onClearSearch();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="px-4 pt-4 pb-3 relative z-10">
      <div className="flex items-center gap-3">
        {/* Back Arrow */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            style={isFocused ? {
              background: 'rgba(255,255,255,0.10)',
              border: '1.5px solid rgba(201,108,56,0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 0 20px rgba(201,108,56,0.22), inset 0 0 0 0.5px rgba(255,255,255,0.05)',
            } : {
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.13)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Search Icon */}
            <svg
              className="w-5 h-5 flex-shrink-0 transition-colors duration-200"
              style={{ color: isFocused ? '#C96C38' : 'rgba(255,255,255,0.45)' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search properties..."
              className="flex-1 bg-transparent outline-none border-none text-[15px] placeholder-gray-500 font-myriad"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            />

            {/* Clear X */}
            {localQuery && (
              <button
                onClick={handleClear}
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
                aria-label="Clear search"
              >
                <svg
                  className="w-3.5 h-3.5"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SearchHeader.displayName = 'SearchHeader';

export default SearchHeader;
