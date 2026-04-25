
import { memo } from "react";

const PropertyDescription = memo(({ description }) => {
  return (
    <div className="px-5 pt-5 pb-5 border-t border-gray-100">
      {/* Heading with orange underline accent */}
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-primary font-myriad">
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
