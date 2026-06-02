import { memo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEnquiries } from '../hooks/activity/useEnquiries';
import { useTours } from '../hooks/activity/useTours';
import StatsCard from '../components/activity/StatsCard';
import InquiriesTab from '../components/activity/InquiriesTab';
import ToursTab from '../components/activity/ToursTab';
import MessagesTab from '../components/activity/MessagesTab';

const ActivityPage = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.tab ?? 'inquiries');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(location.pathname, { replace: true, state: { tab: tabId } });
  };

  const { data: enquiries = [] } = useEnquiries();
  const { data: tours = [] }     = useTours();

  const inquiriesCount      = enquiries.length;
  const toursCount          = tours.filter(t => t.status !== 'cancelled').length;
  const cancelledToursCount = tours.filter(t => t.status === 'cancelled').length;

  const stats = [
    {
      id: 'inquiries',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: 'Inquiries',
      count: inquiriesCount,
      glowColor: 'rgba(139, 92, 246, 0.55)',
      iconColor: '#a78bfa',
      iconBg:    'rgba(139, 92, 246, 0.18)',
    },
    {
      id: 'tours',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      label: 'Tours',
      count: toursCount,
      glowColor: 'rgba(201, 108, 56, 0.55)',
      iconColor: '#fb923c',
      iconBg:    'rgba(201, 108, 56, 0.18)',
    },
    {
      id: 'cancelled',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      label: 'Cancelled',
      count: cancelledToursCount,
      glowColor: 'rgba(239, 68, 68, 0.55)',
      iconColor: '#f87171',
      iconBg:    'rgba(239, 68, 68, 0.18)',
    },
  ];

  const tabs = [
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'tours',     label: 'Tours'     },
    { id: 'messages',  label: 'Messages'  },
  ];

  return (
    <div className="min-h-screen pb-24 bg-white">

      {/* ── Sticky premium header ── */}
      <div
        className="sticky top-0 z-50 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #141852 0%, #2D368E 55%, #1b2470 100%)',
          borderRadius: '0 0 28px 28px',
          boxShadow: '0 8px 40px rgba(45, 54, 142, 0.45), 0 2px 0 rgba(255,255,255,0.06) inset',
        }}
      >
        {/* Ambient glow orb – top right */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-40px', right: '-40px',
            width: '180px', height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        {/* Ambient glow orb – bottom left */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-30px', left: '-30px',
            width: '140px', height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Decorative arc rings (top-right corner) */}
        <svg
          className="absolute top-0 right-0 pointer-events-none"
          width="160" height="140"
          viewBox="0 0 160 140"
          style={{ opacity: 0.12 }}
        >
          <circle cx="145" cy="15" r="70"  fill="none" stroke="white" strokeWidth="1" />
          <circle cx="145" cy="15" r="95"  fill="none" stroke="white" strokeWidth="0.6" />
          <circle cx="145" cy="15" r="120" fill="none" stroke="white" strokeWidth="0.4" />
        </svg>

        {/* Decorative arc rings (bottom-left corner) */}
        <svg
          className="absolute bottom-0 left-0 pointer-events-none"
          width="100" height="80"
          viewBox="0 0 100 80"
          style={{ opacity: 0.08 }}
        >
          <circle cx="0" cy="80" r="60"  fill="none" stroke="white" strokeWidth="0.8" />
          <circle cx="0" cy="80" r="85"  fill="none" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Title */}
        <div className="relative px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            {/* Glowing accent bar */}
            <div
              className="w-[3px] h-5 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #c084fc, #818cf8)',
                boxShadow: '0 0 10px rgba(192,132,252,0.9), 0 0 20px rgba(129,140,248,0.5)',
              }}
            />
            <h1 className="text-[24px] font-bold text-white font-display tracking-wide">
              Activity
            </h1>
            <span className="text-[11px] font-display italic ml-1" style={{ color: 'rgba(196,210,255,0.55)' }}>
              Manage your property interactions
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="relative px-3 pb-2">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <StatsCard
                key={stat.id}
                icon={stat.icon}
                label={stat.label}
                count={stat.count}
                glowColor={stat.glowColor}
                iconColor={stat.iconColor}
                iconBg={stat.iconBg}
              />
            ))}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="relative px-5">
          <div
            className="absolute top-0 left-5 right-5 h-px"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          <div className="flex gap-7 pt-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative pb-3 text-[14px] font-semibold font-myriad transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'hover:text-blue-200'
                }`}
                style={{
                  color: activeTab === tab.id ? '#fff' : 'rgba(148,172,255,0.45)',
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #c084fc, #818cf8)',
                      boxShadow: '0 0 6px rgba(192,132,252,1), 0 0 14px rgba(129,140,248,0.6)',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="px-4 py-5">
        {activeTab === 'inquiries' && <InquiriesTab />}
        {activeTab === 'tours'     && <ToursTab />}
        {activeTab === 'messages'  && <MessagesTab />}
      </div>
    </div>
  );
});

ActivityPage.displayName = 'ActivityPage';
export default ActivityPage;
