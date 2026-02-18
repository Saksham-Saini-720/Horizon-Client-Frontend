
import { useState, useEffect, useTransition, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import useRecentSearches from "../../hooks/useRecentSearches";
import useSearchSubmit   from "../../hooks/useDebounceSearch";

import ExploreHeader     from "../../components/explore/ExploreHeader";
import FeaturedCard      from "../../components/explore/FeaturedCard";
import NewListingCard    from "../../components/explore/NewListingCard";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../../components/ui/SkeletonCards";

// ─── Static Data ──────────────────────────────────────────────────────────────

const FEATURED = [
  { id: 1, price: "$850,000",  title: "Modern Executive Villa in...",   location: "Kabulonga, Lusaka",     img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" },
  { id: 2, price: "$4,500/mo", title: "Luxury Penthouse at Roma Park",  location: "Roma Park, Lusaka",     img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" },
  { id: 3, price: "$275,000",  title: "Elegant Townhouse in Woodlands", location: "Woodlands, Lusaka",     img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80" },
  { id: 4, price: "$450,000",  title: "Beachfront Villa in Siavonga",   location: "Lake Kariba, Siavonga", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80" },
];

const NEW_LISTINGS = [
  { id: 5, price: "$275,000",  title: "Elegant Townhouse in Woodlands", location: "Woodlands, Lusaka", beds: 3, baths: 2, area: "200 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80" },
  { id: 6, price: "$1,800/mo", title: "Modern 2-Bed Apartment",         location: "Woodlands, Lusaka", beds: 2, baths: 2, area: "110 sqm", tag: "For Rent", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id: 7, price: "$320,000",  title: "Spacious Family Home",           location: "Chilenje, Lusaka",  beds: 4, baths: 3, area: "280 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
];

// ─── Small helpers ────────────────────────────────────────────────────────────

const SectionHeader = ({ title, onSeeAll }) => (
  <div className="flex items-center justify-between px-4 mb-3">
    <h2 className="text-[17px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">{title}</h2>
    <button onClick={onSeeAll} className="flex items-center gap-0.5 text-[13px] font-semibold text-amber-500 font-['DM_Sans',sans-serif]">
      See all
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center py-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
      <svg className="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
      </svg>
    </div>
    <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">No listings found</p>
    <p className="text-[12px] text-gray-400 mt-1 font-['DM_Sans',sans-serif]">Try a different filter</p>
  </div>
);

// ─── ExplorePage ──────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [isPending, startTransition]    = useTransition();
  const [isLoading, setIsLoading]       = useState(true);

  // Mount pe 1.5s shimmer, phir data dikhao
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []); // sirf mount pe ek baar

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  const handleFilterToggle = useCallback((id) => {
    startTransition(() => setActiveFilter((prev) => (prev === id ? null : id)));
  }, []);

  const filteredFeatured = useMemo(() => {
    if (activeFilter === "rent") return FEATURED.filter((p) => p.price.includes("/mo"));
    if (activeFilter === "buy")  return FEATURED.filter((p) => !p.price.includes("/mo"));
    return FEATURED;
  }, [activeFilter]);

  const filteredListings = useMemo(() => {
    if (activeFilter === "rent") return NEW_LISTINGS.filter((p) => p.tag === "For Rent");
    if (activeFilter === "buy")  return NEW_LISTINGS.filter((p) => p.tag === "For Sale");
    return NEW_LISTINGS;
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#F7F6F2]">

      <ExploreHeader
        onSubmitSearch={submitSearch}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
        activeFilter={activeFilter}
        onFilterToggle={handleFilterToggle}
        filtersDimmed={isPending}
      />

      <div className="pb-28">

        {/* Featured */}
        <div className="mt-4 mb-6">
          <SectionHeader title="Featured" onSeeAll={() => navigate("/search?featured=true")} />
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {isLoading || isPending
              ? Array(4).fill(0).map((_, i) => <FeaturedCardSkeleton key={i} />)
              : filteredFeatured.map((p) => <FeaturedCard key={p.id} {...p} />)
            }
          </div>
        </div>

        {/* New Listings */}
        <div>
          <SectionHeader title="New Listings" onSeeAll={() => navigate("/search?new=true")} />
          <div className="px-4 flex flex-col gap-4">
            {isLoading || isPending
              ? Array(3).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
              : filteredListings.length > 0
                ? filteredListings.map((p) => <NewListingCard key={p.id} {...p} />)
                : <EmptyState />
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExplorePage;
