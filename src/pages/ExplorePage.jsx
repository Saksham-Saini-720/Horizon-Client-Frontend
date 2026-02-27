
import { useState, useTransition, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { useFeaturedProperties, useNewListings } from "../hooks/properties/useProperties";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import ExploreHeader from "../components/explore/ExploreHeader";
import FeaturedCard from "../components/explore/FeaturedCard";
import NewListingCard from "../components/explore/NewListingCard";
import SectionHeader from "../components/explore/SectionHeader";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../components/ui/SkeletonCards";

// ─── ExplorePage ──────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [isPending, startTransition] = useTransition();

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  const featuredQuery = useFeaturedProperties();
  const newListingsQuery = useNewListings();

  const handleFilterToggle = useCallback((id) => {
    startTransition(() => setActiveFilter((prev) => (prev === id ? null : id)));
  }, []);

  // Client-side filtering
  const filteredFeatured = useMemo(() => {
    const data = featuredQuery.data ?? [];
    if (activeFilter === "rent") return data.filter((p) => p.price.includes("/mo"));
    if (activeFilter === "buy") return data.filter((p) => !p.price.includes("/mo"));
    return data;
  }, [featuredQuery.data, activeFilter]);

  const filteredListings = useMemo(() => {
    const data = newListingsQuery.data ?? [];
    if (activeFilter === "rent") return data.filter((p) => p.tag === "For Rent");
    if (activeFilter === "buy") return data.filter((p) => p.tag === "For Sale");
    return data;
  }, [newListingsQuery.data, activeFilter]);

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
        
        {/* Featured Section */}
        <div className="mt-4 mb-6">
          <SectionHeader
            title="Featured"
            onSeeAll={() => navigate("/search?featured=true")}
          />

          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {isFeaturedLoading ? (
              Array(4).fill(0).map((_, i) => <FeaturedCardSkeleton key={i} />)
            ) : featuredQuery.isError ? (
              <div className="w-full">
                <ErrorState
                  title="Failed to load featured properties"
                  message={featuredQuery.error?.message}
                  onRetry={() => featuredQuery.refetch()}
                />
              </div>
            ) : filteredFeatured.length > 0 ? (
              filteredFeatured.map((p) => (
                <FeaturedCard
                  key={p.id}
                  {...p}
                  onClick={() => navigate(`/property/${p.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon="home"
                title="No featured properties"
                message="Check back later for featured listings"
              />
            )}
          </div>
        </div>

        {/* New Listings Section */}
        <div>
          <SectionHeader
            title="New Listings"
            onSeeAll={() => navigate("/search?new=true")}
          />

          <div className="px-4 flex flex-col gap-4">
            {isListingsLoading ? (
              Array(3).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
            ) : newListingsQuery.isError ? (
              <ErrorState
                title="Failed to load new listings"
                message={newListingsQuery.error?.message}
                onRetry={() => newListingsQuery.refetch()}
              />
            ) : filteredListings.length > 0 ? (
              filteredListings.map((p) => (
                <NewListingCard
                  key={p.id}
                  {...p}
                  onClick={() => navigate(`/property/${p.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon="home"
                title="No new listings"
                message="Try adjusting your filters"
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExplorePage;
