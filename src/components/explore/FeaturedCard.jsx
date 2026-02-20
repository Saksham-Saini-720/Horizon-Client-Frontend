
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropertyImage from "../ui/PropertyImage";
import HeartBtn from "../ui/HeartBtn";

const FeaturedCard = memo(({ id, price, title, location, img }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  return (
    <div onClick={handleClick} className="flex-shrink-0 w-48 cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg active:scale-[0.99] transition-all group mb-3">

      {/* Image with price + heart */}
      <div className="relative h-32 rounded-2xl overflow-hidden bg-gray-200">
        <PropertyImage src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Dark gradient so price text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <p className="absolute bottom-2 left-3 text-white text-[13px] font-bold font-['DM_Sans',sans-serif]">
          {price}
        </p>

        <div className="absolute top-2 right-2">
          <HeartBtn size="sm" propertyId={id} />
        </div>
      </div>

      {/* Title + Location */}
      <p className="px-2 text-[13px] font-semibold text-[#1C2A3A] mt-2 leading-snug font-['DM_Sans',sans-serif] line-clamp-1">
        {title}
      </p>

      <div className="flex items-center gap-1 mt-0.5 px-2 pb-1">
        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif] line-clamp-1">{location}</p>
      </div>

    </div>
  );
});

export default FeaturedCard;
