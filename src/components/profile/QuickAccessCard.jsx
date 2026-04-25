
import { memo } from 'react';

const QuickAccessGrid = memo(({ savedCount, toursCount, inboxCount, onNavigate }) => {
  const stats = [
    { label: 'SAVED',  count: savedCount,  route: '/saved' },
    { label: 'TOURS',  count: toursCount,  route: '/inquiries' },
    { label: 'INBOX',  count: inboxCount,  route: '/chat' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex overflow-hidden">
      {stats.map((stat, index) => (
        <button
          key={stat.label}
          onClick={() => stat.route && onNavigate(stat.route)}
          className={`flex-1 flex flex-col items-center py-5 active:bg-gray-50 transition-colors ${
            index < stats.length - 1 ? 'border-r border-gray-100' : ''
          }`}
        >
          <span className="text-[26px] font-bold text-secondary font-myriad leading-none mb-1">
            {stat.count}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 font-myriad tracking-widest">
            {stat.label}
          </span>
        </button>
      ))}
    </div>
  );
});

QuickAccessGrid.displayName = 'QuickAccessGrid';
export default QuickAccessGrid;
