
const ShimmerBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

// ─── Featured Card Skeleton ───────────────────────────────────────────────────

// `width` lets the Most Viewed carousel size the card to the page gutters; left
// off, it keeps the natural width used by the Featured row.
export const FeaturedCardSkeleton = ({ width }) => (
  <div
    className={`flex-shrink-0 ${width ? "" : "w-72"}`}
    style={width ? { width } : undefined}
  >
    <ShimmerBox className="h-44 rounded-2xl" />
    <ShimmerBox className="h-3 mt-2.5 w-3/4" />
    <ShimmerBox className="h-2.5 mt-1.5 w-1/2" />
    <ShimmerBox className="h-4 mt-2 w-1/3" />
  </div>
);

// ─── New Listing Card Skeleton ────────────────────────────────────────────────

export const NewListingCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
    <ShimmerBox className="h-[220px] sm:h-[260px] rounded-none" />
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
