
import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropertyImage from "../ui/PropertyImage";
import HeartBtn from "../ui/HeartBtn";

// ─── Small spec item (Beds / Baths / Area) ───────────────────────────────────

const SpecItem = ({ label, children }) => (
  <span className="flex items-center gap-1.5 text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {children}
    </svg>
    {label}
  </span>
);


const NewListingCard = memo(({ id, price, title, location, beds, baths, area, tag, img }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const isForSale = tag === "For Sale";

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="relative bg-gray-100 overflow-hidden h-full">
        <PropertyImage src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* For Sale / For Rent tag */}
        <span className={`absolute top-3 left-3 text-[12px] font-bold px-3 py-1 rounded-full font-['DM_Sans',sans-serif]
          ${isForSale ? "bg-[#1C2A3A] text-white" : "bg-amber-400 text-[#1C2A3A]"}`}>
          {tag}
        </span>

        <div className="absolute top-3 right-3">
          <HeartBtn size="md" propertyId={id} />
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">{price}</p>
        <p className="text-[14px] font-bold text-[#1C2A3A] mt-0.5 font-['DM_Sans',sans-serif]">{title}</p>

        <div className="flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">{location}</p>
        </div>

        <div className="h-px bg-gray-100 my-3" />

        {/* Beds / Baths / Area */}
        <div className="flex items-center gap-4">
          <SpecItem label={`${beds} Beds`}>
            <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7" />
            <path d="M2 15h20" /><path d="M5 15v-3" /><path d="M19 15v-3" />
          </SpecItem>

          <SpecItem label={`${baths} Baths`}>
            <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z" />
            <path d="M6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6" />
          </SpecItem>

          <SpecItem label={area}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </SpecItem>
        </div>
      </div>
    </div>
  );
});

export default NewListingCard;
