import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HorizonLogo } from "../../components/layouts/Navbar";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FEATURED = [
  { id: 1, price: "$850,000",  title: "Modern Executive Villa in...",    location: "Kabulonga, Lusaka",    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" },
  { id: 2, price: "$4,500/mo", title: "Luxury Penthouse at Roma Park",   location: "Roma Park, Lusaka",    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" },
  { id: 3, price: "$275,000",  title: "Elegant Townhouse in Woodlands",  location: "Woodlands, Lusaka",    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80" },
  { id: 4, price: "$450,000",  title: "Beachfront Villa in Siavonga",    location: "Lake Kariba, Siavonga",img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80" },
];

const NEW_LISTINGS = [
  { id: 5, price: "$275,000",  title: "Elegant Townhouse in Woodlands", location: "Woodlands, Lusaka",  beds: 3, baths: 2, area: "200 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80" },
  { id: 6, price: "$1,800/mo", title: "Modern 2-Bed Apartment",          location: "Woodlands, Lusaka",  beds: 2, baths: 2, area: "110 sqm", tag: "For Rent", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id: 7, price: "$320,000",  title: "Spacious Family Home",            location: "Chilenje, Lusaka",   beds: 4, baths: 3, area: "280 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
];

const FILTERS = [
  { id: "buy",      label: "Buy" },
  { id: "rent",     label: "Rent" },
  { id: "price",    label: "Price" },
  { id: "bedrooms", label: "Bedrooms" },
  {
    id: "nearme", label: "Near Me",
    icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  },
  {
    id: "filters", label: "Filters",
    icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
  },
];

// ─── Heart Button ─────────────────────────────────────────────────────────────

const HeartBtn = ({ size = "sm" }) => {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
      className={`${size === "sm" ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-white shadow-md flex items-center justify-center transition-transform active:scale-90`}
    >
      <svg
        className={`w-4 h-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
};

// ─── Featured Card ────────────────────────────────────────────────────────────

const FeaturedCard = ({ id, price, title, location, img }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/property/${id}`)} className="flex-shrink-0 w-44 cursor-pointer">
      <div className="relative h-32 rounded-2xl overflow-hidden bg-gray-200">
        <img src={img} alt={title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <p className="absolute bottom-2 left-3 text-white text-[13px] font-bold font-['DM_Sans',sans-serif]">{price}</p>
        <div className="absolute top-2 right-2"><HeartBtn size="sm" /></div>
      </div>
      <p className="text-[13px] font-semibold text-[#1C2A3A] mt-2 leading-snug font-['DM_Sans',sans-serif] line-clamp-1">{title}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif] line-clamp-1">{location}</p>
      </div>
    </div>
  );
};

// ─── New Listing Card ─────────────────────────────────────────────────────────

const NewListingCard = ({ id, price, title, location, beds, baths, area, tag, img }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/property/${id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.99] transition-transform cursor-pointer">
      <div className="relative h-1/2 bg-gray-100 overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover" loading="lazy" />
        <span className={`absolute top-3 left-3 text-[12px] font-bold px-3 py-1 rounded-full font-['DM_Sans',sans-serif]
          ${tag === "For Sale" ? "bg-[#1C2A3A] text-white" : "bg-amber-400 text-[#1C2A3A]"}`}>
          {tag}
        </span>
        <div className="absolute top-3 right-3"><HeartBtn size="md" /></div>
      </div>
      <div className="px-4 pt-3 pb-4">
        <p className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">{price}</p>
        <p className="text-[14px] font-bold text-[#1C2A3A] mt-0.5 font-['DM_Sans',sans-serif]">{title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">{location}</p>
        </div>
        <div className="h-px bg-gray-100 my-3" />
        <div className="flex items-center gap-4">
          {[
            { icon: <><path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/><path d="M2 15h20"/><path d="M5 15v-3"/><path d="M19 15v-3"/></>, label: `${beds} Beds` },
            { icon: <><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z"/><path d="M6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6"/></>, label: `${baths} Baths` },
            { icon: <rect x="3" y="3" width="18" height="18" rx="2"/>, label: area },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">{icon}</svg>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ExplorePage ──────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const navigate = useNavigate();
  const [query, setQuery]           = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  const handleSearch = () => {
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">

      {/* ════════════════════════════════════════
          STICKY TOP BLOCK — scrolling nahi hoga
          ════════════════════════════════════════ */}
      <div className="sticky top-0 z-50 bg-[#F7F6F2]">

        {/* Location Row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-1">
              Your Location
            </p>
            <button className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                Lusaka, Zambia
              </span>
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          <HorizonLogo size={40} />
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search location, city, or area..."
              className="flex-1 bg-transparent outline-none border-none text-[15px] text-gray-700 placeholder-gray-400 font-['DM_Sans',sans-serif]"
            />
            {query
              ? <button onClick={() => setQuery("")} className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              : <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="9" y="2" width="6" height="11" rx="3"/>
                  <path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 19v3"/><path d="M9 22h6"/>
                </svg>
            }
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {FILTERS.map(({ id, label, icon }) => {
            const isActive = activeFilter === id;
            return (
              <button
                key={id}
                onClick={() => setActiveFilter(isActive ? null : id)}
                className={`
                  flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full border
                  text-[13px] font-semibold font-['DM_Sans',sans-serif] transition-all active:scale-95
                  ${isActive
                    ? "bg-[#1C2A3A] text-white border-[#1C2A3A]"
                    : "bg-white text-[#1C2A3A] border-gray-200"
                  }
                `}
              >
                {icon && icon}
                {label}
              </button>
            );
          })}
        </div>

        {/* Subtle shadow to separate from scroll content */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* ════════════════════════════
          SCROLLABLE CONTENT BELOW
          ════════════════════════════ */}
      <div className="pb-28">

        {/* Featured */}
        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-[17px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">Featured</h2>
            <button onClick={() => navigate("/search?featured=true")}
              className="flex items-center gap-0.5 text-[13px] font-semibold text-amber-500 font-['DM_Sans',sans-serif]">
              See all
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {FEATURED.map((p) => <FeaturedCard key={p.id} {...p} />)}
          </div>
        </div>

        {/* New Listings */}
        <div>
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-[17px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">New Listings</h2>
            <button onClick={() => navigate("/search?new=true")}
              className="flex items-center gap-0.5 text-[13px] font-semibold text-amber-500 font-['DM_Sans',sans-serif]">
              See all
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="px-4 flex flex-col gap-4">
            {NEW_LISTINGS.map((p) => <NewListingCard key={p.id} {...p} />)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExplorePage;
