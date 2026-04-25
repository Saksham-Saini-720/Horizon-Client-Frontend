
import { memo } from "react";

/**
 * Section header with "See all" button
 * Used in: Explore page
 */
const SectionHeader = memo(({ title, onSeeAll }) => {

  const arr = title.split(" ");
  return (
    <div className="flex items-center justify-between px-4 py-2 my-3">
      <div className="relative inline-block pb-[6px]">
              <h2 className="text-[23px] leading-none" style={{ color: "#1A1A1A" }}>
                <span className="font-bold font-myriad text-secondary">{arr[0]} </span>
                <span className="text-primary-light" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 400 }}>
                  {arr[1]}
                </span>
              </h2>
              <span
                className="absolute left-0 bottom-0 h-[2px] w-[52px]"
                style={{ backgroundColor: "#C96C38" }}
              />
            </div>
      
      {onSeeAll && (
        <button 
          onClick={onSeeAll} 
          className="flex items-center gap-0.5 text-[15px] font-semibold text-primary-light font-myriad hover:text-secondary transition-colors"
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
