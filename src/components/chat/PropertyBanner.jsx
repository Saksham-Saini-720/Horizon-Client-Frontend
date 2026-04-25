import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const formatLocation = (location) => {
  if (!location) return '';
  if (typeof location === 'string') return location;
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  return parts.join(', ') || location.address || '';
};

const PropertyBanner = memo(({ property }) => {
  const navigate = useNavigate();
  if (!property) return null;

  const badge = property.purpose === 'rent' ? 'For Rent' : 'For Sale';
  const badgeColor = property.purpose === 'rent'
    ? 'bg-secondary text-white'
    : 'bg-primary-light text-white';

  return (
    <button
      onClick={() => property.id && navigate(`/property/${property.id}`)}
      className="flex items-center gap-3 mx-4 px-3 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.99] transition-all"
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
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}
      </div>

      {/* Title + location */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[14px] font-bold text-primary font-myriad truncate">
          {property.title}
        </p>
        {formatLocation(property.location) && (
          <p className="text-[12px] text-gray-400 font-myriad truncate mt-0.5">
            {formatLocation(property.location)}
          </p>
        )}
      </div>

      {/* Badge + chevron */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`${badgeColor} text-[10px] font-bold font-myriad px-2.5 py-1 rounded-full tracking-wide uppercase`}>
          {badge}
        </span>
        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
});

PropertyBanner.displayName = 'PropertyBanner';
export default PropertyBanner;
