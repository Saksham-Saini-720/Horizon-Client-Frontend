
import { memo } from 'react';

const QuickAccessGrid = memo(({ savedCount, toursCount, inboxCount, onNavigate }) => {
  const stats = [
    { label: 'SAVED',  count: savedCount,  route: '/saved' },
    { label: 'TOURS',  count: toursCount,  route: '/inquiries' },
    { label: 'INBOX',  count: inboxCount,  route: '/chat' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-stretch overflow-hidden">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex-1 flex items-stretch">
          {index > 0 && (
            <div className="flex items-center">
              <div className="w-px h-10 bg-gray-300" />
            </div>
          )}
          <button
            onClick={() => stat.route && onNavigate(stat.route)}
            className="flex-1 flex flex-col items-center py-5 active:bg-gray-50 transition-colors"
          >
            <span className="text-[26px] font-semibold text-secondary font-display leading-none mb-[7px]">
              {stat.count}
            </span>
            <span className="text-[11px] font-medium text-gray-400 font-myriad tracking-widest">
              {stat.label}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
});

QuickAccessGrid.displayName = 'QuickAccessGrid';
export default QuickAccessGrid;
