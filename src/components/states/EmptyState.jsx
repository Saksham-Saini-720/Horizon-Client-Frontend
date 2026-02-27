
import { memo } from "react";

/**
 * Empty state component
 * Used in: Explore, Search pages
 */
const EmptyState = memo(({ 
  icon = "search",
  title = "No results found",
  message = "Try a different search",
  action
}) => {
  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </>
    ),
    home: (
      <>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </>
    ),
  };

  return (
    <div className="flex flex-col items-center py-12 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
        <svg 
          className="w-7 h-7 text-amber-300" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        >
          {icons[icon]}
        </svg>
      </div>
      
      <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
        {title}
      </p>
      
      <p className="text-[12px] text-gray-400 mt-1 font-['DM_Sans',sans-serif]">
        {message}
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
});

export default EmptyState;
