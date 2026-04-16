import { memo, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MostViewedCard from "./MostViewedCard";
import { MostViewedCardSkeleton } from "../ui/SkeletonCards";
import EmptyState from "../states/EmptyState";
import ErrorState from "../states/ErrorState";

const CARD_WIDTH = 320;
const CARD_GAP = 14;
const PEEK = 34; // how much of prev/next card shows on sides

const MostViewedCarousel = memo(({
  properties = [],
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.offsetWidth);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isPaused || properties.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === properties.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, properties.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? properties.length - 1 : prev - 1));
  }, [properties.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === properties.length - 1 ? 0 : prev + 1));
  }, [properties.length]);

  // const goToIndex = useCallback((index) => setCurrentIndex(index), []);

  // Center the active card:
  // offset = currentIndex * (CARD_WIDTH + CARD_GAP) - (containerWidth - CARD_WIDTH) / 2
  const offset =
    containerWidth > 0
      ? currentIndex * (CARD_WIDTH + CARD_GAP) - (containerWidth - CARD_WIDTH) / 2
      : currentIndex * (CARD_WIDTH + CARD_GAP);

  // ── Loading ──
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
          {Array(3).fill(0).map((_, i) => <MostViewedCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="mt-6 mb-8 px-4">
        <ErrorState title="Failed to load most viewed properties" onRetry={onRetry} />
      </div>
    );
  }

  // ── Empty ──
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
    <div className="mt-6 ">
      {/* Header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 pl-8">
            <h2 className="text-[20px] font-bold text-primary font-myriad">
              Most Viewed Properties
            </h2>
          </div>
          <p className="text-[13px] text-gray-500 font-myriad mt-1 ml-8">
            Trending properties everyone is watching
          </p>
        </div>
        <button
          onClick={() => navigate("/search?sort=views")}
          className="text-[13px] font-semibold text-primary-light hover:text-secondary/80 transition-colors font-myriad"
        >
          See All →
        </button>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Overflow window — PEEK px on each side stays visible */}
        <div
          ref={containerRef}
          className="overflow-hidden"
          style={{ paddingLeft: PEEK, paddingRight: PEEK }}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
            style={{
              gap: CARD_GAP,
              transform: `translateX(-${Math.max(0, offset)}px)`,
            }}
          >
            {properties.map((property, idx) => (
              <div
                key={property.id}
                className="flex-shrink-0 transition-all duration-500"
                style={{
                  // Non-active cards: slightly scaled down + dimmed for depth
                  transform: idx === currentIndex ? "scale(1)" : "scale(0.94)",
                  // opacity: idx === currentIndex ? 1 : 0.55,
                  filter: idx === currentIndex ? "none" : "blur(0.5px)",
                }}
              >
                <MostViewedCard
                  {...property}
                  viewCount={property.viewCount || 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Left tap zone */}
        {properties.length > 1 && currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            aria-label="Previous property"
            className="absolute left-0 top-0 bottom-0 z-20"
            style={{ width: PEEK + 16 }}
          />
        )}

        {/* Right tap zone */}
        {properties.length > 1 && currentIndex < properties.length - 1 && (
          <button
            onClick={goToNext}
            aria-label="Next property"
            className="absolute right-0 top-0 bottom-0 z-20"
            style={{ width: PEEK + 16 }}
          />
        )}

        {/* Dot Indicators
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
        )} */}

        {/* Auto-scroll indicator */}
        {/* {!isPaused && properties.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] text-gray-600 font-medium font-myriad">
                Auto-scrolling
              </span>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
});

MostViewedCarousel.displayName = "MostViewedCarousel";

export default MostViewedCarousel;
