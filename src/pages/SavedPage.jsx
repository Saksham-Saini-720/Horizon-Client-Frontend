
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/utils/useRedux';
import { useSavedProperties } from '../hooks/properties/useSavedProperties';
import { savedKeys } from '../hooks/properties/useSavedProperties';
import { unsaveProperty as unsavePropertyApi } from '../api/propertyApi';
import { clearAllSaved } from '../store/slices/savedSlice';
import SavedPropertyCard from '../components/saved/SavedPropertyCard';
import { NewListingCardSkeleton } from '../components/ui/SkeletonCards';

// ─── Not Logged In State ────────────────────────────────────────────────────

const NotLoggedInState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 pb-28">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
    <div className="flex flex-col items-center justify-center min-h-[45vh] px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-5">
        <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <h3 className="text-[20px] font-semibold text-primary font-myriad mb-2">
        No saved properties yet
      </h3>
      <p className="text-[14px] text-gray-500 font-myriad mb-7 max-w-sm">
        Start exploring and save your favorites
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white shadow-lg hover:shadow-xl transition-all active:scale-95 bg-gradient-to-r from-secondary to-primary-light"
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
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
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    </div>
    <p className="text-[16px] font-semibold text-primary font-myriad mb-1">
      No {filterName} properties
    </p>
    <p className="text-[14px] text-gray-400 font-myriad">
      Try a different filter
    </p>
  </div>
);

// ─── Clear All Confirmation Modal ────────────────────────────────────────────

const ClearAllModal = ({ isOpen, onClose, onConfirm, count, isClearing }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
          style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)' }}
        >
          <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </div>

        <h3 className="text-[20px] font-bold text-primary font-myriad mb-1.5 text-center">
          Clear all saved?
        </h3>
        <p className="text-[14px] text-gray-500 font-myriad mb-7 text-center leading-relaxed">
          This will permanently remove all {count} saved {count === 1 ? 'property' : 'properties'} from your shortlist.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isClearing}
            className="flex-1 px-4 py-3.5 rounded-2xl border border-gray-200 text-[15px] font-semibold text-primary font-myriad hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isClearing}
            className="flex-1 px-4 py-3.5 rounded-2xl text-white text-[15px] font-semibold font-myriad active:scale-95 transition-all shadow-lg disabled:opacity-60"
            style={{ background: isClearing ? '#ef4444aa' : 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            {isClearing ? 'Clearing…' : 'Clear All'}
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
      return sorted.sort((a, b) => new Date(b.savedAt || b.createdAt) - new Date(a.savedAt || a.createdAt));
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

// ─── Filter Pill ─────────────────────────────────────────────────────────────

const FilterPill = ({ value, label, count, activeFilter, onFilterChange }) => {
  const active = activeFilter === value;
  return (
    <button
      onClick={() => onFilterChange(value)}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold font-myriad transition-all active:scale-95 whitespace-nowrap"
      style={
        active
          ? { background: 'white', color: '#171C26' }
          : { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)' }
      }
    >
      {label}
      {count !== undefined && (
        <span
          className="text-[11px]"
          style={{ color: active ? '#C96C38' : 'rgba(255,255,255,0.5)' }}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// ─── SavedPage ───────────────────────────────────────────────────────────────

const SavedPage = () => {
  const dispatch    = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const savedQuery = useSavedProperties({ enabled: isAuthenticated });

  const [filter, setFilter]             = useState('all');
  const [sort]                          = useState('recent');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing]     = useState(false);

  // Filter and sort
  const processedProperties = useMemo(() => {
    if (!savedQuery.data) return [];
    const filtered = savedQuery.data.filter((p) => {
      if (filter === 'all')      return true;
      if (filter === 'for-sale') return p.tag === 'For Sale' || p.purpose === 'sale';
      if (filter === 'for-rent') return p.tag === 'For Rent' || p.purpose === 'rent';
      return true;
    });
    return sortProperties(filtered, sort);
  }, [savedQuery.data, filter, sort]);

  const filterCounts = useMemo(() => {
    if (!savedQuery.data) return { all: 0, forSale: 0, forRent: 0 };
    return {
      all:     savedQuery.data.length,
      forSale: savedQuery.data.filter(p => p.tag === 'For Sale' || p.purpose === 'sale').length,
      forRent: savedQuery.data.filter(p => p.tag === 'For Rent' || p.purpose === 'rent').length,
    };
  }, [savedQuery.data]);

  // ── Clear all: call API directly so all deletes run concurrently without
  //    the TanStack mutation-instance race condition that caused "only first removed"
  const handleClearAll = useCallback(async () => {
    const propertiesToUnsave = savedQuery.data || [];
    if (!propertiesToUnsave.length) return;

    setIsClearing(true);
    try {
      await Promise.allSettled(
        propertiesToUnsave.map(p => unsavePropertyApi(p.id))
      );
    } finally {
      dispatch(clearAllSaved());
      queryClient.setQueryData(savedKeys.all, []);
      queryClient.invalidateQueries({ queryKey: savedKeys.all });
      setIsClearing(false);
      setShowClearConfirm(false);
    }
  }, [savedQuery.data, dispatch, queryClient]);

  if (!isAuthenticated) return <NotLoggedInState />;

  return (
    <div className="min-h-screen bg-surface pb-28">

      {/* ── Premium Dark Gradient Header ── */}
      <div
        className="relative px-5 pt-12 pb-10 overflow-hidden bg-gradient-to-br from-[#1a2550] to-secondary"
      >
        {/* Glow orb — top-right (large) */}
        <div
          className="absolute -top-6 -right-6 w-52 h-52 rounded-full pointer-events-none"
          style={{ backgroundColor: '#C96C38', opacity: 0.35, filter: 'blur(64px)' }}
        />
        {/* Glow orb — top-right (tight) */}
        <div
          className="absolute top-8 right-10 w-28 h-28 rounded-full pointer-events-none"
          style={{ backgroundColor: '#C96C38', opacity: 0.22, filter: 'blur(40px)' }}
        />
        {/* Glow orb — left balance */}
        <div
          className="absolute top-12 -left-8 w-36 h-36 rounded-full pointer-events-none"
          style={{ backgroundColor: '#C96C38', opacity: 0.12, filter: 'blur(56px)' }}
        />

        {/* Decorative arc lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 260" fill="none" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="370" cy="50"  rx="210" ry="210" stroke="white" strokeWidth="0.8" />
            <ellipse cx="390" cy="90"  rx="160" ry="160" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* ── Top row: label + clear-all button ── */}
        <div className="relative z-10 flex items-center justify-between -mt-6 mb-3">
          <p
            className="text-[11px] font-semibold tracking-[0.15em] uppercase font-myriad"
            style={{ color: '#C96C38' }}
          >
            Shortlist &middot; {filterCounts.all} {filterCounts.all === 1 ? 'home' : 'homes'}
          </p>

          {filterCounts.all > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95 hover:opacity-90"
              style={{
                background: 'rgba(201, 108, 56, 0.18)',
                border: '1px solid rgba(201, 108, 56, 0.35)',
              }}
            >
              <svg
                className="w-3 h-3"
                style={{ color: '#C96C38' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span
                className="text-[11px] font-bold font-myriad tracking-wide"
                style={{ color: '#C96C38' }}
              >
                Clear all
              </span>
            </button>
          )}
        </div>

        {/* ── Title ── */}
        <div className="relative z-10 mb-1.5">
          <span className="text-[30px] font-bold text-white font-myriad">Your </span>
          <span
            className="text-[30px] font-normal italic"
            style={{ color: '#C96C38', fontFamily: 'Georgia, serif' }}
          >
            shortlist
          </span>
        </div>

        {/* ── Subtitle ── */}
        <p
          className="relative z-10 text-[13px] font-myriad mb-5"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {filterCounts.all > 0
            ? `${filterCounts.all} ${filterCounts.all === 1 ? 'property' : 'properties'} saved`
            : 'Start exploring to build your shortlist'}
        </p>

        {/* ── Filter Pills ── */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          <FilterPill value="all"      label="All"      count={filterCounts.all}     activeFilter={filter} onFilterChange={setFilter} />
          <FilterPill value="for-sale" label="For Sale" count={filterCounts.forSale} activeFilter={filter} onFilterChange={setFilter} />
          <FilterPill value="for-rent" label="For Rent" count={filterCounts.forRent} activeFilter={filter} onFilterChange={setFilter} />
        </div>
      </div>

      {/* ── Content ── */}
      <div>
        <div className="px-4 pt-5 relative z-10 -mt-10">
          {savedQuery.isLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)}
            </div>
          ) : savedQuery.isError ? (
            <ErrorState onRetry={() => savedQuery.refetch()} />
          ) : filterCounts.all === 0 ? (
            <EmptySaved />
          ) : processedProperties.length > 0 ? (
            <div className="space-y-3">
              {processedProperties.map((property) => (
                <SavedPropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyFilterResult
              filterName={filter === 'for-sale' ? 'for sale' : 'for rent'}
            />
          )}
        </div>
      </div>

      {/* ── Clear All Modal ── */}
      <ClearAllModal
        isOpen={showClearConfirm}
        onClose={() => !isClearing && setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        count={filterCounts.all}
        isClearing={isClearing}
      />
    </div>
  );
};

export default SavedPage;
