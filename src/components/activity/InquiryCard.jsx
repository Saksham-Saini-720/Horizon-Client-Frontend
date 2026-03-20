import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const formatLocation = (location) => {
  if (!location) return '';
  if (typeof location === 'string') return location;
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  return parts.join(', ') || location.address || '';
};

const InquiryCard = memo(({ inquiry }) => {
  const navigate = useNavigate();
  const { property, message, agent, status, timestamp } = inquiry;

  const statusConfig = {
    'in-progress': { label: 'In Progress', color: 'text-secondary bg-amber-50' },
    'submitted':   { label: 'Submitted',   color: 'text-blue-600 bg-blue-50'   },
  };
  const currentStatus = statusConfig[status] || statusConfig['submitted'];

    const handlePropertyClick = useCallback(() => {
      if (property?.id) {
        navigate(`/property/${property.id}`);
      }
    }, [navigate, property]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md hover:shadow-xl transition-all">

      {/* Property Header */}
      <div onClick={handlePropertyClick} className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
          {property?.img ? (
            <img src={property.img} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] text-primary font-myriad font-semibold mb-1 line-clamp-1">
            {property?.title}
          </h3>
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p className="text-[12px] text-gray-500 font-myriad">
              {formatLocation(property?.location)}
            </p>
          </div>
          <p className="text-[16px] font-semibold text-primary font-myriad">ZWM {property?.price}</p>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-myriad ${currentStatus.color}`}>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
          {currentStatus.label}
        </span>
      </div>

      {/* Message */}
      <div className="px-5 pb-4">
        <p className="text-[12px] bg-gray-100 rounded-md py-2 px-3 text-gray-500 font-myriad italic leading-relaxed">
          {message}
        </p>
      </div>

      {/* Agent Info */}
      <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center text-white text-[16px] font-semibold font-myriad overflow-hidden">
            {agent?.avatar
              ? <img className="w-8 h-8 rounded-full object-cover" src={agent.avatar} alt={agent.name} />
              : agent?.name?.charAt(0) || 'A'
            }
          </div>
          <div>
            <p className="text-[12px] font-semibold text-primary font-myriad">{agent?.name}</p>
            <p className="text-[10px] text-gray-500 font-myriad">{agent?.role || 'Property Agent'}</p>
          </div>
        </div>
        <p className="text-[12px] text-gray-400 font-myriad">{timestamp}</p>
      </div>
    </div>
  );
});

InquiryCard.displayName = 'InquiryCard';
export default InquiryCard;
