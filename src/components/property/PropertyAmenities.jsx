// src/components/property/PropertyAmenities.jsx
import { memo } from "react";

const AmenityChip = memo(({ label }) => (
  <div className="px-4 py-2 rounded-full bg-gray-100 text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif]">
    {label}
  </div>
));

const PropertyAmenities = memo(({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="px-5 pt-4 pb-5 border-t border-gray-100">
      <h2 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-3">
        Amenities
      </h2>
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <AmenityChip key={index} label={amenity} />
        ))}
      </div>
    </div>
  );
});

export default PropertyAmenities;
