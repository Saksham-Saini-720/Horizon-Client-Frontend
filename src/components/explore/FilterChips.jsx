import  { memo } from "react";
import { FaHome } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";


const FILTERS = [
  {
    id: "buy", label: "Buy",
    icon: (
      <FaHome size={30} color="currentColor" />
    ),
  },
  {
    id: "rent", label: "Rent",
    icon: (
      <FaKey size={25} color="currentColor" />
    ),
  },
  {
    id: "price", label: "Price",
    icon: (
      <FaDollarSign size={30} color="currentColor" />
    ),
  },
  {
    id: "bedrooms", label: "Bedrooms",
    icon: (
      <FaBed size={30} color="currentColor" />
    ),
  },
  {
    id: "nearme", label: "Location",
    icon: (
      <FaLocationDot size={30} color="currentColor" />
    ),
  },
  {
    id: "filters", label: "Filters",
    icon: (
      <FaFilter size={30} color="currentColor" />
    ),
  },
];

const FilterChips = memo(({ activeFilter, onToggle, dimmed = false }) => (
  <div className={`flex items-start gap-2 px-4 py-4 overflow-x-auto scrollbar-hide transition-opacity duration-150 ${dimmed ? "opacity-60" : "opacity-100"}`}>
    {FILTERS.map(({ id, label, icon }) => {
      const isActive = activeFilter === id;
      return (
        <button
          key={id}
          onClick={() => onToggle(id)}
          className="flex flex-col items-center gap-[7px] flex-shrink-0 w-[68px] active:scale-95 transition-transform"
        >
          <div className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center transition-all
            ${isActive
              ? "border-2 border-[#1a1a2e] bg-[#f0f0f8] text-[#1a1a2e]"
              : "border border-[#e8e8e8] bg-white text-secondary hover:bg-gray-50"
            }`}
          >
            {icon}
          </div>
          <span className={`text-[11px] font-bold text-center leading-tight w-full
            ${isActive ? "text-[#1a1a2e]" : "text-gray-400"}`}
          >
            {label}
          </span>
        </button>
      );
    })}
  </div>
));
export default FilterChips;