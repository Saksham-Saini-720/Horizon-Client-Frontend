
import { memo } from "react";
import { areaUnitLabel } from "../../config/areaUnits";

// Abbreviate large numbers for area display (e.g. 1900 → 1.9k).
//
// Only the number is abbreviated; the unit is the StatCard's label, and it
// comes from the registry rather than a local guess. This used to be a second
// `formatArea` that shadowed the shared one and read units differently from it.
const abbreviateArea = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num) || num === 0) return '—';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  // Acre and hectare figures are small and often fractional — 4.6 acres must
  // not round to 5.
  return Number.isInteger(num) ? num.toString() : num.toFixed(1);
};

// Shadow only, no border. A 1px grey outline plus a shadow reads as two
// competing edges and flattens the tile; the design separates them from the
// page with elevation alone.
const StatCard = memo(({ icon, value, label }) => (
  <div className="flex-1 bg-white rounded-2xl py-4 px-2 flex flex-col items-center justify-center shadow-card-sm">
    <div className="mb-2 text-primary-light">
      {icon}
    </div>
    <p className="text-[22px] font-semibold text-secondary font-display mb-0.5">
      {value}
    </p>
    <p className="text-[10px] text-gray-400 font-myriad uppercase tracking-widest">
      {label}
    </p>
  </div>
));

StatCard.displayName = 'StatCard';

const PropertyStats = memo(({ bedrooms, bathrooms, area, areaUnit }) => {
  const unitLabel = areaUnitLabel(areaUnit, 2) ?? 'Area';
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
          value={abbreviateArea(area)}
          label={unitLabel}
        />

      </div>
    </div>
  );
});

PropertyStats.displayName = 'PropertyStats';
export default PropertyStats;
