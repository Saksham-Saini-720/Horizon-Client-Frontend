
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
                <span className="font-bold font-display text-secondary">{arr[0]} </span>
                <span className="text-primary-light" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 600 }}>
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
          className="flex items-center gap-0.5 text-[12px] font-semibold tracking-[0.2em] font-myriad uppercase text-primary-light hover:text-secondary transition-colors"
        >
          SEE ALL →
        </button>
      )}
    </div>
  );
});

export default SectionHeader;
