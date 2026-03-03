
import { memo } from 'react';

/**
 * StatsCard Component
 * Displays stat card with icon, label, and count
 */
const StatsCard = memo(({ icon, label, count, color }) => {
  return (
    <div className="bg-white rounded-2xl py-3 px-3 border border-gray-100 shadow-md hover:border-gray-200 transition-all hover:shadow-xl">
      <div className="flex items-center gap-2 ">
        <div className={`${color}`}>
          {icon}
        </div>
        <span className="text-[13px] font-medium text-gray-600 font-['DM_Sans',sans-serif]">
          {label}
        </span>
      </div>
      <p className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
        {count}
      </p>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
