import { memo } from "react";

const RecentSearchesDropdown = memo(({ searches, onSelect, onRemove, onClearAll }) => {
  if (!searches.length) return null;

  return (
    <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest font-['DM_Sans',sans-serif]">
          Recent Searches
        </p>
        <button
          onClick={onClearAll}
          className="text-[12px] font-semibold text-red-400 hover:text-red-500 transition-colors font-['DM_Sans',sans-serif]"
        >
          Clear all
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* ── Search Items ── */}
      <div className="py-1">
        {searches.map((term) => (
          <div
            key={term}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
          >
            {/* Clock icon */}
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            {/* Term — click pe select */}
            <span
              onClick={() => onSelect(term)}
              className="flex-1 text-[14px] font-medium text-[#1C2A3A] font-['DM_Sans',sans-serif] truncate"
            >
              {term}
            </span>

            {/* Arrow (fill in search bar) */}
            <button
              onClick={() => onSelect(term)}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mr-1"
              aria-label="Fill search"
            >
              <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>

            {/* ✕ Remove this item */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(term); }}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
              aria-label={`Remove "${term}"`}
            >
              <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* ── Footer hint ── */}
      <div className="px-4 py-2 border-t border-gray-50">
        <p className="text-[11px] text-gray-300 font-['DM_Sans',sans-serif]">
          Tap to search · ✕ to remove
        </p>
      </div>

    </div>
  );
});

export default RecentSearchesDropdown;
