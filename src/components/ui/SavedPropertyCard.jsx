
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSaved } from "../../hooks/utils/useRedux"; // ← Redux hook
import PropertyImage from "../ui/PropertyImage";

const SavedPropertyCard = memo(({ property }) => {
  const navigate = useNavigate();
  const { removeSaved } = useSaved(); // ← Redux instead of Context

  const { id, price, title, location, beds, baths, area, tag, img } = property;

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    removeSaved(id);
  }, [removeSaved, id]);

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer group"
    >
      {/* ── Large Image ── */}
      <div className="relative h-full bg-gray-100 overflow-hidden">
        <PropertyImage 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />

        {/* Tag - top left */}
        {tag && (
          <span className={`absolute top-4 left-4 text-[13px] font-bold px-4 py-1.5 rounded-full font-['DM_Sans',sans-serif]
            ${tag === "For Sale" ? "bg-[#1C2A3A] text-white" : "bg-amber-400 text-[#1C2A3A]"}`}>
            {tag}
          </span>
        )}

        {/* Remove button - top right, visible on hover */}
        <button
          onClick={handleRemove}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:shadow-xl active:scale-90"
          aria-label="Remove from saved"
        >
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* ── Info Section ── */}
      <div className="px-5 pt-4 pb-5">
        
        {/* Price */}
        <p className="text-[24px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
          {price}
        </p>

        {/* Title */}
        <h3 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-4">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p className="text-[13px] text-gray-500 font-['DM_Sans',sans-serif] truncate">
            {location}
          </p>
        </div>

        {/* Specs Row - Beds, Baths, Area */}
        {(beds || baths || area) && (
          <div className="flex items-center gap-6">
            {beds && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 9v12h18V9M3 9l9-6 9 6M12 3v6"/>
                  <rect x="5" y="13" width="4" height="4"/>
                  <rect x="15" y="13" width="4" height="4"/>
                </svg>
                <span className="text-[13px] text-gray-600 font-['DM_Sans',sans-serif]">
                  {beds} Beds
                </span>
              </div>
            )}

            {baths && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M9 6a3 3 0 1 0 6 0"/>
                  <path d="M3 12h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z"/>
                </svg>
                <span className="text-[13px] text-gray-600 font-['DM_Sans',sans-serif]">
                  {baths} Baths
                </span>
              </div>
            )}

            {area && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                <span className="text-[13px] text-gray-600 font-['DM_Sans',sans-serif]">
                  {area}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
});

export default SavedPropertyCard;
