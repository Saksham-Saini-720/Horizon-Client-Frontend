
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * TourCard Component
 * Displays individual tour with confirmed/pending status
 */
const TourCard = memo(({ tour }) => {
  const navigate = useNavigate();
  const { property, status, visitType, date, time, agent, proposedTimes } = tour;

  // Status banner config
  const statusConfig = {
    'confirmed': {
      label: 'Confirmed',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      color: 'bg-green-50 border-green-200'
    },
    'pending': {
      label: 'Pending',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: 'bg-amber-50 border-amber-200'
    }
  };

  // Visit type config
  const visitTypeConfig = {
    'in-person': {
      label: 'In Person',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    'virtual': {
      label: 'Virtual',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      )
    }
  };

  const currentStatus = statusConfig[status];
  const currentVisitType = visitTypeConfig[visitType];

  // Navigate to property details
  const handlePropertyClick = useCallback(() => {
    navigate(`/property/${property.id}`);
  }, [navigate, property.id]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-all">
      {/* Status Banner */}
      <div className={`px-5 py-2 border-b ${currentStatus.color} flex items-center justify-between`}>
        <div className={`flex items-center gap-2 ${status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}>
          {currentStatus.icon}
          <span className="text-[12px] font-bold font-['DM_Sans',sans-serif]">
            {currentStatus.label}
          </span>
        </div>

        <div className={`flex items-center gap-2 ${status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}>
          {currentVisitType.icon}
          <span className="text-[12px] font-semibold font-['DM_Sans',sans-serif]">
            {currentVisitType.label}
          </span>
        </div>
      </div>

      {/* Property Info */}
      <div
        onClick={handlePropertyClick}
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {/* Property Image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={property.img}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px]  text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-[11px] text-gray-500 font-['DM_Sans',sans-serif]">
              {property.location}
            </p>
          </div>
        </div>
      </div>

      {/* Date/Time or Proposed Times */}
      {status === 'confirmed' ? (
        <div className="mx-5 mb-5 px-4 py-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              {date}
            </p>
            <p className="text-[12px] text-gray-600 font-['DM_Sans',sans-serif]">
              at {time}
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-5 mb-5">
          <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] mb-2">
            Proposed times:
          </p>
          <div className="flex flex-wrap gap-2">
            {proposedTimes?.map((time, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-lg bg-amber-50 text-[12px] font-medium text-amber-600 font-['DM_Sans',sans-serif]"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Agent Info */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Agent Photo */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[16px] font-bold font-['DM_Sans',sans-serif]">
            {agent.avatar ? (
              <img 
                src={agent.avatar}
                alt={agent.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{agent.name}</span>
            )}
          </div>

          {/* Agent Name */}
          <p className="text-[12px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
            {agent.name}
          </p>
        </div>

        {(
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg
              className="w-4 h-4 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif]">
              Contact
            </span>
          </button>
        )}
      </div>
    </div>
  );
});

TourCard.displayName = 'TourCard';

export default TourCard;
