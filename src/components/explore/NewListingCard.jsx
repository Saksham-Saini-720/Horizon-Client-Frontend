
import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeartBtn from "../ui/HeartBtn";

// ─── Small spec item (Beds / Baths / Area) ───────────────────────────────────

const SpecItem = ({ label, children }) => (
  <span className="flex items-center gap-1.5 text-[12px] text-gray-500 font-myriad">
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {children}
    </svg>
    {label}
  </span>
);

// ─── Mini Image Carousel (Always Visible Arrows) ─────────────────────────────

const MiniCarousel = memo(({ images = [], title = "Property" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
      {/* Images */}
      <div 
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${title} ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            loading="lazy"
          />
        ))}
      </div>

      {/* Navigation Arrows - ALWAYS VISIBLE if multiple images */}
      {images.length > 1 && (
        <>
          {/* Previous Button - Always Visible */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Next Button - Always Visible */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
            aria-label="Next image"
          >
            <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Image Counter - Bottom Right */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm z-10">
            <span className="text-white text-[12px] font-semibold font-myriad">
              {currentIndex + 1}/{images.length}
            </span>
          </div>

          {/* Dot Indicators - Bottom Center */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? "bg-white w-4" 
                    : "bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

MiniCarousel.displayName = 'MiniCarousel';

// ─── NewListingCard with Carousel ────────────────────────────────────────────

const NewListingCard = memo(({ id, price, title, location, beds, baths, area, tag, img, images }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const isForSale = tag === "For Sale";
  
  const imagesToShow = (images && images.length > 0) ? images : (img ? [img] : []);
  
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="relative bg-gray-100 overflow-hidden">
        <MiniCarousel images={imagesToShow} title={title} />

        {/* For Sale / For Rent tag */}
        <span className={`absolute top-3 left-3 text-[12px] font-semibold px-3 py-1 rounded-full font-myriad z-20
          ${isForSale ? "bg-white text-primary" : "bg-white text-primary"}`}>
          {tag}
        </span>

        {/* Heart Button */}
        <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
          <HeartBtn size="md" propertyId={id} />
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-[24px] font-semibold text-primary font-myriad">{price}</p>
        <p className="text-[16px] font-semibold text-primary mt-0.5 font-myriad">{title}</p>

        <div className="flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-[15px] text-gray-400 font-myriad">{location}</p>
        </div>

        <div className="h-px bg-gray-100 my-3" />

        {/* Beds / Baths / Area */}
        <div className="flex items-center gap-4">
          <SpecItem label={`${beds || 0}`}>
            <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7" />
            <path d="M2 15h20" /><path d="M5 15v-3" /><path d="M19 15v-3" />
          </SpecItem>

          <SpecItem label={`${baths || 0}`}>
            <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z" />
            <path d="M6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6" />
          </SpecItem>

          <SpecItem label={`${area}`}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </SpecItem>
        </div>
      </div>
    </div>
  );
});

NewListingCard.displayName = 'NewListingCard';

export default NewListingCard;
