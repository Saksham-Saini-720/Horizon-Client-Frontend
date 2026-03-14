import { memo, useState } from 'react';
import { useEnquiries } from '../hooks/activity/useEnquiries';
import { useTours } from '../hooks/activity/useTours';
import { useConversations } from '../hooks/conversations/useConversations';
import StatsCard from '../components/activity/StatsCard';
import InquiriesTab from '../components/activity/InquiriesTab';
import ToursTab from '../components/activity/ToursTab';
import MessagesTab from '../components/activity/MessagesTab';

const ActivityPage = memo(() => {
  const [activeTab, setActiveTab] = useState('inquiries');

  const { data: enquiries = [] }                    = useEnquiries();
  const { data: tours = [] }                        = useTours();
  const { conversations = [], total: convTotal = 0 } = useConversations();

  const inquiriesCount = enquiries.length;
  const toursCount     = tours.length;
  const messagesCount  = convTotal || conversations.length; 

  const stats = [
    {
      id: 'inquiries',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: 'Inquiries',
      count: inquiriesCount,
      color: 'text-gray-600',
    },
    {
      id: 'tours',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      label: 'Tours',
      count: toursCount,
      color: 'text-amber-500',
    },
    {
      id: 'chats',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      label: 'Chats',
      count: messagesCount,
      color: 'text-green-500',
    },
  ];

  const tabs = [
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'tours',     label: 'Tours'     },
    { id: 'messages',  label: 'Messages'  },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gray-100">
      <div className='bg-gray-100 border-b-2 border-gray-300'>
        <div className="border-b border-gray-100 px-4 pt-4">
          <h1 className="text-[24px] font-black text-primary font-playfair mb-1">Activity</h1>
          <p className="text-[14px] text-gray-500 font-inter">Manage your property interactions</p>
        </div>

        <div className="px-3 py-3 rounded-2xl mb-3">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <StatsCard key={stat.id} icon={stat.icon} label={stat.label} count={stat.count} color={stat.color} />
            ))}
          </div>
        </div>

        <div className="px-6">
          <div className="flex gap-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-[14px] font-semibold font-inter transition-colors ${
                  activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {activeTab === 'inquiries' && <InquiriesTab />}
        {activeTab === 'tours'     && <ToursTab />}
        {activeTab === 'messages'  && <MessagesTab />}
      </div>
    </div>
  );
});

ActivityPage.displayName = 'ActivityPage';
export default ActivityPage;
