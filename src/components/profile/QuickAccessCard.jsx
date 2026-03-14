
import { memo, useCallback } from 'react';

/**
 * QuickAccessCard Component
 */
const QuickAccessCard = memo(({ icon, label, count, timestamp, onClick, iconColor }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl p-4 border shadow-md border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all active:scale-[0.98] text-left"
  >
    {/* Icon */}
    <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center mb-4`}>
      {icon}
    </div>

    {/* Count */}
    <p className="text-[25px] font-black text-primary font-playfair mb-1">
      {count}
    </p>

    {/* Label */}
    <p className="text-[14px] font-medium text-gray-600 font-inter mb-2">
      {label}
    </p>

    {/* Timestamp */}
    <p className="text-[11px] text-gray-400 font-inter">
      {timestamp}
    </p>
  </button>
));

QuickAccessCard.displayName = 'QuickAccessCard';

/**
 * QuickAccessGrid Component
 * 4-card grid for quick navigation
 */
const QuickAccessGrid = memo(({ savedCount, inquiriesCount, toursCount, messagesCount, onNavigate }) => {
  const cards = [
    {
      id: 'saved',
      icon: (
        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      label: 'Saved Properties',
      count: savedCount,
      timestamp: 'Updated about 2 years ago',
      iconColor: 'bg-red-50',
      route: '/saved'
    },
    {
      id: 'inquiries',
      icon: (
        <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: 'My Inquiries',
      count: inquiriesCount,
      timestamp: 'Updated about 2 years ago',
      iconColor: 'bg-gray-100',
      route: '/activity?tab=inquiries'
    },
    {
      id: 'tours',
      icon: (
        <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      label: 'Tour Requests',
      count: toursCount,
      timestamp: 'Updated about 2 years ago',
      iconColor: 'bg-amber-50',
      route: '/activity?tab=tours'
    },
    {
      id: 'messages',
      icon: (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      label: 'Conversations',
      count: messagesCount,
      timestamp: 'Updated about 2 years ago',
      iconColor: 'bg-green-50',
      route: '/activity?tab=messages'
    }
  ];

  const handleCardClick = useCallback((route) => {
    onNavigate(route);
  }, [onNavigate]);

  return (
    <div>
      <h2 className="text-[16px] font-black text-primary font-playfair mb-3 mt-6">
        Quick Access
      </h2>
      <div className=" mb-6">

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <QuickAccessCard
            key={card.id}
            icon={card.icon}
            label={card.label}
            count={card.count}
            timestamp={card.timestamp}
            iconColor={card.iconColor}
            onClick={() => handleCardClick(card.route)}
          />
        ))}
      </div>
    </div>
    </div>
  );
});

QuickAccessGrid.displayName = 'QuickAccessGrid';

export default QuickAccessGrid;
