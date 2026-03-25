
import { useState, useCallback, useMemo, useEffect } from "react";
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
import Pagination from "../components/ui/Pagination";

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
    purpose: null,
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    type: undefined,
    amenities: undefined,
    page: 1,
    limit: 10,
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
    f.page  = filters.page;
    f.limit = filters.limit;
    return f;
  }, [filters]);

  const showNearby = !!(selectedLocation && !isSearching);

  const nearbyQuery = useMapProperties(
    selectedLocation?.lng,
    selectedLocation?.lat,
    5000,
    selectedLocation?.name,
  );

  const filteredNearbyData = useMemo(() => {
    if (!showNearby || !nearbyQuery.data) return [];
    
    let filtered = nearbyQuery.data;
    
    // Filter by purpose (Buy/Rent)
    if (filters.purpose) {
      filtered = filtered.filter(p => p.purpose === filters.purpose);
    }
    
    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.rawPrice >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.rawPrice <= filters.maxPrice);
    }
    
    // Filter by bedrooms
    if (filters.bedrooms) {
      const bedroomCount = filters.bedrooms === '4+' ? 4 : parseInt(filters.bedrooms);
      filtered = filtered.filter(p => {
        const beds = parseInt(p.beds) || 0;
        if (filters.bedrooms === '4+') {
          return beds >= bedroomCount;
        }
        return beds === bedroomCount;
      });
    }
    
    // Filter by bathrooms
    if (filters.bathrooms) {
      const bathroomCount = filters.bathrooms === '4+' ? 4 : parseInt(filters.bathrooms);
      filtered = filtered.filter(p => {
        const baths = parseInt(p.baths) || 0;
        if (filters.bathrooms === '4+') {
          return baths >= bathroomCount;
        }
        return baths === bathroomCount;
      });
    }
    
    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(p => p.type?.toLowerCase() === filters.type.toLowerCase());
    }
    
    // Filter by amenities
    if (filters.amenities?.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.amenities || !Array.isArray(p.amenities)) return false;
        const propertyAmenities = p.amenities.map(a => a.toLowerCase());
        return filters.amenities.every(a => propertyAmenities.includes(a.toLowerCase()));
      });
    }
    
    return filtered;
  }, [nearbyQuery.data, filters, showNearby]);

  // Regular queries
  const featuredQuery = useFeaturedPropertiesFiltered(
    { purpose: filters.purpose },
    { enabled: !showNearby }
  );
  
  const newListingsQuery = useNewListingsFiltered(
    apiFilters,
    { enabled: !showNearby }
  );

  useEffect(() => {
    if (filters.page > 1) {
      const newListingsSection = document.getElementById('new-listings-section');
      if (newListingsSection) {
        newListingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [filters.page]);

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
    if      (id === 'buy')      setFilters(p => ({ ...p, purpose: p.purpose === 'sale' ? null : 'sale', page: 1 }));
    else if (id === 'rent')     setFilters(p => ({ ...p, purpose: p.purpose === 'rent' ? null : 'rent', page: 1 }));
    else if (id === 'price')    setActiveModal('price');
    else if (id === 'bedrooms') setActiveModal('bedrooms');
    else if (id === 'filters')  setActiveModal('filters');
    else if (id === 'nearme') {
      navigate('/map', { state: selectedLocation ? { location: selectedLocation } : {} });
    }
  }, [navigate, selectedLocation]);

  const handlePriceApply = useCallback((p) => {
    setFilters(prev => ({ ...prev, minPrice: p.minPrice, maxPrice: p.maxPrice, page: 1 }));
  }, []);

  const handleBedroomsApply = useCallback((p) => {
    setFilters(prev => ({ ...prev, bedrooms: p.bedrooms, page: 1 }));
  }, []);

  const handleFullApply = useCallback((all) => {
    setFilters(prev => ({ ...prev, ...all, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const isFeaturedLoading = showNearby ? nearbyQuery.isLoading : (featuredQuery.isLoading || featuredQuery.isFetching);
  const isListingsLoading = showNearby ? nearbyQuery.isLoading : (newListingsQuery.isLoading || newListingsQuery.isFetching);
  

  const featuredData = showNearby ? [] : featuredQuery.data;
  
  const nearbyData = filteredNearbyData;
  
  const listingsData = showNearby ? [] : (newListingsQuery.data?.properties || []);
  const listingsPagination = showNearby ? null : (newListingsQuery.data?.pagination || null);
  
  const featuredError = showNearby ? nearbyQuery.isError : featuredQuery.isError;
  const listingsError = showNearby ? nearbyQuery.isError : newListingsQuery.isError;

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

        {!showNearby && (
          <div className="mt-4 mb-6">
            <SectionHeader
              title="Featured"
              onSeeAll={() => navigate('/search?featured=true')}
            />
            <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
              {isFeaturedLoading ? (
                Array(4).fill(0).map((_, i) => <FeaturedCardSkeleton key={i} />)
              ) : featuredError ? (
                <div className="w-full">
                  <ErrorState
                    title="Failed to load featured properties"
                    onRetry={() => featuredQuery.refetch()}
                  />
                </div>
              ) : featuredData?.length > 0 ? (
                featuredData.map((p) => (
                  <FeaturedCard key={p.id} {...p} onClick={() => navigate(`/property/${p.id}`)} />
                ))
              ) : (
                <EmptyState
                  icon="home"
                  title="No featured properties"
                  message="Try adjusting your filters"
                />
              )}
            </div>
          </div>
        )}

        {showNearby && (
          <div className="mt-4 mb-6" id="new-listings-section">
            <SectionHeader
              title="Nearby Properties"
              onSeeAll={() => navigate('/map', { state: { location: selectedLocation } })}
            />
            <div className="px-4 flex flex-col gap-4">
              {isFeaturedLoading ? (
                Array(10).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
              ) : featuredError ? (
                <ErrorState
                  title="Failed to load nearby properties"
                  onRetry={() => nearbyQuery.refetch()}
                />
              ) : nearbyData?.length > 0 ? (
                nearbyData.map((p) => (
                  <NewListingCard key={p.id} {...p} onClick={() => navigate(`/property/${p.id}`)} />
                ))
              ) : (
                <EmptyState
                  icon="home"
                  title="No properties found"
                  message={filters.purpose || filters.minPrice || filters.bedrooms
                    ? "No properties match your filters in this area. Try adjusting your filters."
                    : "Try a different location or adjust the search radius"}
                />
              )}
            </div>
          </div>
        )}

        {/* New Listings (WITH PAGINATION) - only when not nearby mode */}
        {!showNearby && (
          <div id="new-listings-section">
            <SectionHeader title="New Listings" onSeeAll={() => navigate('/search?new=true')} />
            <div className="px-4 flex flex-col gap-4">
              {isListingsLoading ? (
                Array(10).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
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

            {listingsPagination && listingsPagination.pages > 1 && (
              <Pagination
                currentPage={listingsPagination.page}
                totalPages={listingsPagination.pages}
                onPageChange={handlePageChange}
                isLoading={isListingsLoading}
              />
            )}
          </div>
        )}

      </div>

      <PriceFilterModal isOpen={activeModal === 'price'} onClose={() => setActiveModal(null)} onApply={handlePriceApply} currentFilters={filters} />
      <BedroomsFilterModal isOpen={activeModal === 'bedrooms'} onClose={() => setActiveModal(null)} onApply={handleBedroomsApply} currentFilters={filters} />
      <FullFiltersModal isOpen={activeModal === 'filters'} onClose={() => setActiveModal(null)} onApply={handleFullApply} currentFilters={filters} />
    </div>
  );
};

export default ExplorePage;
