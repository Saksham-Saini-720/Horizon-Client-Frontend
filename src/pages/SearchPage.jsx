
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

/**
 * SearchPage Component
 * Complete search page matching Lovable app UI exactly
 */
const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get query parameters
  const query = searchParams.get("q") ?? "";
  const isFeatured = searchParams.get("featured") === "true";
  const isNew = searchParams.get("new") === "true";
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("buy");

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

  // Handle search
  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
    submitSearch(newQuery);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchParams({});
    navigate('/search');
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Here you can add logic to filter by buy/rent
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      
      {/* Header with Search Bar */}
      <SearchHeader
        query={query}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onBack={() => navigate(-1)}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
      />

      {/* Controls Row: Buy, Rent, Filters + Sort, Map, Grid */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Buy, Rent, Filters */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabChange('buy')}
              className={`px-4 py-2 rounded-lg text-[15px] font-semibold font-myriad transition-colors ${
                activeTab === 'buy'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handleTabChange('rent')}
              className={`px-4 py-2 rounded-lg text-[15px] font-semibold font-myriad transition-colors ${
                activeTab === 'rent'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Rent
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[15px] font-semibold text-gray-700 font-myriad hover:border-gray-300 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
            </button>
          </div>

          {/* Right: Sort, Map Icon, Grid Icon */}
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-[15px] font-semibold text-gray-700 font-myriad bg-white focus:outline-none focus:border-gray-300">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            
            {/* Map Icon (3 lines) - Navigate to Map */}
            <button
              onClick={() => navigate('/map')}
              className="p-2 rounded-lg bg-primary text-white hover:bg-primary-light transition-colors"
              aria-label="Map view"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Grid Icon */}
            <button
              className="p-2 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Grid view"
              onClick={() => navigate('/map')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
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
            title="No properties found"
            message={
              query 
                ? `Try adjusting your filters or search for a different location.`
                : "Try a different search"
            }
            action={
              query ? (
                <button
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
