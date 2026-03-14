
import { memo } from "react";

const PropertyDescription = memo(({ description }) => {
  return (
    <div className="px-5 pt-4 pb-5 border-t border-gray-100">
      <h2 className="text-[16px] font-black text-primary font-playfair mb-3">
        Description
      </h2>
      <p className="text-[14px] text-gray-700 font-inter leading-relaxed">
        {description}
      </p>
    </div>
  );
});

export default PropertyDescription;
