
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavePropertyMutation } from '../../hooks/properties/useSavedProperties';
import PropertyImage from '../ui/PropertyImage';

const SavedPropertyCard = memo(({ property }) => {
  const navigate = useNavigate();
  const { unsaveProperty } = useSavePropertyMutation();

  const { id, price, title, location, beds, baths, area, tag, img } = property;

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    unsaveProperty({ propertyId: id });
  }, [unsaveProperty, id]);

  // Join whichever spec fields exist — show raw values to avoid silent regex failures
  const specs = [beds, baths, area].filter(Boolean);
  const specsText = specs.join(' · ');

  const isForSale = tag === 'For Sale';

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-3 p-3"
    >
      {/* ── Left: Square Image ── */}
      <div className="w-[90px] h-[90px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
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
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-myriad uppercase tracking-wide mb-1.5 ${
              isForSale ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-[#C96C38]'
            }`}
          >
            {tag}
          </span>
        )}

        {/* Price */}
        <p className="text-[18px] font-bold text-primary font-myriad leading-tight mb-0.5">
          {price}
        </p>

        {/* Location · Title */}
        <p className="text-[13px] text-gray-500 font-myriad truncate mb-1">
          {location}{title ? ` · ${title}` : ''}
        </p>

        {/* Bed · Bath · Sqft */}
        {specsText ? (
          <p className="text-[12px] text-gray-400 font-myriad">
            {specsText}
          </p>
        ) : null}
      </div>

      {/* ── Right: Heart / Unsave ── */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 hover:scale-110"
        style={{ background: '#C96C38' }}
        aria-label="Remove from saved"
      >
        <svg className="w-[17px] h-[17px] text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
});

SavedPropertyCard.displayName = 'SavedPropertyCard';

export default SavedPropertyCard;
