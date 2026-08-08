
import { memo } from "react";

/**
 * Colour pairs for the two surfaces this header sits on, checked against
 * WCAG 2.1: 3:1 for the 23px title (large text), 4.5:1 for the 12px action.
 */
const TONES = {
  // On the white page body.
  dark: {
    title:  "text-secondary",
    accent: "#C96C38",
    action: "text-primary-light hover:text-secondary",
  },
  // On the header's blue band (~#262E7E).
  light: {
    title:  "text-white",
    // 4.1:1 here, where #C96C38 manages only 3.2:1. Both clear the large-text
    // bar, but the lighter orange holds up far better against the blue.
    accent: "#E8793A",
    // 12px counts as small text and needs 4.5:1, which the orange fails on
    // blue. White at 0.9 alpha reads as secondary without dropping to a grey.
    action: "text-white/90 hover:text-white",
  },
};

/**
 * Section header with "See all" button
 * Used in: Explore page
 */
const SectionHeader = memo(({ title, onSeeAll, tone = "dark" }) => {

  const arr = title.split(" ");
  const { title: titleClass, accent, action } = TONES[tone] ?? TONES.dark;

  return (
    <div className="flex items-center justify-between px-6 py-2 my-3">
      <div className="relative inline-block pb-[6px]">
              <h2 className="text-[23px] leading-none">
                <span className={`font-bold font-display ${titleClass}`}>{arr[0]} </span>
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600, color: accent }}>
                  {arr[1]}
                </span>
              </h2>
              <span
                className="absolute left-0 bottom-0 h-[2px] w-[52px]"
                style={{ backgroundColor: accent }}
              />
            </div>

      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className={`flex items-center gap-0.5 text-[12px] font-semibold tracking-[0.2em] font-myriad uppercase transition-colors ${action}`}
        >
          SEE ALL →
        </button>
      )}
    </div>
  );
});

export default SectionHeader;
