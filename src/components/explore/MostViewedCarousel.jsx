import { memo, useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
// Most Viewed uses the Featured card so both rows read as one component; the
// badges it needs (verified, purpose, view count) live in FeaturedCard.
import FeaturedCard from "./FeaturedCard";
import { FeaturedCardSkeleton } from "../ui/SkeletonCards";
import EmptyState from "../states/EmptyState";
import ErrorState from "../states/ErrorState";

// Every section on Explore lines up on this inset, so the carousel pads to the
// same value instead of keeping its own — that shared left edge is what makes
// the page read as aligned.
const GUTTER = 24;
const CARD_MAX = 360;
const CARD_GAP = 8;

const MostViewedCarousel = memo(({
  properties = [],
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  // Seeded from the viewport rather than 0. At 0 the width below falls back to
  // CARD_MAX, and on a narrow device (a 344px Z Fold cover screen) a 360px card
  // is wider than the whole screen — so the first paint overflowed. Anything
  // 360px+ hid the bug because the fallback happened to fit.
  const [containerWidth, setContainerWidth] = useState(
    () => (typeof window === "undefined" ? 0 : window.innerWidth)
  );

  // useLayoutEffect, not useEffect: this must land before paint, or the first
  // frame is drawn at the seeded guess instead of the real container width.
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
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

  // The card never exceeds the space between the gutters, so on a narrow phone
  // it shrinks to fit instead of running off the right edge.
  const innerWidth = Math.max(0, containerWidth - GUTTER * 2);
  const cardWidth =
    containerWidth > 0 ? Math.min(CARD_MAX, innerWidth) : CARD_MAX;

  // One card per step, its left edge landing on the page gutter so the card
  // lines up with the section heading above it. The previous version centred the
  // active card, which left the neighbours bleeding in at both screen edges and
  // put the active card's left edge somewhere between gutters.
  // On screens wide enough that the card is narrower than the available space,
  // the whole track is centred instead so it never hugs the left.
  const leadIn = GUTTER + Math.max(0, (innerWidth - cardWidth) / 2);
  const translateX = leadIn - currentIndex * (cardWidth + CARD_GAP);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="mb-2">
        {/* One card, matching what the loaded carousel shows — three fixed-width
            skeletons overflowed the gutters and then jumped on load. */}
        <div className="px-6 overflow-x-hidden">
          <FeaturedCardSkeleton width={cardWidth} />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="mt-6 mb-8 px-6">
        <ErrorState title="Failed to load most viewed properties" onRetry={onRetry} />
      </div>
    );
  }

  // ── Empty ──
  if (!properties || properties.length === 0) {
    return (
      <div className="mt-6 mb-8 px-6">
        <EmptyState
          icon="fire"
          title="No trending properties yet"
          message="Check back soon for popular listings"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Overflow window — PEEK px on each side stays visible */}
        {/* Deliberately no overflow-hidden and no gutter padding here. Both were
            clipping the card's shadow: overflow-hidden clips on every side, and
            the gutter padding put that clip edge right where the shadow spreads.
            ExplorePage's root already carries overflow-x-hidden, so the
            off-screen cards are hidden for us with the shadow left intact. The
            gutter is applied to the track below via translateX instead. */}
        <div ref={containerRef} className="relative">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
            style={{
              gap: CARD_GAP,
              transform: `translateX(${translateX}px)`,
            }}
          >
            {properties.map((property, idx) => (
              <div
                key={property.id}
                className="flex-shrink-0 transition-all duration-500"
                style={{
                  // Non-active cards: slightly scaled down + dimmed for depth.
                  // The active card gets "none" rather than scale(1): an
                  // identity transform still promotes the element to its own
                  // compositing layer, and the resampling that follows is what
                  // softened the badge text.
                  transform: idx === currentIndex ? "none" : "scale(0.94)",
                  // opacity: idx === currentIndex ? 1 : 0.55,
                  filter: idx === currentIndex ? "none" : "blur(0.5px)",
                }}
              >
                <FeaturedCard
                  {...property}
                  width={cardWidth}
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
            style={{ width: GUTTER + 16 }}
          />
        )}

        {/* Right tap zone */}
        {properties.length > 1 && currentIndex < properties.length - 1 && (
          <button
            onClick={goToNext}
            aria-label="Next property"
            className="absolute right-0 top-0 bottom-0 z-20"
            style={{ width: GUTTER + 16 }}
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
