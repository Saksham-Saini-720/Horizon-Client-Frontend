
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropertyImage from "../ui/PropertyImage";
import HeartBtn from "../ui/HeartBtn";

const FeaturedCard = memo(({ id, price, title, location, img, beds, baths, area, rating }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  return (
    <div
      onClick={handleClick}
      className="flex-shrink-0 w-72 cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl active:scale-[0.99] transition-all group mb-3"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-200">
        <PropertyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Heart button */}
        <div className="absolute top-2.5 right-2.5">
          <HeartBtn size="sm" propertyId={id} />
        </div>
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3">
        {/* Location + Rating row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 min-w-0">
            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p className="text-[12px] text-gray-500 font-myriad truncate">{location}</p>
          </div>
          {rating && (
            <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
              <svg className="w-3 h-3 text-secondary fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-[12px] font-semibold text-primary font-myriad">{rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <p className="text-[15px] font-semibold text-primary font-myriad line-clamp-1 mb-1.5">
          {title}
        </p>

        {/* Specs */}
        {(beds || baths || area) && (
          <div className="flex items-center gap-2 mb-2">
            {beds && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-myriad">
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/>
                  <path d="M2 15h20"/><path d="M5 15v-3"/><path d="M19 15v-3"/>
                </svg>
                {beds}
              </span>
            )}
            {baths && (
              <>
                <span className="text-gray-300 text-[10px]">·</span>
                <span className="flex items-center gap-1 text-[11px] text-gray-500 font-myriad">
                  <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z"/>
                    <path d="M6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6"/>
                  </svg>
                  {baths}
                </span>
              </>
            )}
            {area && (
              <>
                <span className="text-gray-300 text-[10px]">·</span>
                <span className="text-[11px] text-gray-500 font-myriad">{area}</span>
              </>
            )}
          </div>
        )}

        {/* Price */}
        <p className="text-[16px] font-semibold text-primary font-myriad">
          {price}
        </p>
      </div>
    </div>
  );
});

FeaturedCard.displayName = 'FeaturedCard';
export default FeaturedCard;
