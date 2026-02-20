
import { useState, useTransition, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import useRecentSearches from "../hooks/useRecentSearches";
import useSearchSubmit   from "../hooks/useDebounceSearch";
import { useFeaturedProperties, useNewListings } from "../hooks/useProperties";

import ExploreHeader     from "../components/explore/ExploreHeader";
import FeaturedCard      from "../components/explore/FeaturedCard";
import NewListingCard    from "../components/explore/NewListingCard";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../components/ui/SkeletonCards";

// ─── Small helpers ────────────────────────────────────────────────────────────

const SectionHeader = ({ title, onSeeAll }) => (
  <div className="flex items-center justify-between px-4 mb-3 ">
    <h2 className="text-[17px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">{title}</h2>
    <button onClick={onSeeAll} className="flex items-center gap-0.5 text-[13px] font-semibold text-amber-500 font-['DM_Sans',sans-serif]">
      See all
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center py-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
      <svg className="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
      </svg>
    </div>
    <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">No listings found</p>
    <p className="text-[12px] text-gray-400 mt-1 font-['DM_Sans',sans-serif]">Try a different filter</p>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center py-12 text-center px-4">
    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
      <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
      Failed to load properties
    </p>
    <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif] mb-4">
      {message || "Something went wrong"}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// ─── ExplorePage ──────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [isPending, startTransition]    = useTransition();

  // Search hooks
  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  // TanStack Query — auto-fetch, caching, retry, error handling
  const featuredQuery = useFeaturedProperties();
  const newListingsQuery = useNewListings();

  // Filter toggle
  const handleFilterToggle = useCallback((id) => {
    startTransition(() => setActiveFilter((prev) => (prev === id ? null : id)));
  }, []);

  // Client-side filtering (real API pe backend se filtered data aayega)
  const filteredFeatured = useMemo(() => {
    const data = featuredQuery.data ?? [];
    if (activeFilter === "rent") return data.filter((p) => p.price.includes("/mo"));
    if (activeFilter === "buy")  return data.filter((p) => !p.price.includes("/mo"));
    return data;
  }, [featuredQuery.data, activeFilter]);

  const filteredListings = useMemo(() => {
    const data = newListingsQuery.data ?? [];
    if (activeFilter === "rent") return data.filter((p) => p.tag === "For Rent");
    if (activeFilter === "buy")  return data.filter((p) => p.tag === "For Sale");
    return data;
  }, [newListingsQuery.data, activeFilter]);

  // Loading: query loading ya filter transition pending
  const isFeaturedLoading = featuredQuery.isLoading || featuredQuery.isFetching || isPending;
  const isListingsLoading = newListingsQuery.isLoading || newListingsQuery.isFetching || isPending;

  return (
    <div className="min-h-screen bg-[#F7F6F2]">

      <ExploreHeader
        onSubmitSearch={submitSearch}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
        activeFilter={activeFilter}
        onFilterToggle={handleFilterToggle}
        filtersDimmed={isPending}
      />

      <div className="pb-28">

        {/* ── Featured Section ── */}
        <div className="mt-4 mb-6">
          <SectionHeader title="Featured" onSeeAll={() => navigate("/search?featured=true")} />

          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {isFeaturedLoading
              ? Array(4).fill(0).map((_, i) => <FeaturedCardSkeleton key={i} />)
              : featuredQuery.isError
                ? <div className="w-full"><ErrorState message={featuredQuery.error?.message} onRetry={() => featuredQuery.refetch()} /></div>
                : filteredFeatured.length > 0
                  ? filteredFeatured.map((p) => <FeaturedCard key={p.id} {...p} />)
                  : <EmptyState />
            }
          </div>
        </div>

        {/* ── New Listings Section ── */}
        <div>
          <SectionHeader title="New Listings" onSeeAll={() => navigate("/search?new=true")} />

          <div className="px-4 flex flex-col gap-4">
            {isListingsLoading
              ? Array(3).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
              : newListingsQuery.isError
                ? <ErrorState message={newListingsQuery.error?.message} onRetry={() => newListingsQuery.refetch()} />
                : filteredListings.length > 0
                  ? filteredListings.map((p) => <NewListingCard key={p.id} {...p} />)
                  : <EmptyState />
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExplorePage;
