
import { memo, useMemo } from 'react';
import { useEnquiries } from '../../hooks/activity/useEnquiries';
import { useTours } from '../../hooks/activity/useTours';
import { useConversations } from '../../hooks/conversations/useConversations';

const RecentActivity = memo(() => {


  const { data: enquiries = [] }        = useEnquiries();
  const { data: tours = [] }            = useTours();
  const { conversations = [] }          = useConversations();

  // Build unified activity list sorted by date
  const activities = useMemo(() => {
    const list = [];

    // Enquiries
    enquiries.forEach(e => {
      list.push({
        id:        'enq-' + e.id,
        type:      'inquiry_submitted',
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        ),
        iconColor: 'bg-gray-50 text-gray-600',
        title:     'Inquiry Submitted',
        subtitle:  e.property?.title || 'Property',
        timestamp: e.timestamp || 'Recently',
        createdAt: e.createdAt,
        route:     '/activity',
      });
    });

    // Tours
    tours.forEach(t => {
      const isConfirmed = t.status === 'confirmed';
      list.push({
        id:        'tour-' + t.id,
        type:      isConfirmed ? 'tour_confirmed' : 'tour_requested',
        icon: isConfirmed ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        ),
        iconColor: isConfirmed ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-secondary',
        title:     isConfirmed ? 'Tour Confirmed' : 'Tour Requested',
        subtitle:  t.property?.title || 'Property',
        timestamp: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
        createdAt: t.createdAt,
        route:     '/activity',
      });
    });

    // Messages / Conversations
    conversations.slice(0, 3).forEach(c => {
      list.push({
        id:        'msg-' + c.id,
        type:      'message_sent',
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        ),
        iconColor: 'bg-blue-50 text-blue-600',
        title:     'Message Sent',
        subtitle:  c.property?.title ? `About: ${c.property.title}` : `To: ${c.participant?.name || 'Agent'}`,
        timestamp: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
        createdAt: c.lastMessageAt,
        route:     `/chat/${c.id}`,
      });
    });

    // Sort by date — newest first
    list.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list.slice(0, 5); // Show max 5
  }, [enquiries, tours, conversations]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-semibold text-primary font-myriad">Recent Activity</h2>
        {/* <button onClick={() => navigate('/activity')} className="text-[12px] font-semibold text-accent hover:text-accent-dark transition-colors font-myriad">
          View All
        </button> */}
      </div>

      <div className="px-1 py-2 bg-white border-t border-gray-100 rounded-2xl mb-6 shadow-xl">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-[15px] text-gray-400 font-myriad">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <button
                key={activity.id}
                // onClick={() => navigate(activity.route)}
                className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <div className={`w-9 h-9 rounded-full ${activity.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {activity.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[15px] font-semibold text-primary font-myriad">{activity.title}</h3>
                  <p className="text-[15px] text-gray-600 font-myriad mb-1">{activity.subtitle}</p>
                  <p className="text-[12px] text-gray-400 font-myriad">{activity.timestamp}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

RecentActivity.displayName = 'RecentActivity';
export default RecentActivity;
