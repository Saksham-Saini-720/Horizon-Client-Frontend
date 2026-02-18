
// ─── Shimmer base ─────────────────────────────────────────────────────────────
// Sab skeletons isko use karte hain

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
