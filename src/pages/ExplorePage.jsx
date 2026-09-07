
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/authSlice";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { useFeaturedPropertiesFiltered, useNewListingsFiltered } from "../hooks/properties/usePropertiesWithFilters";
import { useMapProperties } from "../hooks/properties/useMapProperties";
import useMostViewedProperties from "../hooks/properties/useMostViewedProperties";
import useOurWorld from "../hooks/useOurWorld";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import ExploreHeader from "../components/explore/ExploreHeader";
import FeaturedCard from "../components/explore/FeaturedCard";
import NewListingCard from "../components/explore/NewListingCard";
import SectionHeader from "../components/explore/SectionHeader";
import MostViewedCarousel from "../components/explore/MostViewedCarousel";
import UpdatesCarousel from "../components/explore/UpdatesCarousel";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../components/ui/SkeletonCards";
import PriceFilterModal from "../components/explore/filters/PriceFilterModal";
import BedroomsFilterModal from "../components/explore/filters/BedroomsFilterModal";
import FullFiltersModal from "../components/explore/filters/FullFiltersModal";
import Pagination from "../components/ui/Pagination";
import auctionLogo from "../assets/icons/auction_logo.png";
import greenVillage from "../assets/icons/green_village.png";
import leading from "../assets/icons/Leading.png";
import tree from "../assets/icons/tree.png";

// Bundled fallbacks — shown only until an admin configures logos in the portal.
const DEFAULT_SLIDES = [
  { id: "d1", image: auctionLogo,  label: "AUCTION",   bg: "#ECEAE5", link: null },
  { id: "d2", image: greenVillage, label: "VILLAGE",   bg: "#B8CAB5", link: null },
  { id: "d3", image: leading,      label: "LEADING",   bg: "#DDD0B0", link: null },
  { id: "d4", image: tree,         label: "OUR TREES", bg: "#B8CAB5", link: null },
];

const ExplorePage = () => {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedLocation');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState(() => {
    try {
      const saved = sessionStorage.getItem('exploreFilters');
      return saved ? JSON.parse(saved) : {
        purpose: null,
        minPrice: undefined,
        maxPrice: undefined,
        bedrooms: undefined,
        bathrooms: undefined,
        type: undefined,
        amenities: undefined,
        page: 1,
        limit: 12,
      };
    } catch {
      return {
        purpose: null,
        minPrice: undefined,
        maxPrice: undefined,
        bedrooms: undefined,
        bathrooms: undefined,
        type: undefined,
        amenities: undefined,
        page: 1,
        limit: 12,
      };
    }
  });

  const [activeModal, setActiveModal] = useState(null);

  // Read preference directly from Redux — updated optimistically on every toggle, no async wait
  const user = useSelector(selectUser);
  const prefType = user?.preferences?.interestedIn?.[0];

  // When the user updates their preference, lift the null sentinel so the new preference applies.
  // Render-time state update: safe because it converges in one extra render with no infinite loop.
  const [prevPrefType, setPrevPrefType] = useState(prefType);
  if (prefType !== prevPrefType) {
    setPrevPrefType(prefType);
    if (filters.type === null) setFilters(prev => ({ ...prev, type: undefined }));
  }

  // null means user explicitly cleared the type chip; undefined means "not set — fall back to preference"
  const effectiveType = filters.type !== undefined ? filters.type : prefType;

  useEffect(() => {
    try {
      // Don't persist null — null means "cleared for this visit only"
      // so the preference re-applies on the next mount
      const toSave = { ...filters };
      if (toSave.type === null) delete toSave.type;
      sessionStorage.setItem('exploreFilters', JSON.stringify(toSave));
    } catch {
      return;
    }
  }, [filters]);

  // --- Our World Section (admin-managed, falls back to bundled defaults) ---
  const { data: ourWorldLogos } = useOurWorld();

  const PROMO_SLIDES = useMemo(() => {
    if (!ourWorldLogos?.length) return DEFAULT_SLIDES;
    return ourWorldLogos.map((l) => ({
      id: l._id,
      image: l.image?.url,
      label: l.label,
      bg: l.bg || "#ECEAE5",
      link: l.link || null,
    }));
  }, [ourWorldLogos]);

  // External links open in a new tab; in-app paths navigate within the SPA.
  const openLink = useCallback((link) => {
    if (!link) return;
    if (/^https?:\/\//i.test(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  }, [navigate]);

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  const apiFilters = useMemo(() => {
    const f = {};
    if (filters.purpose)             f.purpose   = filters.purpose;
    if (filters.minPrice)            f.minPrice  = filters.minPrice;
    if (filters.maxPrice)            f.maxPrice  = filters.maxPrice;
    if (filters.bedrooms)            f.bedrooms  = filters.bedrooms;
    if (filters.bathrooms)           f.bathrooms = filters.bathrooms;
    if (effectiveType)               f.type      = effectiveType;
    if (filters.amenities?.length)   f.amenities = filters.amenities;
    f.page  = filters.page;
    f.limit = filters.limit;
    return f;
  }, [filters, effectiveType]);

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
    if (effectiveType) {
      filtered = filtered.filter(p => p.type?.toLowerCase() === effectiveType.toLowerCase());
    }
    if (filters.amenities?.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.amenities || !Array.isArray(p.amenities)) return false;
        const propertyAmenities = p.amenities.map(a => a.toLowerCase());
        return filters.amenities.every(a => propertyAmenities.includes(a.toLowerCase()));
      });
    }
    
    return filtered;
  }, [nearbyQuery.data, filters, showNearby, effectiveType]);

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

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.purpose === 'sale') active.push('buy');
    if (filters.purpose === 'rent') active.push('rent');
    if (filters.minPrice || filters.maxPrice) active.push('price');
    if (filters.bedrooms) active.push('bedrooms');
    if (filters.bathrooms || effectiveType || filters.amenities?.length) active.push('filters');
    return active;
  }, [filters, effectiveType]);

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
    // overflow-x-hidden: decorative blurred orbs in the header are positioned
    // past the viewport edge, and without this they open a sideways scroll that
    // shifts every section off its gutter.
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <ExploreHeader
        onSubmitSearch={handleSearch}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
        currentLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        activeFilters={activeFilters}
        onToggle={handleFilterToggle}
        dimmed={isFeaturedLoading || isListingsLoading}
        onOpenFilters={() => setActiveModal('filters')}
      />

      {showNearby && (
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
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

      {effectiveType && (
        <div className="px-6 py-2.5 flex items-center gap-2 border-b border-gray-100">
          <span className="text-[13px] text-gray-400 font-myriad">Type:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold font-myriad bg-amber-50 border border-amber-200 text-amber-800">
            {effectiveType.charAt(0).toUpperCase() + effectiveType.slice(1)}
            {!filters.type && <span className="text-[11px] font-normal text-amber-500"> · pref</span>}
            <button
              onClick={() => setFilters(p => ({ ...p, type: null, page: 1 }))}
              className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-amber-200 transition-colors"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </span>
        </div>
      )}

      <div className="pb-28">
        {/* Most Viewed Carousel — overlaps the header bottom edge */}
        {!showNearby && (
          // -mt-56 exactly matches the header's pb-56, so this block fills the
          // blue band below the gold rule: the heading takes its top slice and
          // the card overlaps the rest. z-10 replaces z-1000, which Tailwind
          // never generated as a class, so this stacked at auto.
          <div className="relative z-10 -mt-56">
            {/* Above the carousel, like every other section. tone="light"
                because it sits on the blue rather than the white body. */}
            <SectionHeader
              title="Most Viewed"
              tone="light"
              onSeeAll={() => navigate("/search?sort=views")}
            />
            <MostViewedCarousel
              properties={mostViewedQuery.data || []}
              isLoading={mostViewedQuery.isLoading}
              isError={mostViewedQuery.isError}
              onRetry={() => mostViewedQuery.refetch()}
            />
          </div>
        )}

        {/* Our World Section */}
        <div className="mt-4 mb-2 py-2">
          <div className="flex items-center justify-between px-6 mb-5">
            <div className="relative inline-block pb-[6px]">
              <h2 className="text-[23px] leading-none" style={{ color: "#1A1A1A" }}>
                <span className="font-bold font-display text-secondary">Our </span>
                <span className="text-primary-light" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600 }}>
                  world
                </span>
              </h2>
              <span
                className="absolute left-0 bottom-0 h-[2px] w-[52px]"
                style={{ backgroundColor: "#C96C38" }}
              />
            </div>
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="text-[12px] font-semibold tracking-[0.2em] font-myriad uppercase cursor-pointer"
              style={{ color: "#C96C38" }}
            >
              EXPLORE →
            </button>
          </div>

          <div className="flex gap-7 px-6 overflow-x-auto scrollbar-hide pb-2">
            {PROMO_SLIDES.map((slide) => (
              <div
                key={slide.id}
                onClick={() => openLink(slide.link)}
                role={slide.link ? "button" : undefined}
                tabIndex={slide.link ? 0 : undefined}
                onKeyDown={slide.link ? (e) => { if (e.key === "Enter") openLink(slide.link); } : undefined}
                className={`flex flex-col items-center gap-[10px] flex-shrink-0 ${slide.link ? "cursor-pointer" : ""}`}
              >
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
                  className="text-[11px] font-medium font-myriad tracking-[0.12em] text-center text-secondary"
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
            <div className="flex gap-3 px-6 overflow-x-auto scrollbar-hide">
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
                  <FeaturedCard key={p.id} {...p} viewCount={p.viewCount || 0} />
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
            <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

        {/* News & Updates — after the property rails, before the paginated tail.
            New Listings is where someone settles in and starts scrolling, so
            this is the last slot that reliably gets seen.

            Behind the same !showNearby guard as the rest: when a location is
            selected the page is answering "what is for sale around here", and
            company news is not part of that answer. */}
        {!showNearby && <UpdatesCarousel />}

        {/* New Listings */}
        {!showNearby && (
          <div id="new-listings-section">
            <SectionHeader title="New Listings" onSeeAll={() => navigate('/search?new=true')} />
            <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
      <FullFiltersModal isOpen={activeModal === 'filters'} onClose={() => setActiveModal(null)} onApply={handleFullApply} currentFilters={{ ...filters, type: effectiveType }} />
    </div>
  );
};

export default ExplorePage;
