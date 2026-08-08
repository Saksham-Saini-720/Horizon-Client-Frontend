
import { memo } from "react";

const PropertyDescription = memo(({ description }) => {
  return (
    // A card like the stat tiles above, rather than a full-bleed slab divided
    // by a hairline. Elevation groups the section's content; a border-top only
    // separates it from whatever happens to sit above.
    <div className="mx-5 mb-4 rounded-2xl bg-white p-5 shadow-card-sm">
      {/* Heading with orange underline accent */}
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-secondary font-display">
          About this place
        </h2>
        <div className="mt-1.5 w-8 h-0.5 rounded-full bg-primary-light" />
      </div>
      <p className="text-[15px] text-gray-600 font-myriad leading-relaxed">
        {description}
      </p>
    </div>
  );
});

PropertyDescription.displayName = 'PropertyDescription';
export default PropertyDescription;
