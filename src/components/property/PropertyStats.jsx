
import { memo } from "react";

// Abbreviate large numbers for area display (e.g. 1900 → 1.9k)
const formatArea = (val) => {
  const num = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(num) || num === 0) return val || '—';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const StatCard = memo(({ icon, value, label }) => (
  <div className="flex-1 bg-white rounded-2xl py-4 px-2 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
    <div className="mb-2 text-primary-light">
      {icon}
    </div>
    <p className="text-[20px] font-bold text-primary font-myriad mb-0.5">
      {value}
    </p>
    <p className="text-[10px] text-gray-400 font-myriad uppercase tracking-widest">
      {label}
    </p>
  </div>
));

StatCard.displayName = 'StatCard';

const PropertyStats = memo(({ bedrooms, bathrooms, area }) => {
  return (
    <div className="px-5 pb-5">
      <div className="flex gap-3">

        {/* Bedrooms */}
        <StatCard
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9V19" />
              <path d="M22 9V19" />
              <path d="M2 14h20" />
              <path d="M6 14V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5" />
              <path d="M6 9H2" />
              <path d="M22 9h-4" />
            </svg>
          }
          value={bedrooms ?? '—'}
          label="Beds"
        />

        {/* Bathrooms */}
        <StatCard
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6a3 3 0 1 0 0-6" />
              <path d="M3 13h18v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5z" />
              <path d="M3 13V9" />
            </svg>
          }
          value={bathrooms ?? '—'}
          label="Baths"
        />

        {/* Area / Sqft */}
        <StatCard
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="13" y="3" width="8" height="8" rx="1" />
              <rect x="3" y="13" width="8" height="8" rx="1" />
              <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>
          }
          value={formatArea(area)}
          label="Sqft"
        />

      </div>
    </div>
  );
});

PropertyStats.displayName = 'PropertyStats';
export default PropertyStats;
