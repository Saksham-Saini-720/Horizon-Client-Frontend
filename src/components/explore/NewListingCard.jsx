
import { memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeartBtn from "../ui/HeartBtn";

// ─── Small spec item (Beds / Baths / Area) ───────────────────────────────────

const SpecItem = ({ label, children }) => (
  <span className="flex items-center gap-1.5 text-[12px] text-gray-600 font-myriad">
    <svg className="w-4 h-4 text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {children}
    </svg>
    <span className="font-semibold">{label}</span>
  </span>
);

// ─── Premium Mini Carousel with Auto-scroll ──────────────────────────────────

const MiniCarousel = memo(({ images = [], title = "Property" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!images || images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [images, isHovered]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  // const goToPrevious = (e) => {
  //   e.stopPropagation();
  //   setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  // };

  // const goToNext = (e) => {
  //   e.stopPropagation();
  //   setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  // };

  return (
    <div 
      className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <img
              src={image}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Premium overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Enhanced */}
      {images.length > 1 && (
        <>
          

          

          {/* Image Counter - Enhanced */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md shadow-lg z-10 border border-white/10">
            <span className="text-white text-[13px] font-bold font-myriad">
              {currentIndex + 1}/{images.length}
            </span>
          </div>

          {/* Dot Indicators - Enhanced */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? "w-6 h-2 bg-white shadow-lg" 
                    : "w-2 h-2 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Auto-scroll indicator */}
      {/* {!isHovered && images.length > 1 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md z-10 animate-pulse">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-[10px] font-semibold font-myriad">
              {/* Auto *
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
});

MiniCarousel.displayName = 'MiniCarousel';

// ─── Premium NewListingCard ──────────────────────────────────────────────────

const NewListingCard = memo(({ id, price, title, location, beds, baths, area, tag, img, images, owner }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const isForSale = tag === "For Sale";
  const imagesToShow = (images && images.length > 0) ? images : (img ? [img] : []);
  
  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Premium border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Image Carousel */}
      <div className="relative bg-gray-100 overflow-hidden">
        <MiniCarousel images={imagesToShow} title={title} />

        {/* For Sale / For Rent tag - Enhanced */}
        <span className={`absolute top-4 left-4 text-[12px] font-bold px-3.5 py-1.5 rounded-full font-myriad z-20 shadow-lg backdrop-blur-sm transition-all duration-300 ${
          isForSale 
            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white" 
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        }`}>
          {tag}
        </span>

        {/* Heart Button - Enhanced */}
        <div className="absolute top-4 right-4 z-20 transform transition-transform duration-300 hover:scale-110" onClick={(e) => e.stopPropagation()}>
          <HeartBtn size="md" propertyId={id} />
        </div>
      </div>

      {/* Info Section - Premium Design */}
      <div className="px-5 pt-4 pb-5 bg-gradient-to-br from-white to-gray-50/50">
        {/* Price - Enhanced */}
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-[28px] font-bold text-black font-myriad">
            {price}
          </p>
          {isHovered && (
            <span className="text-[12px] text-green-600 font-semibold animate-pulse">
              View Details →
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-[17px] font-bold text-gray-900 font-myriad line-clamp-1 mb-2">
          {title}
        </p>

        {/* Location - Enhanced */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-secondary to-amber-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <p className="text-[14px] text-gray-600 font-myriad font-medium line-clamp-1">
            {location}
          </p>
        </div>

        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

        {/* Specs - Premium Layout */}
        <div className="flex items-center gap-5 mb-4">
          <SpecItem label={beds || "0"}>
            <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7M2 15h20M5 15v-3M19 15v-3" />
          </SpecItem>

          <SpecItem label={baths || "0"}>
            <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4zM6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6" />
          </SpecItem>

          <SpecItem label={area || "N/A"}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </SpecItem>
        </div>

        {/* Agent Section - Premium Design */}
        <div className="flex items-center gap-2.5 pt-4 border-t border-gray-200">
          {owner?.name ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary via-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-500 font-myriad font-medium">Listed by</p>
                <p className="text-[14px] text-gray-900 font-bold font-myriad line-clamp-1">
                  {owner.name}
                </p>
              </div>
              {isHovered && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center animate-bounce">
                    <svg className="w-3 h-3 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 font-myriad font-medium">Listed by</p>
                <p className="text-[14px] text-gray-400 font-myriad line-clamp-1">Agent Not Assigned</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
});

NewListingCard.displayName = 'NewListingCard';

export default NewListingCard;
