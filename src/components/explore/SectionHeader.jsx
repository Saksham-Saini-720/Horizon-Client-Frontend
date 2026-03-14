
import { memo } from "react";

/**
 * Section header with "See all" button
 * Used in: Explore page
 */
const SectionHeader = memo(({ title, onSeeAll }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 my-3">
      <h2 className="text-xl font-black text-primary font-playfair">
        {title}
      </h2>
      
      {onSeeAll && (
        <button 
          onClick={onSeeAll} 
          className="flex items-center gap-0.5 text-[14px] font-semibold text-amber-500 font-inter hover:text-amber-600 transition-colors"
        >
          See all
          <svg 
            className="w-4 h-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          >
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}
    </div>
  );
});

export default SectionHeader;
