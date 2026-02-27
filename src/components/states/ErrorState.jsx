
import { memo } from "react";

/**
 * Error state component
 * Used in: Explore, Search, PropertyDetail pages
 */
const ErrorState = memo(({ 
  title = "Failed to load",
  message,
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex flex-col items-center py-12 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
        <svg 
          className="w-7 h-7 text-red-400" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      
      <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
        {title}
      </p>
      
      <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif] mb-4">
        {message || "Something went wrong"}
      </p>

      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
});

export default ErrorState;
