
import { useSearchParams } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit   from "../hooks/utils/useDebounceSearch";
import { useSearchProperties } from "../hooks/properties/useProperties";
import SearchBar         from "../components/layouts/SearchBar";
import NewListingCard    from "../components/explore/NewListingCard";
import { NewListingCardSkeleton } from "../components/ui/SkeletonCards";

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ query }) => (
  <div className="flex flex-col items-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    </div>
    <p className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
      No results found
    </p>
    <p className="text-[13px] text-gray-400 mt-1 font-['DM_Sans',sans-serif]">
      {query ? `No properties match "${query}"` : "Try a different search"}
    </p>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center py-20 text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <p className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
      Failed to load results
    </p>
    <p className="text-[13px] text-gray-400 font-['DM_Sans',sans-serif] mb-4">
      {message || "Something went wrong"}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// ─── SearchPage ───────────────────────────────────────────────────────────────

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  // TanStack Query — auto-fetch when query changes
  const searchQuery = useSearchProperties(query, !!query);

  return (
    <div className="min-h-screen bg-[#F7F6F2] pb-28">

      {/* ── Sticky search bar ── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <SearchBar
          initialQuery={query}
          recentSearches={recent.searches}
          onSubmit={submitSearch}
          onRemoveRecent={recent.remove}
          onClearAllRecent={recent.clearAll}
        />
      </div>

      {/* ── Results header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          {searchQuery.isLoading ? (
            // Skeleton for header text
            <div className="space-y-1.5">
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                {query
                  ? <>Results for <span className="text-amber-500">"{query}"</span></>
                  : "All Properties"
                }
              </p>
              <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
                {searchQuery.data?.length ?? 0} properties found
              </p>
            </>
          )}
        </div>

        {/* Filter button */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-[13px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] hover:border-amber-300 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filter
        </button>
      </div>

      {/* ── Results ── */}
      <div className="px-4 flex flex-col gap-4">
        {searchQuery.isLoading
          // Shimmer cards
          ? Array(4).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)

          // Error state
          : searchQuery.isError
            ? <ErrorState message={searchQuery.error?.message} onRetry={() => searchQuery.refetch()} />

            // Real results or empty
            : searchQuery.data && searchQuery.data.length > 0
              ? searchQuery.data.map((p) => <NewListingCard key={p.id} {...p} />)
              : <EmptyState query={query} />
        }
      </div>

    </div>
  );
};

export default SearchPage;
