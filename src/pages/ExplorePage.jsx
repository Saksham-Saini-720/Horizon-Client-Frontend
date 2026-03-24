
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { useFeaturedPropertiesFiltered, useNewListingsFiltered } from "../hooks/properties/usePropertiesWithFilters";
import { useMapProperties } from "../hooks/properties/useMapProperties";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import ExploreHeader from "../components/explore/ExploreHeader";
import FeaturedCard from "../components/explore/FeaturedCard";
import NewListingCard from "../components/explore/NewListingCard";
import SectionHeader from "../components/explore/SectionHeader";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../components/ui/SkeletonCards";
import PriceFilterModal from "../components/explore/filters/PriceFilterModal";
import BedroomsFilterModal from "../components/explore/filters/BedroomsFilterModal";
import FullFiltersModal from "../components/explore/filters/FullFiltersModal";

const ExplorePage = () => {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedLocation');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState({
    purpose: null, minPrice: undefined, maxPrice: undefined,
    bedrooms: undefined, bathrooms: undefined, type: undefined, amenities: undefined,
  });

  const [activeModal, setActiveModal] = useState(null);

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  const apiFilters = useMemo(() => {
    const f = {};
    if (filters.purpose)             f.purpose   = filters.purpose;
    if (filters.minPrice)            f.minPrice  = filters.minPrice;
    if (filters.maxPrice)            f.maxPrice  = filters.maxPrice;
    if (filters.bedrooms)            f.bedrooms  = filters.bedrooms;
    if (filters.bathrooms)           f.bathrooms = filters.bathrooms;
    if (filters.type)                f.type      = filters.type;
    if (filters.amenities?.length)   f.amenities = filters.amenities;
    return f;
  }, [filters]);

  const showNearby = !!(selectedLocation && !isSearching);

  // Nearby — uses same smart fallback as MapPage (nearby → 50km → getAllProperties)
  const nearbyQuery = useMapProperties(
    selectedLocation?.lng,
    selectedLocation?.lat,
    5000,
    selectedLocation?.name,  // city filter
  );

  // Regular
  const featuredQuery    = useFeaturedPropertiesFiltered(apiFilters, { enabled: !showNearby });
  const newListingsQuery = useNewListingsFiltered(apiFilters,         { enabled: !showNearby });

  const handleLocationChange = useCallback((location) => {
    setSelectedLocation(location);
    setIsSearching(false);
    localStorage.setItem('selectedLocation', JSON.stringify(location));
  }, []);

  const handleSearch = useCallback((query) => {
    if (query?.trim()) { setIsSearching(true); submitSearch(query); }
    else               { setIsSearching(false); }
  }, [submitSearch]);

  const activeFilter = useMemo(() => {
    if (filters.purpose === 'sale') return 'buy';
    if (filters.purpose === 'rent') return 'rent';
    return null;
  }, [filters.purpose]);

  const handleFilterToggle = useCallback((id) => {
    if      (id === 'buy')      setFilters(p => ({ ...p, purpose: p.purpose === 'sale' ? null : 'sale' }));
    else if (id === 'rent')     setFilters(p => ({ ...p, purpose: p.purpose === 'rent' ? null : 'rent' }));
    else if (id === 'price')    setActiveModal('price');
    else if (id === 'bedrooms') setActiveModal('bedrooms');
    else if (id === 'filters')  setActiveModal('filters');
    else if (id === 'nearme') {
      navigate('/map', { state: selectedLocation ? { location: selectedLocation } : {} });
    }
  }, [navigate, selectedLocation]);

  const handlePriceApply    = useCallback((p) => setFilters(prev => ({ ...prev, minPrice: p.minPrice, maxPrice: p.maxPrice })), []);
  const handleBedroomsApply = useCallback((p) => setFilters(prev => ({ ...prev, bedrooms: p.bedrooms })), []);
  const handleFullApply     = useCallback((all) => setFilters(prev => ({ ...prev, ...all })), []);

  // Which data to show
  const isFeaturedLoading = showNearby ? nearbyQuery.isLoading    : (featuredQuery.isLoading    || featuredQuery.isFetching);
  const isListingsLoading = showNearby ? nearbyQuery.isLoading    : (newListingsQuery.isLoading  || newListingsQuery.isFetching);
  const featuredData      = showNearby ? nearbyQuery.data         : featuredQuery.data;
  const listingsData      = showNearby ? nearbyQuery.data         : newListingsQuery.data;
  const featuredError     = showNearby ? nearbyQuery.isError      : featuredQuery.isError;
  const listingsError     = showNearby ? nearbyQuery.isError      : newListingsQuery.isError;

  return (
    <div className="min-h-screen bg-surface">

      <ExploreHeader
        onSubmitSearch={handleSearch}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
        activeFilter={activeFilter}
        onFilterToggle={handleFilterToggle}
        filtersDimmed={isFeaturedLoading || isListingsLoading}
        currentLocation={selectedLocation}
        onLocationChange={handleLocationChange}
      />

      {/* Location banner */}
      {showNearby && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <p className="text-[15px] font-medium text-amber-800 font-myriad">
                Showing properties near <span className="font-semibold">{selectedLocation.name}</span>
              </p>
            </div>
            <button
              onClick={() => { setSelectedLocation(null); localStorage.removeItem('selectedLocation'); }}
              className="text-[12px] font-semibold text-secondary hover:text-amber-700 ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="pb-28">

        {/* Featured / Nearby */}
        <div className="mt-4 mb-6">
          <SectionHeader
            title={showNearby ? 'Nearby Properties' : 'Featured'}
            onSeeAll={showNearby
              ? () => navigate('/map', { state: { location: selectedLocation } })
              : () => navigate('/search?featured=true')
            }
          />
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {isFeaturedLoading ? (
              Array(4).fill(0).map((_, i) => <FeaturedCardSkeleton key={i} />)
            ) : featuredError ? (
              <div className="w-full">
                <ErrorState
                  title={showNearby ? 'Failed to load nearby properties' : 'Failed to load featured properties'}
                  onRetry={() => showNearby ? nearbyQuery.refetch() : featuredQuery.refetch()}
                />
              </div>
            ) : featuredData?.length > 0 ? (
              featuredData.map((p) => (
                <FeaturedCard key={p.id} {...p} onClick={() => navigate(`/property/${p.id}`)} />
              ))
            ) : (
              <EmptyState
                icon="home"
                title={showNearby ? 'No properties nearby' : 'No featured properties'}
                message={showNearby ? 'Try a different location' : 'Try adjusting your filters'}
              />
            )}
          </div>
        </div>

        {/* New Listings (only when not nearby mode) */}
        {!showNearby && (
          <div>
            <SectionHeader title="New Listings" onSeeAll={() => navigate('/search?new=true')} />
            <div className="px-4 flex flex-col gap-4">
              {isListingsLoading ? (
                Array(3).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
              ) : listingsError ? (
                <ErrorState title="Failed to load new listings" onRetry={() => newListingsQuery.refetch()} />
              ) : listingsData?.length > 0 ? (
                listingsData.map((p) => (
                  <NewListingCard key={p.id} {...p} onClick={() => navigate(`/property/${p.id}`)} />
                ))
              ) : (
                <EmptyState icon="home" title="No new listings" message="Try adjusting your filters" />
              )}
            </div>
          </div>
        )}

        {/* More Nearby (only in nearby mode) */}
        {showNearby && listingsData?.length > 4 && (
          <div>
            <SectionHeader
              title="More Nearby"
              onSeeAll={() => navigate('/map', { state: { location: selectedLocation } })}
            />
            <div className="px-4 flex-wrap flex flex-col gap-4">
              {listingsData.slice(4, 10).map((p) => (
                <NewListingCard key={p.id} {...p} onClick={() => navigate(`/property/${p.id}`)} />
              ))}
            </div>
          </div>
        )}

      </div>

      <PriceFilterModal    isOpen={activeModal === 'price'}    onClose={() => setActiveModal(null)} onApply={handlePriceApply}    currentFilters={filters} />
      <BedroomsFilterModal isOpen={activeModal === 'bedrooms'} onClose={() => setActiveModal(null)} onApply={handleBedroomsApply} currentFilters={filters} />
      <FullFiltersModal    isOpen={activeModal === 'filters'}  onClose={() => setActiveModal(null)} onApply={handleFullApply}     currentFilters={filters} />
    </div>
  );
};

export default ExplorePage;
