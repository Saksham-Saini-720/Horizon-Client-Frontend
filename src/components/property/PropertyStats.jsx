
import { memo } from "react";

const StatCard = memo(({ icon, value, label }) => (
  <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center">
    <svg className="w-6 h-6 text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {icon}
    </svg>
    <p className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-0.5">
      {value}
    </p>
    <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
      {label}
    </p>
  </div>
));

const PropertyStats = memo(({ bedrooms, bathrooms, area, areaUnit = "sqm" }) => {
  return (
    <div className="px-5 pt-5 pb-5">
      <div className="flex gap-3">
        {/* Bedrooms */}
        <StatCard
          icon={
            <>
              <path d="M3 9v12h18V9M3 9l9-6 9 6M12 3v6"/>
              <rect x="5" y="13" width="4" height="4"/>
              <rect x="15" y="13" width="4" height="4"/>
            </>
          }
          value={bedrooms}
          label="Bedrooms"
        />

        {/* Bathrooms */}
        <StatCard
          icon={
            <>
              <path d="M9 6a3 3 0 1 0 6 0"/>
              <path d="M3 12h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z"/>
            </>
          }
          value={bathrooms}
          label="Bathrooms"
        />

        {/* Area */}
        <StatCard
          icon={
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          }
          value={area}
          label={areaUnit}
        />
      </div>
    </div>
  );
});

export default PropertyStats;
