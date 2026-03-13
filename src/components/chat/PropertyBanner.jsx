// src/components/chat/PropertyBanner.jsx
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PropertyBanner
 * Property info card displayed at the top of a conversation
 * Matches screenshot - shows image, title, location, For Sale/Rent badge
 */
const PropertyBanner = memo(({ property }) => {
  const navigate = useNavigate();

  if (!property) return null;

  const badge = property.purpose === 'rent' ? 'For Rent' : 'For Sale';
  const badgeColor = property.purpose === 'rent' ? 'bg-blue-500' : 'bg-[#1C2A3A]';

  return (
    <button
      onClick={() => property.id && navigate(`/property/${property.id}`)}
      className="w-full flex items-center gap-3 mx-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.99] transition-all"
      style={{ width: 'calc(100% - 32px)' }}
    >
      {/* Property thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = '#E5E7EB';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Property info */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] truncate">
          {property.title}
        </p>
        <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] truncate">
          {property.location}
        </p>
      </div>

      {/* Badge */}
      <span className={`${badgeColor} text-white text-[11px] font-semibold font-['DM_Sans',sans-serif] px-2.5 py-1 rounded-lg flex-shrink-0`}>
        {badge}
      </span>
    </button>
  );
});

PropertyBanner.displayName = 'PropertyBanner';

export default PropertyBanner;
