
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
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Back Arrow */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5 text-gray-700"
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
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
            isFocused ? 'border-secondary bg-amber-50/30' : 'border-gray-200 bg-white'
          }`}>
            {/* Search Icon */}
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
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
              placeholder="villa"
              className="flex-1 bg-transparent outline-none border-none text-[15px] text-gray-700 placeholder-gray-400 font-myriad"
            />

            {/* Clear X */}
            {localQuery && (
              <button
                onClick={handleClear}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center flex-shrink-0 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-600"
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
