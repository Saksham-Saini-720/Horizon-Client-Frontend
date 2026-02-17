
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = ({ placeholder = "Search properties, locations...", className = "" }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Agar SearchPage par already hain toh existing query pre-fill karo
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={`flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#EEEDE8] ${className}`}>
      {/* Search icon */}
      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none border-none text-[15px] text-[#1C2A3A] placeholder-gray-400 font-['DM_Sans',sans-serif]"
      />

      {/* Clear button */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0"
        >
          <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="flex-shrink-0 h-8 px-4 rounded-xl text-[13px] font-semibold text-white transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, #F5B731, #E8A020)" }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
