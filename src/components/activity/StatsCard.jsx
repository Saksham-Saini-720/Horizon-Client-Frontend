
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
        <span className="text-[15px] font-medium text-gray-600 font-myriad">
          {label}
        </span>
      </div>
      <p className="text-[20px] font-semibold text-primary font-myriad">
        {count}
      </p>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
