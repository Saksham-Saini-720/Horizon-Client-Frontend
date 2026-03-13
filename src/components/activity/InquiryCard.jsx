
import { memo, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';


/**
 * InquiryCard Component
 * Displays individual inquiry with property, message, and agent info
 */
const InquiryCard = memo(({ inquiry }) => {
  const navigate = useNavigate();
  const { property, message, agent, status, timestamp } = inquiry;
  console.log("Rendering InquiryCard for property:", property);


  // Status badge config
  const statusConfig = {
    'in-progress': {
      label: 'In Progress',
      color: 'text-amber-600 bg-amber-50'
    },
    'submitted': {
      label: 'Submitted',
      color: 'text-blue-600 bg-blue-50'
    }
  };

  const currentStatus = statusConfig[status] || statusConfig['submitted'];

  // Navigate to property details
  const handlePropertyClick = useCallback(() => {
    navigate(`/property/${property.id}`);
  }, [navigate, property.id]);

  // console.log(property)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md hover:shadow-xl transition-all">
      {/* Property Header */}
      <div
        onClick={handlePropertyClick}
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {/* Property Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={property.img}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 mb-2">
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
          <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
            {property.price}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['DM_Sans',sans-serif] ${currentStatus.color}`}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
            {currentStatus.label}
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="px-5 pb-4 ">
        <p className="text-[13px] bg-gray-100 rounded-md py-2 px-3 text-gray-500 font-['DM_Sans',sans-serif] italic leading-relaxed">
          {message}
        </p>
      </div>

      {/* Agent Info */}
      <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Agent Photo */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[16px] font-bold font-['DM_Sans',sans-serif]">
            {agent.avatar ? <img className='w-8 h-8 rounded-full object-cover' src = {agent.avatar}/> : agent.name.charAt(0)}
          </div>

          {/* Agent Details */}
          <div>
            <p className="text-[12px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              {agent.name}
            </p>
            <p className="text-[10px] text-gray-500 font-['DM_Sans',sans-serif]">
              {agent.role}agent
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
          {timestamp}
        </p>
      </div>
      
    </div>
  );
});

InquiryCard.displayName = 'InquiryCard';

export default InquiryCard;
