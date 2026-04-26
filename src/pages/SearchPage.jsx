
import { useState, useCallback, useMemo, useEffect } from "react";
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
import Pagination from "../components/ui/Pagination";

/* Reusable glow filter chip */
const GlowChip = ({ children, onRemove }) => (
  <span
    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold font-myriad"
    style={{
      background: 'rgba(201,108,56,0.10)',
      color: '#C96C38',
      border: '1px solid rgba(201,108,56,0.28)',
      boxShadow: '0 0 10px rgba(201,108,56,0.15)',
    }}
  >
    {children}
    <button
      onClick={onRemove}
      className="ml-0.5 hover:opacity-60 text-[14px] leading-none transition-opacity"
    >
      ×
    </button>
  </span>
);

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState({
    purpose: null,
    sort: 'newest',
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
    if (filters.purpose)           f.purpose   = filters.purpose;
    if (filters.sort)              f.sort      = filters.sort;
    if (filters.minPrice)          f.minPrice  = filters.minPrice;
    if (filters.maxPrice)          f.maxPrice  = filters.maxPrice;
    if (filters.bedrooms)          f.bedrooms  = filters.bedrooms;
    if (filters.bathrooms)         f.bathrooms = filters.bathrooms;
    if (filters.type)              f.type      = filters.type;
    if (filters.amenities?.length) f.amenities = filters.amenities;
    if (query)                     f.search    = query;
    f.page  = filters.page;
    f.limit = filters.limit;
    return f;
  }, [filters, query]);

  const { data, isLoading, isError, error, refetch } = usePropertiesWithFilters(apiFilters);

  const properties = data?.properties || [];
  const pagination = data?.pagination || null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.page]);

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
    submitSearch(newQuery);
    setFilters(prev => ({ ...prev, page: 1 }));
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
      page: 1,
      limit: 10,
    });
  };

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
    else if (id === 'nearme')   navigate('/map');
  }, [navigate]);

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
    <div className="min-h-screen w-full overflow-x-hidden pb-28 bg-surface">

      {/* ===== PREMIUM DARK SEARCH HERO ===== */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(158deg, #07091200 0%, #080c17 8%, #141924 52%, #0d1321 100%)' }}
      >
        {/* Glow orb — orange, top-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-110px', right: '-110px',
            width: '380px', height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,108,56,0.22) 0%, transparent 65%)',
          }}
        />

        {/* Glow orb — indigo, bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-90px', left: '-90px',
            width: '300px', height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,54,142,0.26) 0%, transparent 65%)',
          }}
        />

        {/* Accent glow orb — centre, subtle */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '20px', left: '40%',
            width: '200px', height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,108,56,0.06) 0%, transparent 70%)',
            transform: 'translateX(-50%)',
          }}
        />

        {/* SVG arcs — top-right (orange) */}
        <svg
          className="absolute top-0 right-0 pointer-events-none"
          width="270" height="270"
          viewBox="0 0 270 270"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sp_arcOrange" x1="270" y1="0" x2="0" y2="270" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#C96C38" stopOpacity="0.90" />
              <stop offset="50%"  stopColor="#C96C38" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#C96C38" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <path d="M 270 0 A 270 270 0 0 1 0 270"  stroke="url(#sp_arcOrange)" strokeWidth="1.6" fill="none" />
          <path d="M 270 0 A 218 218 0 0 1 52 270"  stroke="url(#sp_arcOrange)" strokeWidth="1.0" fill="none" opacity="0.55" />
          <path d="M 270 0 A 165 165 0 0 1 105 270" stroke="url(#sp_arcOrange)" strokeWidth="0.7" fill="none" opacity="0.30" />
        </svg>

        {/* SVG arcs — top-left (blue) */}
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width="170" height="170"
          viewBox="0 0 170 170"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sp_arcBlue" x1="0" y1="0" x2="170" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#2D368E" stopOpacity="0.80" />
              <stop offset="100%" stopColor="#2D368E" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <path d="M 0 0 A 170 170 0 0 1 170 170" stroke="url(#sp_arcBlue)" strokeWidth="1.3" fill="none" />
          <path d="M 0 0 A 128 128 0 0 1 128 170" stroke="url(#sp_arcBlue)" strokeWidth="0.8" fill="none" opacity="0.50" />
        </svg>

        {/* Horizontal shimmer line */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '42%',
            left: '8%', right: '8%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,108,56,0.13), rgba(45,54,142,0.10), transparent)',
          }}
        />

        {/* Foreground content */}
        <div className="relative z-10">
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
        </div>

        {/* Fade hero → surface */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F7F6F2)' }}
        />
      </div>

      {/* Sort + Map + Grid row */}
      <div
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div className="overflow-x-auto scrollbar-none w-full">
          <div className="inline-flex items-center justify-between w-full min-w-max px-4 py-3 gap-2">
            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/map")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white flex-shrink-0 active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #C96C38 0%, #a85428 100%)',
                  boxShadow: '0 0 14px rgba(201,108,56,0.45), 0 2px 6px rgba(0,0,0,0.15)',
                }}
                aria-label="Map view"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6"  x2="21" y2="6"  />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span className="text-[12px] font-bold font-myriad">Map</span>
              </button>

              <button
                type="button"
                className="p-1.5 rounded-lg flex-shrink-0 active:scale-95 transition-transform"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(0,0,0,0.10)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
                aria-label="Grid view"
                onClick={() => navigate("/map")}
              >
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3"  y="3"  width="7" height="7" />
                  <rect x="14" y="3"  width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3"  y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {(activeFiltersCount > 0 || query) && (
        <div
          className="px-4 pt-3 pb-3"
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-gray-400 font-myriad uppercase tracking-wider">
              Filters
            </span>

            {query && (
              <GlowChip onRemove={handleClearSearch}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                {query}
              </GlowChip>
            )}

            {filters.purpose === 'sale' && (
              <GlowChip onRemove={() => setFilters(p => ({ ...p, purpose: null, page: 1 }))}>
                For Sale
              </GlowChip>
            )}

            {filters.purpose === 'rent' && (
              <GlowChip onRemove={() => setFilters(p => ({ ...p, purpose: null, page: 1 }))}>
                For Rent
              </GlowChip>
            )}

            {(filters.minPrice || filters.maxPrice) && (
              <GlowChip onRemove={() => setFilters(p => ({ ...p, minPrice: undefined, maxPrice: undefined, page: 1 }))}>
                {filters.minPrice ? `$${filters.minPrice.toLocaleString()}` : '0'} – {filters.maxPrice ? `$${filters.maxPrice.toLocaleString()}` : '∞'}
              </GlowChip>
            )}

            {filters.bedrooms && (
              <GlowChip onRemove={() => setFilters(p => ({ ...p, bedrooms: undefined, page: 1 }))}>
                {filters.bedrooms} Beds
              </GlowChip>
            )}

            {filters.bathrooms && (
              <GlowChip onRemove={() => setFilters(p => ({ ...p, bathrooms: undefined, page: 1 }))}>
                {filters.bathrooms} Baths
              </GlowChip>
            )}

            {filters.type && (
              <GlowChip onRemove={() => setFilters(p => ({ ...p, type: undefined, page: 1 }))}>
                {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
              </GlowChip>
            )}

            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearSearch}
                className="text-[12px] font-semibold font-myriad ml-1 transition-opacity hover:opacity-70"
                style={{ color: '#C96C38' }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Property count */}
      <div className="px-4 pt-4 pb-2">
        {isLoading ? (
          <div className="h-5 w-36 bg-gray-200 rounded-full animate-pulse" />
        ) : pagination ? (
          <p className="text-[14px] text-gray-500 font-myriad">
            <span className="text-[17px] font-bold" style={{ color: '#171C26' }}>
              {pagination.total.toLocaleString()}
            </span>
            {' '}propert{pagination.total === 1 ? 'y' : 'ies'} found
            {filters.purpose === 'sale' && <span style={{ color: '#C96C38' }}> · For sale</span>}
            {filters.purpose === 'rent' && <span style={{ color: '#C96C38' }}> · For rent</span>}
          </p>
        ) : (
          <p className="text-[14px] text-gray-500 font-myriad">
            <span className="text-[17px] font-bold" style={{ color: '#171C26' }}>
              {properties.length}
            </span>{' '}properties
          </p>
        )}
      </div>

      {/* Results */}
      <div className="px-4 flex flex-col gap-4 max-w-full">
        {isLoading ? (
          Array(10).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
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
                  className="mt-4 px-6 py-3 rounded-xl text-[15px] font-semibold font-myriad transition-all active:scale-95"
                  style={{
                    background: 'white',
                    border: '2px solid rgba(201,108,56,0.30)',
                    color: '#C96C38',
                    boxShadow: '0 0 14px rgba(201,108,56,0.15)',
                  }}
                >
                  Clear Filters
                </button>
              ) : null
            }
          />
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Filter Modals — logic unchanged */}
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
