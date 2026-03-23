import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { useSearchProperties, useFeaturedProperties, useNewListings } from "../hooks/properties/useProperties";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import SearchHeader from "../components/search/SearchHeader";
import NewListingCard from "../components/explore/NewListingCard";
import { NewListingCardSkeleton } from "../components/ui/SkeletonCards";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const isFeatured = searchParams.get("featured") === "true";
  const isNew = searchParams.get("new") === "true";

  const [activeTab, setActiveTab] = useState("buy");

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  const searchQuery = useSearchProperties(query, !!query && !isFeatured && !isNew);
  const featuredQuery = useFeaturedProperties({ enabled: isFeatured });
  const newListingsQuery = useNewListings({ enabled: isNew });

  const activeQuery = isFeatured
    ? featuredQuery
    : isNew
      ? newListingsQuery
      : searchQuery;

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
    submitSearch(newQuery);
  };

  const handleClearSearch = () => {
    setSearchParams({});
    navigate("/search");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
   
    <div className="min-h-screen w-full overflow-x-hidden bg-surface pb-28">

      {/* Search Header */}
      <SearchHeader
        query={query}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onBack={() => navigate(-1)}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
      />

      <div className="bg-white border-b border-gray-100">
        
        <div className="overflow-x-auto scrollbar-none w-full">
          
          <div className="inline-flex items-center justify-between w-full min-w-max px-4 py-3 gap-2">

            {/* Left: Buy | Rent | Filters */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTabChange("buy")}
                className={`px-3 py-1.5 rounded-lg text-[14px] font-semibold font-myriad transition-colors whitespace-nowrap ${
                  activeTab === "buy"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("rent")}
                className={`px-3 py-1.5 rounded-lg text-[14px] font-semibold font-myriad transition-colors whitespace-nowrap ${
                  activeTab === "rent"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Rent
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[14px] font-semibold text-gray-700 font-myriad hover:border-gray-300 transition-colors whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filters
              </button>
            </div>

            {/* Right: Sort + Map + Grid */}
            <div className="flex items-center gap-2 ml-2">
              <select className="px-2 py-1.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-700 font-myriad bg-white focus:outline-none focus:border-gray-300 max-w-[130px] whitespace-nowrap">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>

              {/* Map Icon */}
              <button
                type="button"
                onClick={() => navigate("/map")}
                className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary-light transition-colors flex-shrink-0"
                aria-label="Map view"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Grid Icon */}
              <button
                type="button"
                className="p-1.5 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
                aria-label="Grid view"
                onClick={() => navigate("/map")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Property Count */}
      <div className="px-4 pt-4 pb-2">
        {activeQuery.isLoading ? (
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="text-[15px] text-gray-600 font-myriad">
            {activeQuery.data?.length ?? 0} properties
          </p>
        )}
      </div>

      {/* Results */}
      
      <div className="px-4 flex flex-col gap-4 max-w-full">
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
            title="No properties found"
            message={
              query
                ? `Try adjusting your filters or search for a different location.`
                : "Try a different search"
            }
            action={
              query ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-4 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-[15px] font-semibold text-primary font-myriad hover:bg-gray-50 transition-all"
                >
                  Clear Filters
                </button>
              ) : null
            }
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;