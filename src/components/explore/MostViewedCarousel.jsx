
import { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MostViewedCard from "./MostViewedCard";
import { MostViewedCardSkeleton } from "../ui/SkeletonCards";
import EmptyState from "../states/EmptyState";
import ErrorState from "../states/ErrorState";

const MostViewedCarousel = memo(({ 
  properties = [], 
  isLoading = false, 
  isError = false,
  onRetry 
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || properties.length === 0 || properties.length === 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === properties.length - 1 ? 0 : prev + 1));
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, properties.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? properties.length - 1 : prev - 1));
  }, [properties.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === properties.length - 1 ? 0 : prev + 1));
  }, [properties.length]);

  const goToIndex = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-6 mb-8">
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center animate-pulse">
              <span className="text-[16px]">🔥</span>
            </div>
            <h2 className="text-[20px] font-bold text-primary font-myriad">
              Most Viewed Properties
            </h2>
          </div>
          <p className="text-[14px] text-gray-500 font-myriad mt-1">
            Trending properties everyone is watching
          </p>
        </div>
        <div className="flex gap-4 px-4 overflow-x-hidden">
          {Array(3).fill(0).map((_, i) => (
            <MostViewedCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mt-6 mb-8 px-4">
        <ErrorState
          title="Failed to load most viewed properties"
          onRetry={onRetry}
        />
      </div>
    );
  }

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="mt-6 mb-8 px-4">
        <EmptyState
          icon="fire"
          title="No trending properties yet"
          message="Check back soon for popular listings"
        />
      </div>
    );
  }

  return (
    <div className="mt-6 mb-8">
      {/* Header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-[16px]">🔥</span>
            </div>
            <h2 className="text-[20px] font-bold text-primary font-myriad">
              Most Viewed Properties
            </h2>
          </div>
          <p className="text-[13px] text-gray-500 font-myriad mt-1 ml-9">
            Trending properties everyone is watching
          </p>
        </div>

        {/* See All Link */}
        <button
          onClick={() => navigate('/search?sort=views')}
          className="text-[13px] font-semibold text-secondary hover:text-secondary/80 transition-colors font-myriad"
        >
          See All →
        </button>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Cards Container */}
        <div className="overflow-hidden px-4">
          <div 
            className="flex gap-4 transition-transform duration-700 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * (340 + 16)}px)` // 340px card width + 16px gap
            }}
          >
            {properties.map((property) => (
              <MostViewedCard 
                key={property.id} 
                {...property}
                viewCount={property.viewCount || 0}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple cards */}
        {properties.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all z-10 border border-gray-100"
              aria-label="Previous property"
            >
              <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all z-10 border border-gray-100"
              aria-label="Next property"
            >
              <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </>
        )}

        {/* Dot Indicators - Only show if multiple cards */}
        {properties.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`transition-all rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-gradient-to-r from-orange-500 to-red-500"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to property ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-scroll Indicator */}
        {!isPaused && properties.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] text-gray-600 font-medium font-myriad">
                Auto-scrolling
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MostViewedCarousel.displayName = 'MostViewedCarousel';

export default MostViewedCarousel;
