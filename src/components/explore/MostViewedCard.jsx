
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeartBtn from "../ui/HeartBtn";

const MostViewedCard = memo(({ 
  id, 
  price, 
  title, 
  location, 
  beds, 
  baths, 
  area, 
  tag, 
  img,
  images,
  owner,       
  viewCount = 0 
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const formatViewCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const isForSale = tag === "For Sale";
  const displayImage = images?.[0] || img;
  
  return (
    <div
      onClick={handleClick}
      className="group relative flex-shrink-0 w-[340px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.02]"
    >
      {/* Image with Gradient Overlay */}
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Gradient Overlay - Bottom to Top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* View Count Badge - Top Left */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg z-10">
          <svg className="w-4 h-4 text-secondary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span className="text-[13px] font-bold text-gray-900 font-myriad">
            {formatViewCount(viewCount)}
          </span>
        </div>

        {/* Fire Badge - Top Right (Most Viewed Indicator) */}
        <div className="absolute top-4 right-14 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg z-10 animate-pulse">
          <span className="text-[13px] font-bold text-white font-myriad">
            🔥 HOT
          </span>
        </div>

        {/* Heart Button */}
        <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
          <HeartBtn size="md" propertyId={id} />
        </div>

        {/* Price & Tag - Overlaid on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full font-myriad ${
              isForSale ? "bg-white/90 text-primary" : "bg-white/90 text-primary"
            }`}>
              {tag}
            </span>
          </div>
          <p className="text-[28px] font-bold text-white font-myriad drop-shadow-lg">
            {price}
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 py-4 bg-gradient-to-br from-white to-gray-50">
        <p className="text-[17px] font-bold text-primary font-myriad line-clamp-1 mb-1">
          {title}
        </p>

        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-3.5 h-3.5 text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-[14px] text-gray-600 font-myriad font-medium line-clamp-1">
            {location}
          </p>
        </div>

        {/* Specs - Horizontal */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
          {beds && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7M2 15h20M5 15v-3M19 15v-3" />
              </svg>
              <span className="text-[13px] text-gray-600 font-medium font-myriad">{beds}</span>
            </div>
          )}
          {baths && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4zM6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6" />
              </svg>
              <span className="text-[13px] text-gray-600 font-medium font-myriad">{baths}</span>
            </div>
          )}
          {area && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <span className="text-[13px] text-gray-600 font-medium font-myriad">{area}</span>
            </div>
          )}
        </div>

        {/* Agent Name - Bottom */}
        {owner?.name && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-200">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-amber-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-gray-500 font-myriad">Listed by</p>
              <p className="text-[13px] text-gray-900 font-semibold font-myriad line-clamp-1">
                {owner.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
});

MostViewedCard.displayName = 'MostViewedCard';

export default MostViewedCard;
