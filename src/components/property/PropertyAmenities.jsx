
import { memo } from "react";

const AmenityChip = memo(({ label }) => (
  <div className="px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-[13px] font-semibold text-gray-600 font-myriad">
    {label}
  </div>
));

AmenityChip.displayName = 'AmenityChip';

const PropertyAmenities = memo(({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="px-5 pt-5 pb-5 border-t border-gray-100">
      {/* Heading with orange underline accent */}
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-primary font-myriad">
          Amenities
        </h2>
        <div className="mt-1.5 w-8 h-0.5 rounded-full bg-primary-light" />
      </div>
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <AmenityChip key={index} label={amenity} />
        ))}
      </div>
    </div>
  );
});

PropertyAmenities.displayName = 'PropertyAmenities';
export default PropertyAmenities;
