
import { memo } from "react";

const PropertyInfo = memo(({ property }) => {
  return (
    <div className="px-5 pt-5">
      {/* Tag + Type */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${
          property.tag === "For Sale" 
            ? "bg-secondary text-white" 
            : "bg-secondary text-white"
        }`}>
          {property.tag}
        </span>
        <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
          {property.type}
        </span>
      </div>

      {/* Price */}
      <p className="text-[28px] font-semibold text-primary font-myriad mb-2">
        {property.price}
      </p>

      {/* Title */}
      <h1 className="text-[20px] font-semibold text-primary font-myriad mb-2">
        {property.title}
      </h1>

      {/* Location */}
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <p className="text-[15px] text-gray-600 font-myriad">
          {property.location}
        </p>
      </div>
    </div>
  );
});

export default PropertyInfo;
