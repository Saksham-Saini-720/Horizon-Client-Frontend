
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useRecentSearches from "../../hooks/useRecentSearches";
import useSearchSubmit   from "../../hooks/useDebounceSearch";
import SearchBar         from "../../components/layouts/SearchBar";
import NewListingCard    from "../../components/explore/NewListingCard";
import { NewListingCardSkeleton } from "../../components/ui/SkeletonCards";

// ─── Mock Data (replace with API call) ───────────────────────────────────────

const ALL_PROPERTIES = [
  { id: 1, price: "$850,000",  title: "Modern Executive Villa",        location: "Kabulonga, Lusaka", beds: 5, baths: 4, area: "450 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80" },
  { id: 2, price: "$4,500/mo", title: "Luxury Penthouse at Roma Park", location: "Roma Park, Lusaka", beds: 3, baths: 2, area: "220 sqm", tag: "For Rent", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
  { id: 3, price: "$275,000",  title: "Elegant Townhouse Woodlands",   location: "Woodlands, Lusaka", beds: 3, baths: 2, area: "200 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80" },
  { id: 4, price: "$450,000",  title: "Beachfront Villa Siavonga",     location: "Lake Kariba",       beds: 4, baths: 3, area: "320 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80" },
  { id: 5, price: "$1,800/mo", title: "Modern 2-Bed Apartment",        location: "Woodlands, Lusaka", beds: 2, baths: 2, area: "110 sqm", tag: "For Rent", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id: 6, price: "$320,000",  title: "Spacious Family Home",          location: "Chilenje, Lusaka",  beds: 4, baths: 3, area: "280 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
  { id: 7, price: "$195,000",  title: "Starter Home Matero",           location: "Matero, Lusaka",    beds: 3, baths: 1, area: "130 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80" },
];

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
      {query ? `"${query}" ke liye koi property nahi mili` : "Try a different search"}
    </p>
  </div>
);

// ─── SearchPage ───────────────────────────────────────────────────────────────

const SearchPage = () => {
  const [searchParams]        = useSearchParams();
  const query                 = searchParams.get("q") ?? "";

  // isLoading: page mount hone par ya query change hone par 1.5s shimmer
  const [isLoading, setIsLoading] = useState(true);

  const recent               = useRecentSearches();
  const { submitSearch }     = useSearchSubmit({ onSearch: recent.add });

  // Query badlne par ya mount hone par shimmer dikhao, phir results
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second shimmer

    return () => clearTimeout(timer); // cleanup on query change
  }, [query]); // ← har naye query par re-run

  // Results filter (real API pe yahan fetch call hogi)
  const results = ALL_PROPERTIES.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

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
          {isLoading ? (
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
                {results.length} properties found
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

      {/* ── Results / Skeleton / Empty ── */}
      <div className="px-4 flex flex-col gap-4">
        {isLoading
          // Shimmer cards
          ? Array(4).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)

          // Real results
          : results.length > 0
            ? results.map((p) => <NewListingCard key={p.id} {...p} />)

            // No results
            : <EmptyState query={query} />
        }
      </div>

    </div>
  );
};

export default SearchPage;
