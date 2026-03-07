// src/components/map/PropertyMarker.jsx
import { memo } from "react";

/**
 * PropertyMarker Component
 * Map marker showing property price
 */
const PropertyMarker = memo(({ property, isSelected, onClick }) => {
  // Position calculation (simulated - replace with actual lat/lng)
  const position = {
    top: `${(property.id * 17) % 60 + 15}%`,
    left: `${(property.id * 23) % 70 + 15}%`,
  };

  return (
    <button
      onClick={onClick}
      className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 ${
        isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
      }`}
      style={position}
    >
      {/* Marker Bubble */}
      <div
        className={`px-3 py-2 rounded-full shadow-lg font-['DM_Sans',sans-serif] font-bold text-[13px] whitespace-nowrap transition-all ${
          isSelected
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white scale-110'
            : 'bg-white text-[#1C2A3A] hover:shadow-xl'
        }`}
      >
        {property.price}
      </div>

      {/* Marker Pin */}
      <div className="flex justify-center">
        <div
          className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent transition-colors ${
            isSelected ? 'border-t-amber-500' : 'border-t-white'
          }`}
        />
      </div>

      {/* Pulse Animation (when selected) */}
      {isSelected && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-amber-400 opacity-20 animate-ping" />
      )}
    </button>
  );
});

PropertyMarker.displayName = 'PropertyMarker';

export default PropertyMarker;
