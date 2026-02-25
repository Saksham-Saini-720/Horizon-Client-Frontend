
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useSaved } from "../hooks/utils/useRedux";
import { useSavedPropertiesData } from "../hooks/properties/useProperties";
import SavedPropertyCard from "../components/ui/SavedPropertyCard";
import { NewListingCardSkeleton } from "../components/ui/SkeletonCards";

// ─── Not Logged In State ──────────────────────────────────────────────────────

const NotLoggedInState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center px-4 pb-28">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-[24px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
        No saved properties
      </h2>

      {/* Description */}
      <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] text-center max-w-xs mb-8">
        Log in to save your favorite properties
      </p>

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3.5 rounded-xl bg-[#1C2A3A] text-white text-[15px] font-semibold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] active:scale-95 transition-all shadow-lg"
      >
        Log In
      </button>
    </div>
  );
};

// ─── Empty Saved (Logged In, No Properties) ───────────────────────────────────

const EmptySaved = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      <h3 className="text-[22px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
        No saved properties yet
      </h3>
      <p className="text-[15px] text-gray-500 font-['DM_Sans',sans-serif] mb-8 max-w-sm">
        Start exploring and save your favorites
      </p>
      <button 
        onClick={() => navigate("/")} 
        className="px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white shadow-lg hover:shadow-xl transition-all active:scale-95" 
        style={{ background: "linear-gradient(135deg, #F5B731, #E8A020)" }}
      >
        Explore Properties
      </button>
    </div>
  );
};

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center py-16 text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <p className="text-[17px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
      Failed to load saved properties
    </p>
    <button
      onClick={onRetry}
      className="mt-4 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-gray-800 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// ─── Filter Chip ──────────────────────────────────────────────────────────────

const FilterChip = ({ active, onClick, children }) => (
  <button 
    onClick={onClick} 
    className={`px-5 py-2.5 rounded-full text-[14px] font-semibold font-['DM_Sans',sans-serif] transition-all active:scale-95 ${
      active 
        ? "bg-[#1C2A3A] text-white shadow-md" 
        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
    }`}
  >
    {children}
  </button>
);

// ─── SavedPage ────────────────────────────────────────────────────────────────

const SavedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { savedIds, clearAll, count } = useSaved();
  const savedQuery = useSavedPropertiesData(savedIds);
  
  const [filter, setFilter] = useState("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Show not logged in state
  if (!isAuthenticated) {
    return <NotLoggedInState />;
  }

  const filteredData = savedQuery.data?.filter((p) => {
    if (filter === "all") return true;
    if (filter === "for-sale") return p.tag === "For Sale";
    if (filter === "for-rent") return p.tag === "For Rent";
    return true;
  }) ?? [];

  return (
    <div className="min-h-screen bg-[#F7F6F2] pb-28">

      {/* ── Header (Title + Count + Clear All) ── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[24px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-0.5">
              Saved
            </h1>
            <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif]">
              {count} {count === 1 ? "property" : "properties"}
            </p>
          </div>

          {count > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-[14px] font-semibold text-red-500 hover:text-red-600 font-['DM_Sans',sans-serif] transition-colors px-3 py-1.5"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Filters (only if has saved items) */}
        {count > 0 && (
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterChip>
            <FilterChip active={filter === "for-sale"} onClick={() => setFilter("for-sale")}>
              For Sale
            </FilterChip>
            <FilterChip active={filter === "for-rent"} onClick={() => setFilter("for-rent")}>
              For Rent
            </FilterChip>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-5">
        {count === 0 ? (
          <EmptySaved />
        ) : savedQuery.isLoading ? (
          <div className="space-y-4">
            {Array(2).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)}
          </div>
        ) : savedQuery.isError ? (
          <ErrorState onRetry={() => savedQuery.refetch()} />
        ) : filteredData.length > 0 ? (
          <div className="space-y-4">
            {filteredData.map((property) => (
              <SavedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <p className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
              No {filter.replace("-", " ")} properties
            </p>
            <p className="text-[13px] text-gray-400 font-['DM_Sans',sans-serif]">
              Try a different filter
            </p>
          </div>
        )}
      </div>

      {/* ── Clear All Confirmation Modal ── */}
      {showClearConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowClearConfirm(false)}
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

            <h3 className="text-[19px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
              Clear all saved properties?
            </h3>
            
            <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] mb-6">
              This will remove all {count} saved {count === 1 ? "property" : "properties"}. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] hover:bg-gray-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { clearAll(); setShowClearConfirm(false); }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-[14px] font-semibold font-['DM_Sans',sans-serif] hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/30"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SavedPage;
