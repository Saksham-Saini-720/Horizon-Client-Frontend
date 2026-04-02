
const ShimmerBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

// ─── Featured Card Skeleton ───────────────────────────────────────────────────

export const FeaturedCardSkeleton = () => (
  <div className="flex-shrink-0 w-44">
    <ShimmerBox className="h-32 rounded-2xl" />
    <ShimmerBox className="h-3 mt-2 w-3/4" />
    <ShimmerBox className="h-2.5 mt-1.5 w-1/2" />
  </div>
);

// ─── New Listing Card Skeleton ────────────────────────────────────────────────

export const NewListingCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
    <ShimmerBox className="h-52 rounded-none" />
    <div className="px-4 pt-3 pb-4 space-y-2">
      <ShimmerBox className="h-5 w-1/3" />
      <ShimmerBox className="h-4 w-2/3" />
      <ShimmerBox className="h-3 w-1/2" />
      <div className="h-px bg-gray-100 my-2" />
      <div className="flex gap-4">
        <ShimmerBox className="h-3 w-14" />
        <ShimmerBox className="h-3 w-14" />
        <ShimmerBox className="h-3 w-16" />
      </div>
    </div>
  </div>
);


export const MostViewedCardSkeleton = () => (
  <div className="flex-shrink-0 w-[340px] bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
    {/* Image Skeleton */}
    <div className="h-[240px] bg-gray-200 relative">
      {/* View Count Badge Skeleton */}
      <div className="absolute top-4 left-4 w-16 h-8 bg-gray-300 rounded-full" />
      {/* Fire Badge Skeleton */}
      <div className="absolute top-4 right-14 w-16 h-8 bg-gray-300 rounded-full" />
      {/* Heart Button Skeleton */}
      <div className="absolute top-4 right-4 w-9 h-9 bg-gray-300 rounded-full" />
      {/* Price Skeleton */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="w-20 h-5 bg-gray-300 rounded-full mb-2" />
        <div className="w-32 h-8 bg-gray-300 rounded-lg" />
      </div>
    </div>

    {/* Info Skeleton */}
    <div className="px-4 py-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
      <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
      <div className="flex gap-4 pt-3">
        <div className="h-4 bg-gray-200 rounded-lg w-12" />
        <div className="h-4 bg-gray-200 rounded-lg w-12" />
        <div className="h-4 bg-gray-200 rounded-lg w-16" />
      </div>
    </div>
  </div>
);
