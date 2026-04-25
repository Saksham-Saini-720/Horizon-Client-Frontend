import { memo } from "react";

const FILTERS = [
  { id: "buy",      label: "Buy" },
  { id: "rent",     label: "Rent" },
  { id: "price",    label: "Price" },
  { id: "bedrooms", label: "Bedrooms" },
  { id: "nearme",   label: "Location" },
  { id: "filters",  label: "Filters" },
];

const FilterChips = memo(({ activeFilter, onToggle, dimmed = false }) => (
  <div
    className={`flex gap-2.5 overflow-x-auto scrollbar-hide mb-10 p-2 transition-opacity duration-150 ${
      dimmed ? "opacity-60" : "opacity-100"
    }`}
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
));

FilterChips.displayName = "FilterChips";
export default FilterChips;
