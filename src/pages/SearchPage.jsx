
import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { usePropertiesWithFilters } from "../hooks/properties/usePropertiesWithFilters";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import SearchHeader from "../components/search/SearchHeader";
import NewListingCard from "../components/explore/NewListingCard";
import { NewListingCardSkeleton } from "../components/ui/SkeletonCards";
import FilterChips from "../components/explore/FilterChips";
import PriceFilterModal from "../components/explore/filters/PriceFilterModal";
import BedroomsFilterModal from "../components/explore/filters/BedroomsFilterModal";
import FullFiltersModal from "../components/explore/filters/FullFiltersModal";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState({
    purpose: null,       // 'sale' or 'rent'
    sort: 'newest',      // 'newest', 'oldest', 'price_asc', 'price_desc'
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    type: undefined,
    amenities: undefined,
  });

  const [activeModal, setActiveModal] = useState(null);

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  const apiFilters = useMemo(() => {
    const f = {};
    if (filters.purpose)             f.purpose   = filters.purpose;
    if (filters.sort)                f.sort      = filters.sort;
    if (filters.minPrice)            f.minPrice  = filters.minPrice;
    if (filters.maxPrice)            f.maxPrice  = filters.maxPrice;
    if (filters.bedrooms)            f.bedrooms  = filters.bedrooms;
    if (filters.bathrooms)           f.bathrooms = filters.bathrooms;
    if (filters.type)                f.type      = filters.type;
    if (filters.amenities?.length)   f.amenities = filters.amenities;
    if (query)                       f.search    = query;
    return f;
  }, [filters, query]);

  const { data: properties = [], isLoading, isError, error, refetch } = usePropertiesWithFilters(apiFilters);

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
    submitSearch(newQuery);
  };

  const handleClearSearch = () => {
    setSearchParams({});
    setFilters({
      purpose: null,
      sort: 'newest',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      type: undefined,
      amenities: undefined,
    });
  };

  // Active filter for FilterChips component
  const activeFilter = useMemo(() => {
    if (filters.purpose === 'sale') return 'buy';
    if (filters.purpose === 'rent') return 'rent';
    return null;
  }, [filters.purpose]);

  //  Filter toggle handler - same as ExplorePage
  const handleFilterToggle = useCallback((id) => {
    if      (id === 'buy')      setFilters(p => ({ ...p, purpose: p.purpose === 'sale' ? null : 'sale' }));
    else if (id === 'rent')     setFilters(p => ({ ...p, purpose: p.purpose === 'rent' ? null : 'rent' }));
    else if (id === 'price')    setActiveModal('price');
    else if (id === 'bedrooms') setActiveModal('bedrooms');
    else if (id === 'filters')  setActiveModal('filters');
    else if (id === 'nearme')   navigate('/map');
  }, [navigate]);

  // Modal apply handlers
  const handlePriceApply = useCallback((p) => {
    setFilters(prev => ({ ...prev, minPrice: p.minPrice, maxPrice: p.maxPrice }));
  }, []);

  const handleBedroomsApply = useCallback((p) => {
    setFilters(prev => ({ ...prev, bedrooms: p.bedrooms }));
  }, []);

  const handleFullApply = useCallback((all) => {
    setFilters(prev => ({ ...prev, ...all }));
  }, []);


  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.purpose) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.type) count++;
    if (filters.amenities?.length) count++;
    return count;
  }, [filters]);

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

      <FilterChips
        activeFilter={activeFilter}
        onToggle={handleFilterToggle}
        dimmed={isLoading}
      />

      {/* Sort + Map + Grid row */}
      <div className="bg-white border-b border-gray-100">
        <div className="overflow-x-auto scrollbar-none w-full">
          <div className="inline-flex items-center justify-between w-full min-w-max px-4 py-3 gap-2">

            {/* Left: Empty space (filters now in FilterChips) */}
            <div className="flex-1" />

            {/* Right: Sort + Map + Grid
            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              {/* <select 
                value={filters.sort}
                onChange={handleSortChange}
                className="px-2 py-1.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-700 font-myriad bg-white focus:outline-none focus:border-gray-300 max-w-[130px] whitespace-nowrap cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select> */}

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
            {/* </div> */} 

          </div>
        </div>
      </div>

      {(activeFiltersCount > 0 || query) && (
        <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-gray-500 font-myriad">Active filters:</span>
            
            {query && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold">
                Search: "{query}"
                <button onClick={handleClearSearch} className="ml-1 hover:text-primary-dark">×</button>
              </span>
            )}

            {filters.purpose === 'sale' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold">
                For Sale
                <button onClick={() => setFilters(p => ({ ...p, purpose: null }))} className="ml-1 hover:text-primary-dark">×</button>
              </span>
            )}
            
            {filters.purpose === 'rent' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold">
                For Rent
                <button onClick={() => setFilters(p => ({ ...p, purpose: null }))} className="ml-1 hover:text-primary-dark">×</button>
              </span>
            )}

            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold">
                Price: {filters.minPrice ? `$${filters.minPrice.toLocaleString()}` : '0'} - {filters.maxPrice ? `$${filters.maxPrice.toLocaleString()}` : '∞'}
                <button onClick={() => setFilters(p => ({ ...p, minPrice: undefined, maxPrice: undefined }))} className="ml-1 hover:text-primary-dark">×</button>
              </span>
            )}

            {filters.bedrooms && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold">
                {filters.bedrooms} Bedrooms
                <button onClick={() => setFilters(p => ({ ...p, bedrooms: undefined }))} className="ml-1 hover:text-primary-dark">×</button>
              </span>
            )}

            {filters.bathrooms && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold">
                {filters.bathrooms} Bathrooms
                <button onClick={() => setFilters(p => ({ ...p, bathrooms: undefined }))} className="ml-1 hover:text-primary-dark">×</button>
              </span>
            )}

            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-semibold">
                {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
                <button onClick={() => setFilters(p => ({ ...p, type: undefined }))} className="ml-1 hover:text-primary-dark">×</button>
              </span>
            )}

            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearSearch}
                className="text-[12px] font-semibold text-secondary hover:text-amber-700 ml-2"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Property Count */}
      <div className="px-4 pt-4 pb-2">
        {isLoading ? (
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="text-[15px] text-gray-600 font-myriad">
            {properties.length} properties
            {filters.purpose === 'sale' && ' for sale'}
            {filters.purpose === 'rent' && ' for rent'}
          </p>
        )}
      </div>

      {/* Results */}
      <div className="px-4 flex flex-col gap-4 max-w-full">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
        ) : isError ? (
          <ErrorState
            title="Failed to load results"
            message={error?.message}
            onRetry={refetch}
          />
        ) : properties.length > 0 ? (
          properties.map((p) => (
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
              query || activeFiltersCount > 0
                ? `Try adjusting your filters or search for a different location.`
                : "Try a different search"
            }
            action={
              (query || activeFiltersCount > 0) ? (
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

    
      <PriceFilterModal
        isOpen={activeModal === 'price'}
        onClose={() => setActiveModal(null)}
        onApply={handlePriceApply}
        currentFilters={filters}
      />

      <BedroomsFilterModal
        isOpen={activeModal === 'bedrooms'}
        onClose={() => setActiveModal(null)}
        onApply={handleBedroomsApply}
        currentFilters={filters}
      />

      <FullFiltersModal
        isOpen={activeModal === 'filters'}
        onClose={() => setActiveModal(null)}
        onApply={handleFullApply}
        currentFilters={filters}
      />
    </div>
  );
};

export default SearchPage;
