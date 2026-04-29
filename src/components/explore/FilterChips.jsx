import { memo, useRef, useState, useEffect, useCallback } from "react";

const FILTERS = [
  { id: "buy",      label: "Buy" },
  { id: "rent",     label: "Rent" },
  { id: "price",    label: "Price" },
  { id: "bedrooms", label: "Bedrooms" },
  { id: "nearme",   label: "Location" },
  { id: "filters",  label: "Filters" },
];

const FilterChips = memo(({ activeFilter, onToggle, dimmed = false }) => {
  const scrollRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <div
      className={`relative mb-10 transition-opacity duration-150 ${
        dimmed ? "opacity-60" : "opacity-100"
      }`}
    >
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto scrollbar-hide p-2"
      >
        {FILTERS.map(({ id, label }) => {
          const isActive = activeFilter === id;
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className="flex-shrink-0 px-5 py-[7px] rounded-full text-[13px] font-semibold font-myriad active:scale-95 transition-all duration-150"
              style={
                isActive
                  ? {
                      backgroundColor: "#C96C38",
                      color: "#fff",
                      border: "1.5px solid transparent",
                      boxShadow:
                        "0 0 0 3px rgba(201,108,56,0.30), 0 4px 18px rgba(201,108,56,0.60)",
                    }
                  : {
                      background: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      color: "rgba(255,255,255,0.88)",
                      border: "1.5px solid rgba(255,255,255,0.30)",
                      boxShadow: "0 4px 18px rgba(0,0,0,0.2)",
                    }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Scroll hint arrow — mobile only, fades out when fully scrolled */}
      <div
        className={`md:hidden pointer-events-none absolute right-0 top-0 h-full flex items-center transition-opacity duration-200 ${
          showArrow ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: "48px",
          background: "linear-gradient(to right, transparent, rgba(0,0,0,0.45))",
        }}
      >
        <svg
          className="ml-auto mr-1.5"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
});

FilterChips.displayName = "FilterChips";
export default FilterChips;
