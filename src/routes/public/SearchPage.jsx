// src/routes/public/SearchPage.jsx
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/layouts/SearchBar"
// ─── Mock Property Data ───────────────────────────────────────────────────────
// Real API se replace karna jab ready ho

const MOCK_PROPERTIES = [
  { id: 1, title: "Modern Villa", location: "Lusaka, Roma",        price: "K 850,000", beds: 4, baths: 3, area: "320 m²", tag: "For Sale",  bg: "#E8F4F8" },
  { id: 2, title: "City Apartment", location: "Lusaka, Woodlands", price: "K 12,000/mo", beds: 2, baths: 1, area: "95 m²",  tag: "For Rent",  bg: "#F4F0E8" },
  { id: 3, title: "Office Space",   location: "Lusaka, CBD",       price: "K 25,000/mo", beds: 0, baths: 2, area: "210 m²", tag: "For Rent",  bg: "#EEF4EE" },
  { id: 4, title: "Family Home",    location: "Ndola, Northrise",  price: "K 430,000",  beds: 3, baths: 2, area: "180 m²", tag: "For Sale",  bg: "#F8EEF0" },
  { id: 5, title: "Luxury Penthouse", location: "Lusaka, Kabulonga", price: "K 1,200,000", beds: 5, baths: 4, area: "480 m²", tag: "For Sale", bg: "#F0EEF8" },
  { id: 6, title: "Studio Flat",    location: "Livingstone, Centre", price: "K 7,500/mo", beds: 1, baths: 1, area: "48 m²", tag: "For Rent",  bg: "#F8F4EE" },
];

// ─── Property Card ────────────────────────────────────────────────────────────

const PropertyCard = ({ title, location, price, beds, baths, area, tag, bg }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-[#EEEDE8] overflow-hidden hover:shadow-md active:scale-[0.99] transition-all cursor-pointer">

    {/* Image placeholder */}
    <div className="flex items-center justify-center relative" style={{ background: bg }}>
      <svg className="w-12 h-1/2 text-gray-300" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
      {/* Tag */}
      <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full
        ${tag === "For Sale" ? "bg-amber-400 text-[#1C2A3A]" : "bg-[#1C2A3A] text-white"}`}>
        {tag}
      </span>
    </div>

    {/* Info */}
    <div className="px-4 py-3">
      <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">{title}</p>
      <p className="text-[12px] text-gray-400 mt-0.5 font-['DM_Sans',sans-serif]">{location}</p>

      {/* Stats */}
      <div className="flex items-center gap-3 mt-2">
        {beds > 0 && (
          <span className="flex items-center gap-1 text-[12px] text-gray-500">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
              <path d="M2 15h20" /><path d="M5 15v-3" /><path d="M19 15v-3" />
            </svg>
            {beds}
          </span>
        )}
        <span className="flex items-center gap-1 text-[12px] text-gray-500">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6 C9 4.34 10.34 3 12 3 C13.66 3 15 4.34 15 6 L15 8 L9 8 Z" />
            <rect x="3" y="8" width="18" height="4" rx="1" />
            <path d="M5 12v4" /><path d="M19 12v4" />
          </svg>
          {baths}
        </span>
        <span className="flex items-center gap-1 text-[12px] text-gray-500">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          {area}
        </span>
      </div>

      {/* Price */}
      <p className="text-[16px] font-bold text-amber-500 mt-2 font-['DM_Sans',sans-serif]">{price}</p>
    </div>
  </div>
);

// ─── SearchPage ───────────────────────────────────────────────────────────────

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  // Filter mock data by query (replace with real API call)
  const results = MOCK_PROPERTIES.filter((p) =>
    query
      ? p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-[#F7F6F2] pb-6">

      {/* ── Search bar (refine search) ── */}
      <div className="px-5 pt-4 pb-4 bg-white border-b border-[#EEEDE8]">
        <SearchBar />
      </div>

      {/* ── Results header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div>
          {query
            ? <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                Results for <span className="text-amber-500">"{query}"</span>
              </p>
            : <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                All Properties
              </p>
          }
          <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
            {results.length} properties found
          </p>
        </div>

        {/* Filter button (placeholder) */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EEEDE8] shadow-sm text-[13px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] hover:border-amber-300 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filter
        </button>
      </div>

      {/* ── Results grid ── */}
      <div className="px-5">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((p) => (
              <PropertyCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <p className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              No results found
            </p>
            <p className="text-[13px] text-gray-400 mt-1 font-['DM_Sans',sans-serif]">
              Try a different location or property type
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
