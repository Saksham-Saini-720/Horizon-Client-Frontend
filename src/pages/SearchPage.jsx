
import { useSearchParams, useNavigate } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { useSearchProperties, useFeaturedProperties, useNewListings } from "../hooks/properties/useProperties";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import SearchBar from "../components/layouts/SearchBar";
import NewListingCard from "../components/explore/NewListingCard";
import { NewListingCardSkeleton } from "../components/ui/SkeletonCards";

// ─── SearchPage ───────────────────────────────────────────────────────────────

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get query parameters
  const query = searchParams.get("q") ?? "";
  const isFeatured = searchParams.get("featured") === "true";
  const isNew = searchParams.get("new") === "true";

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  // Use different queries based on parameters
  const searchQuery = useSearchProperties(query, !!query && !isFeatured && !isNew);
  const featuredQuery = useFeaturedProperties({ enabled: isFeatured });
  const newListingsQuery = useNewListings({ enabled: isNew });

  // Select the appropriate query
  const activeQuery = isFeatured 
    ? featuredQuery 
    : isNew 
      ? newListingsQuery 
      : searchQuery;

  // Determine page title
  const getPageTitle = () => {
    if (isFeatured) return "Featured Properties";
    if (isNew) return "New Listings";
    if (query) return `Results for "${query}"`;
    return "All Properties";
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] pb-28">
      
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <SearchBar
          initialQuery={query}
          recentSearches={recent.searches}
          onSubmit={submitSearch}
          onRemoveRecent={recent.remove}
          onClearAllRecent={recent.clearAll}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          {activeQuery.isLoading ? (
            <div className="space-y-1.5">
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                {getPageTitle()}
              </p>
              <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
                {activeQuery.data?.length ?? 0} properties found
              </p>
            </>
          )}
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-[13px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] hover:border-amber-300 transition-colors">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filter
        </button>
      </div>

      {/* Results */}
      <div className="px-4 flex flex-col gap-4">
        {activeQuery.isLoading ? (
          Array(4).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
        ) : activeQuery.isError ? (
          <ErrorState
            title="Failed to load results"
            message={activeQuery.error?.message}
            onRetry={() => activeQuery.refetch()}
          />
        ) : activeQuery.data && activeQuery.data.length > 0 ? (
          activeQuery.data.map((p) => (
            <NewListingCard
              key={p.id}
              {...p}
              onClick={() => navigate(`/property/${p.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="search"
            title="No results found"
            message={
              isFeatured 
                ? "No featured properties available right now"
                : isNew
                  ? "No new listings available right now"
                  : query 
                    ? `No properties match "${query}"`
                    : "Try a different search"
            }
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
