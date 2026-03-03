
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RecentActivity Component
 * Shows recent user activities
 */
const RecentActivity = memo(() => {
  const navigate = useNavigate();

  // Sample activities
  const activities = [
    {
      id: 1,
      type: 'tour_confirmed',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      iconColor: 'bg-green-50 text-green-600',
      title: 'Tour Confirmed',
      subtitle: 'Modern Executive Villa in Kabulonga',
      timestamp: 'about 2 years ago',
      route: '/activity?tab=tours'
    },
    {
      id: 2,
      type: 'message_sent',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
      iconColor: 'bg-blue-50 text-blue-600',
      title: 'Message Sent',
      subtitle: 'To Sarah Mulenga about viewing',
      timestamp: 'about 2 years ago',
      route: '/activity?tab=messages'
    },
    {
      id: 3,
      type: 'inquiry_submitted',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      iconColor: 'bg-gray-50 text-gray-600',
      title: 'Inquiry Submitted',
      subtitle: 'Family Home in Ibex Hill',
      timestamp: 'about 2 years ago',
      route: '/activity?tab=inquiries'
    },
    {
      id: 4,
      type: 'tour_requested',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      iconColor: 'bg-amber-50 text-amber-600',
      title: 'Tour Requested',
      subtitle: 'Modern Executive Villa in Kabulonga',
      timestamp: 'about 2 years ago',
      route: '/activity?tab=tours'
    },
    {
      id: 5,
      type: 'property_saved',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      iconColor: 'bg-red-50 text-red-500',
      title: 'Property Saved',
      subtitle: 'Luxury Penthouse at Roma Park',
      timestamp: 'about 2 years ago',
      route: '/saved'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
          Recent Activity
        </h2>
        <button
          onClick={() => navigate('/activity')}
          className="text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors font-['DM_Sans',sans-serif]"
        >
          View All
        </button>
      </div>
      <div className="px-1 py-2 bg-white border-t border-gray-100 rounded-2xl mb-6 shadow-xl">

      {/* Activity List */}
      <div className="space-y-2 ">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => navigate(activity.route)}
            className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group"
          >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-full ${activity.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 text-left">
              <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] ">
                {activity.title}
              </h3>
              <p className="text-[13px] text-gray-600 font-['DM_Sans',sans-serif] mb-1">
                {activity.subtitle}
              </p>
              <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
                {activity.timestamp}
              </p>
            </div>

            {/* Chevron */}
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
    </div>
  );
});

RecentActivity.displayName = 'RecentActivity';

export default RecentActivity;
