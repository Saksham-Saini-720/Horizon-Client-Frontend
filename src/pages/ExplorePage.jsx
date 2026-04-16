
import { useState, useCallback, useMemo, useEffect, useRef  } from "react";
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
import FilterChips from "../components/explore/FilterChips";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../components/ui/SkeletonCards";
import PriceFilterModal from "../components/explore/filters/PriceFilterModal";
import BedroomsFilterModal from "../components/explore/filters/BedroomsFilterModal";
import FullFiltersModal from "../components/explore/filters/FullFiltersModal";
import Pagination from "../components/ui/Pagination";
import one from "../assets/slides/one.jpeg";
import two from "../assets/slides/two.jpeg";
import three from "../assets/slides/three.jpeg";
import four from "../assets/slides/four.jpeg";

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

  // --- Promo Carousel ---
  const PROMO_SLIDES = [
    {
      id: 1,
      image: one,
    },
    {
      id: 2,
      image: two,
    },
    {
      id: 3,
      image: three,
    },
    {
      id: 4,
      image: four,
    },
  ];

  const PEEK = 20;   // px visible from each side
  const GAP  = -2;   // px gap between slides

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselWrapRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const touchStartX = useRef(0);

  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const calc = () => {
      if (carouselWrapRef.current) {
        const containerWidth = carouselWrapRef.current.offsetWidth;
        const isLarge = window.innerWidth >= 768;
        const count = isLarge ? 2 : 1;
        setVisibleCount(count);

        // slideWidth = (container - peek both sides - gaps between visible slides) / count
        const totalGaps = (count - 1) * GAP;
        setSlideWidth((containerWidth - PEEK * 2 - totalGaps) / count);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [GAP]);

  // Auto-scroll every 3.5 seconds
  useEffect(() => {
  const interval = setInterval(() => {
    setCarouselIndex((prev) => {
      const next = prev + 1;
      return next >= PROMO_SLIDES.length ? 0 : next;
    });
  }, 3500);
  return () => clearInterval(interval);
}, [PROMO_SLIDES.length]);

 const goPrev = useCallback(() => {
  setCarouselIndex((prev) => Math.max(prev - visibleCount, 0));
}, [visibleCount]);

const goNext = useCallback(() => {
  setCarouselIndex((prev) => {
    const next = prev + visibleCount;
    return next >= PROMO_SLIDES.length ? 0 : next;
  });
}, [visibleCount]);

  const handleCarouselTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleCarouselTouchEnd = useCallback((e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
  }, [goNext, goPrev]);

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
      {/* Header WITHOUT FilterChips */}
      <ExploreHeader
        onSubmitSearch={handleSearch}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
        currentLocation={selectedLocation}
        onLocationChange={handleLocationChange}
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
        {/* Most Viewed Carousel */}
        {!showNearby && (
          <MostViewedCarousel
            properties={mostViewedQuery.data || []}
            isLoading={mostViewedQuery.isLoading}
            isError={mostViewedQuery.isError}
            onRetry={() => mostViewedQuery.refetch()}
          />
        )}

      
        <div className=" top-[140px] z-40 bg-gradient-to-b from-white via-white to-transparent pt-3 shadow-sm">
          <div className="relative">
            {/* Subtle top gradient border */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            
            {/* Premium filter chips container */}
            <div className="px-4">
              <FilterChips
                activeFilter={activeFilter}
                onToggle={handleFilterToggle}
                dimmed={isFeaturedLoading || isListingsLoading}
              />
            </div>
            
            {/* Subtle bottom gradient border */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
        </div>

        {/* Promo Carousel - 2 slides on large screen, 1 on small */}
        <div className="mt-3 mb-2 py-1">
          <div
            ref={carouselWrapRef}
            className="overflow-hidden w-full"
            style={{ padding: `0 ${PEEK}px` }}
          >
            <div
              className="flex"
              style={{
                transform: `translateX(${-carouselIndex * (slideWidth + GAP)}px)`,
                transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform",
              }}
              onTouchStart={handleCarouselTouchStart}
              onTouchEnd={handleCarouselTouchEnd}
            >
              {PROMO_SLIDES.map((slide, i) => (
                <div
                  key={slide.id}
                  className="relative flex-shrink-0 overflow-hidden my-3 rounded-2xl"
                  style={{
                    // Large screen (>=768px): 2 slides fit → half width minus gap & peek
                    // Small screen (<768px): 1 slide → full width minus peek
                    width: slideWidth > 0 ? `${slideWidth}px` : "calc(100% - 40px)",
                    height: "clamp(120px, 18vw, 230px)",
                    marginRight: `${GAP}px`,
                    // opacity: i === carouselIndex ? 1 : 0.45,
                    transform: i === carouselIndex ? "scale(1)" : "scale(0.93)",
                    transition: "opacity 0.45s ease, transform 0.45s ease",
                    boxShadow: i === carouselIndex
                      ? "0 8px 24px rgba(0,0,0,0.45)"
                      : "0 4px 12px rgba(0,0,0,0.12)",
                  }}
                >
                  <img
                    src={slide.image}
                    alt={`slide-${slide.id}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-2">
            {PROMO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === carouselIndex ? "w-5 bg-secondary" : "w-1.5 bg-gray-300"
                }`}
              />
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
