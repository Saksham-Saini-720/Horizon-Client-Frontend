
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { useFeaturedPropertiesFiltered, useNewListingsFiltered } from "../hooks/properties/usePropertiesWithFilters";
import { useMapProperties } from "../hooks/properties/useMapProperties";
import useMostViewedProperties from "../hooks/properties/useMostViewedProperties";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import ExploreHeader from "../components/explore/ExploreHeader";
import FeaturedCard from "../components/explore/FeaturedCard";
import NewListingCard from "../components/explore/NewListingCard";
import SectionHeader from "../components/explore/SectionHeader";
import MostViewedCarousel from "../components/explore/MostViewedCarousel";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../components/ui/SkeletonCards";
import PriceFilterModal from "../components/explore/filters/PriceFilterModal";
import BedroomsFilterModal from "../components/explore/filters/BedroomsFilterModal";
import FullFiltersModal from "../components/explore/filters/FullFiltersModal";
import Pagination from "../components/ui/Pagination";
import auctionLogo from "../assets/icons/auction_logo.png";
import greenVillage from "../assets/icons/green_village.png";
import leading from "../assets/icons/Leading.png";
import tree from "../assets/icons/tree.png";

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

  // --- Our World Section ---
  const PROMO_SLIDES = [
    { id: 1, image: auctionLogo,  label: "AUCTION",  bg: "#ECEAE5" },
    { id: 2, image: greenVillage, label: "VILLAGE",   bg: "#B8CAB5" },
    { id: 3, image: leading,      label: "LEADING",   bg: "#DDD0B0" },
    { id: 4, image: tree,         label: "OUR TREES", bg: "#B8CAB5" },
  ];

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

  const mostViewedQuery = useMostViewedProperties(10, {
    enabled: !showNearby,
  });

  const nearbyQuery = useMapProperties(
    selectedLocation?.lng,
    selectedLocation?.lat,
    5000,
    selectedLocation?.name,
  );

  const filteredNearbyData = useMemo(() => {
    if (!showNearby || !nearbyQuery.data) return [];
    
    let filtered = nearbyQuery.data;
    
    if (filters.purpose) {
      filtered = filtered.filter(p => p.purpose === filters.purpose);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.rawPrice >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.rawPrice <= filters.maxPrice);
    }
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
    if (filters.type) {
      filtered = filtered.filter(p => p.type?.toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.amenities?.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.amenities || !Array.isArray(p.amenities)) return false;
        const propertyAmenities = p.amenities.map(a => a.toLowerCase());
        return filters.amenities.every(a => propertyAmenities.includes(a.toLowerCase()));
      });
    }
    
    return filtered;
  }, [nearbyQuery.data, filters, showNearby]);

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
        currentLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        activeFilter={activeFilter}
        onToggle={handleFilterToggle}
        dimmed={isFeaturedLoading || isListingsLoading}
        onOpenFilters={() => setActiveModal('filters')}
      />

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
        {/* Most Viewed Carousel — overlaps the header bottom edge */}
        {!showNearby && (
          <div className="relative z-40 -mt-12">
            <MostViewedCarousel
              properties={mostViewedQuery.data || []}
              isLoading={mostViewedQuery.isLoading}
              isError={mostViewedQuery.isError}
              onRetry={() => mostViewedQuery.refetch()}
            />
            {/* Premium heading below carousel */}
            {!mostViewedQuery.isLoading && !mostViewedQuery.isError && (mostViewedQuery.data?.length ?? 0) > 0 && (
              <div className="px-5 pt-3 pb-2 flex items-center justify-between ml-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-[21px] font-bold text-primary font-myriad tracking-tight leading-none">
                      Most Viewed
                    </h2>
                    <p className="text-[10px] font-semibold text-gray-400 font-myriad tracking-[0.14em] uppercase mt-0.5">
                      Trending Properties
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/search?sort=views")}
                  className="text-[13px] font-semibold text-primary-light font-myriad flex items-center gap-1 hover:opacity-75 transition-opacity"
                >
                  See All
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Our World Section */}
        <div className="mt-4 mb-2 py-2">
          <div className="flex items-center justify-between px-5 mb-5">
            <div className="relative inline-block pb-[6px]">
              <h2 className="text-[23px] leading-none" style={{ color: "#1A1A1A" }}>
                <span className="font-bold font-myriad text-secondary">Our </span>
                <span className="text-primary-light" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 400 }}>
                  world
                </span>
              </h2>
              <span
                className="absolute left-0 bottom-0 h-[2px] w-[52px]"
                style={{ backgroundColor: "#C96C38" }}
              />
            </div>
            <button
              className="text-[11px] font-bold tracking-[0.18em] font-myriad uppercase"
              style={{ color: "#C96C38" }}
            >
              EXPLORE →
            </button>
          </div>

          <div className="flex gap-7 px-5 overflow-x-auto scrollbar-hide pb-2">
            {PROMO_SLIDES.map((slide) => (
              <div key={slide.id} className="flex flex-col items-center gap-[10px] flex-shrink-0">
                <div
                  className="w-[78px] h-[78px] rounded-full overflow-hidden flex items-center justify-center p-[10px]"
                  style={{ backgroundColor: slide.bg }}
                >
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold font-myriad tracking-[0.12em] text-center text-secondary"
                >
                  {slide.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
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

        {/* Nearby Properties */}
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

        {/* New Listings */}
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

      {/* Modals */}
      <PriceFilterModal isOpen={activeModal === 'price'} onClose={() => setActiveModal(null)} onApply={handlePriceApply} currentFilters={filters} />
      <BedroomsFilterModal isOpen={activeModal === 'bedrooms'} onClose={() => setActiveModal(null)} onApply={handleBedroomsApply} currentFilters={filters} />
      <FullFiltersModal isOpen={activeModal === 'filters'} onClose={() => setActiveModal(null)} onApply={handleFullApply} currentFilters={filters} />
    </div>
  );
};

export default ExplorePage;
