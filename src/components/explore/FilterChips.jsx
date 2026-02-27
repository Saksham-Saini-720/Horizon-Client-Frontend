
import { memo } from "react";

const FILTERS = [
  { id: "buy",      label: "Buy" },
  { id: "rent",     label: "Rent" },
  { id: "price",    label: "Price" },
  { id: "bedrooms", label: "Bedrooms" },
  {
    id: "nearme",
    label: "Near Me",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "filters",
    label: "Filters",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    ),
  },
];


const FilterChips = memo(({ activeFilter, onToggle, dimmed = false }) => (
  <div className={`flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide transition-opacity duration-150 ${dimmed ? "opacity-60" : "opacity-100"}`}>
    {FILTERS.map(({ id, label, icon }) => {
      const isActive = activeFilter === id;
      return (
        <button
          key={id}
          onClick={() => onToggle(id)}
          className={`
            flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full border
            text-[13px] font-semibold font-['DM_Sans',sans-serif] transition-all active:scale-95
            ${isActive
              ? "bg-[#1C2A3A] text-white border-[#1C2A3A]"
              : "bg-white text-[#1C2A3A] border-gray-200"
            }
          `}
        >
          {icon}
          {label}
        </button>
      );
    })}
  </div>
));

export default FilterChips;
