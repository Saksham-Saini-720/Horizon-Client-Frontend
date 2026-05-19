
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavePropertyMutation } from '../../hooks/properties/useSavedProperties';
import PropertyImage from '../ui/PropertyImage';

const SavedPropertyCard = memo(({ property }) => {
  const navigate = useNavigate();
  const { unsaveProperty } = useSavePropertyMutation();

  const { id, price, rawPrice, title, location, beds, baths, area, tag, img } = property;

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    unsaveProperty({ propertyId: id });
  }, [unsaveProperty, id]);

  const specs = [beds, baths, area].filter(Boolean);
  const specsText = specs.join('  ·  ');

  const isForSale = tag === 'For Sale';

  // Currency symbol from formatted price string
  const priceParts = price?.split(' ') || [];
  const currencySymbol = priceParts.length > 1 ? priceParts[0] : '';

  // Format raw price as K (e.g. 1250000 → 1,250k)
  const priceK = rawPrice != null && rawPrice >= 1000
    ? (rawPrice / 1000).toLocaleString('en-US') + 'k'
    : rawPrice != null
      ? rawPrice.toLocaleString('en-US')
      : priceParts.slice(1).join(' ');

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-slate-200 border-[1px] border-slate-200 shadow-md hover:shadow-md transition-shadow cursor-pointer flex items-center gap-3 p-3"
    >
      {/* ── Left: Square Image ── */}
      <div className="w-[100px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <PropertyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Centre: Info ── */}
      <div className="flex-1 min-w-0">

        {/* Tag pill */}
        {tag && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium font-myriad uppercase -tracking-tighter mb-1 ${
              isForSale ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-[#C96C38]'
            }`}
          >
            {tag}
          </span>
        )}

        {/* Price */}
        <p className="text-[22px] font-semibold text-secondary font-display leading-tight mb-0.5">
          <span className="text-[10px]  text-gray-500 font-semibold mr-0.5">{currencySymbol}</span>
          {priceK}
        </p>

        {/* Location · Title */}
        <p className="text-[12px] text-gray-500 font-medium font-display italic truncate mb-1">
          {location}{title ? ` · ${title}` : ''}
        </p>

        {/* Bed · Bath · Sqft */}
        {specsText ? (
          <p className="text-[12px] text-gray-400 tracking-wider font-myriad whitespace-pre">
            {specsText}
          </p>
        ) : null}
      </div>

      {/* ── Right: Heart / Unsave ── */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform mb-11 active:scale-90 hover:scale-110"
        style={{
          background: '#C96C38',
          boxShadow: '0 0 10px 3px rgba(201, 108, 56, 0.4)',
        }}
        aria-label="Remove from saved"
      >
        <svg className="w-[12px] h-[12px] text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
});

SavedPropertyCard.displayName = 'SavedPropertyCard';

export default SavedPropertyCard;
