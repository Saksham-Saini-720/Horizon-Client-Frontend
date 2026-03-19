
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth, useSaved } from '../hooks/utils/useRedux';
import { useSavedProperties, useSavePropertyMutation } from '../hooks/properties/useSavedProperties';
import {  clearAllSaved } from '../store/slices/savedSlice';
import SavedPropertyCard from '../components/saved/SavedPropertyCard';
import SavedFilters from '../components/saved/SavedFilters';
import SavedSort from '../components/saved/SavedSort';
import { NewListingCardSkeleton } from '../components/ui/SkeletonCards';

// ─── Not Logged In State ────────────────────────────────────────────────────

const NotLoggedInState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 pb-28">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      <h2 className="text-[24px] font-semibold text-primary font-myriad mb-2">
        No saved properties
      </h2>
      <p className="text-[15px] text-gray-500 font-myriad text-center max-w-xs mb-8">
        Log in to save your favorite properties
      </p>
      <button
        onClick={() => navigate('/login')}
        className="px-8 py-3.5 rounded-xl bg-secondary text-white text-[15px] font-semibold font-myriad hover:bg-secondary/90 active:scale-95 transition-all shadow-lg"
      >
        Log In
      </button>
    </div>
  );
};

// ─── Empty Saved ─────────────────────────────────────────────────────────────

const EmptySaved = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      <h3 className="text-[22px] font-semibold text-primary font-myriad mb-2">
        No saved properties yet
      </h3>
      <p className="text-[15px] text-gray-500 font-myriad mb-8 max-w-sm">
        Start exploring and save your favorites
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg, #F5B731, #DB143C)' }}
      >
        Explore Properties
      </button>
    </div>
  );
};

// ─── Error State ─────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center py-16 text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <p className="text-[17px] font-semibold text-primary font-myriad mb-2">
      Failed to load saved properties
    </p>
    <button
      onClick={onRetry}
      className="mt-4 px-6 py-2.5 rounded-xl bg-secondary text-white text-[15px] font-semibold hover:bg-secondary/90 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// ─── Empty Filter Result ─────────────────────────────────────────────────────

const EmptyFilterResult = ({ filterName }) => (
  <div className="flex flex-col items-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
      <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    </div>
    <p className="text-[16px] font-semibold text-primary font-myriad mb-1">
      No {filterName} properties
    </p>
    <p className="text-[15px] text-gray-400 font-myriad">
      Try a different filter
    </p>
  </div>
);

// ─── Clear All Confirmation Modal ────────────────────────────────────────────

const ClearAllModal = ({ isOpen, onClose, onConfirm, count }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-bold/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>

        <h3 className="text-[19px] font-semibold text-primary font-myriad mb-2">
          Clear all saved properties?
        </h3>

        <p className="text-[15px] text-gray-500 font-myriad mb-6">
          This will remove all {count} saved {count === 1 ? 'property' : 'properties'}. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-primary font-myriad hover:bg-gray-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-[15px] font-semibold font-myriad hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/30"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Utility: Sort Properties ────────────────────────────────────────────────

const sortProperties = (properties, sortType) => {
  const sorted = [...properties];

  switch (sortType) {
    case 'recent':
      // Most recently saved first
      return sorted.sort((a, b) => {
        const dateA = new Date(a.savedAt || a.createdAt);
        const dateB = new Date(b.savedAt || b.createdAt);
        return dateB - dateA;
      });

    case 'price-low':
      return sorted.sort((a, b) => {
        const priceA = a.rawPrice || parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB = b.rawPrice || parseInt(b.price.replace(/[^0-9]/g, ''));
        return priceA - priceB;
      });

    case 'price-high':
      return sorted.sort((a, b) => {
        const priceA = a.rawPrice || parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB = b.rawPrice || parseInt(b.price.replace(/[^0-9]/g, ''));
        return priceB - priceA;
      });

    case 'name-az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sorted;
  }
};

// ─── SavedPage ───────────────────────────────────────────────────────────────

const SavedPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { unsaveProperty } = useSavePropertyMutation();
  
  // Fetch saved properties from API
  const savedQuery = useSavedProperties({
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // list or grid


  // Filter and sort properties
  const processedProperties = useMemo(() => {
    if (!savedQuery.data) return [];

    // Apply filter
    const filtered = savedQuery.data.filter((p) => {
      if (filter === 'all') return true;
      if (filter === 'for-sale') return p.tag === 'For Sale' || p.purpose === 'sale';
      if (filter === 'for-rent') return p.tag === 'For Rent' || p.purpose === 'rent';
      return true;
    });

    // Apply sort
    return sortProperties(filtered, sort);
  }, [savedQuery.data, filter, sort]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    if (!savedQuery.data) return { all: 0, forSale: 0, forRent: 0 };

    return {
      all: savedQuery.data.length,
      forSale: savedQuery.data.filter(p => p.tag === 'For Sale' || p.purpose === 'sale').length,
      forRent: savedQuery.data.filter(p => p.tag === 'For Rent' || p.purpose === 'rent').length,
    };
  }, [savedQuery.data]);

  const handleClearAll = useCallback(async () => {
    // Unsave all properties one by one
    const propertiesToUnsave = savedQuery.data || [];
    
    for (const property of propertiesToUnsave) {
      unsaveProperty({ propertyId: property.id });
    }

    // Also clear Redux
    dispatch(clearAllSaved());
    
    setShowClearConfirm(false);
  }, [savedQuery.data, unsaveProperty, dispatch]);

  // Show not logged in state
  if (!isAuthenticated) {
    return <NotLoggedInState />;
  }

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* ── STICKY HEADER (FIXED) ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            {/* <h1 className="text-[24px] font-semibold text-primary font-myriad mb-0.5">
              Saved
            </h1> */}
            <p className="text-[15px] text-gray-500 font-myriad">
              {filterCounts.all} {filterCounts.all === 1 ? 'property' : 'properties'} saved
            </p>
          </div>

          {/* View Toggle & Sort */}
          {filterCounts.all > 0 && (
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                  aria-label="List view"
                >
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <SavedSort activeSort={sort} onSortChange={setSort} />
            </div>
          )}
        </div>

        {/* Filters & Clear All - ALWAYS VISIBLE (STICKY) */}
        {filterCounts.all > 0 && (
          <div className="flex items-center justify-between gap-3">
            <SavedFilters
              activeFilter={filter}
              onFilterChange={setFilter}
              counts={filterCounts}
            />

            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-[12px] font-semibold text-red-500 hover:text-red-600 font-myriad transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-4">
        {savedQuery.isLoading ? (
          // Loading skeletons
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)}
          </div>
        ) : savedQuery.isError ? (
          // Error state
          <ErrorState onRetry={() => savedQuery.refetch()} />
        ) : filterCounts.all === 0 ? (
          // Empty state (no saved properties)
          <EmptySaved />
        ) : processedProperties.length > 0 ? (
          // Show properties
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-3'
                : 'space-y-4'
            }
          >
            {processedProperties.map((property) => (
              <SavedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          // Empty filter result
          <EmptyFilterResult
            filterName={filter === 'for-sale' ? 'for sale' : 'for rent'}
          />
        )}
      </div>

      {/* ── Clear All Confirmation Modal ── */}
      <ClearAllModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        count={filterCounts.all}
      />
    </div>
  );
};

export default SavedPage;
