
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropertyImage from "../ui/PropertyImage";
import HeartBtn from "../ui/HeartBtn";
import PropertyPrice from "../ui/PropertyPrice";

const formatViewCount = (count) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count ?? 0);
};

const FeaturedCard = memo(({
  id, price, title, location, img, beds, baths, area, rating,
  tag,
  postedLabel, postedExact,
  viewCount = 0,
  // Set by the Most Viewed carousel, which caps it to the space between the page
  // gutters. Left off, the card keeps its natural width for the Featured row.
  width,
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const isForSale = !tag || tag?.toLowerCase().includes("sale");

  return (
    // Deep, blue-tinted shadow: shadow-sm vanished against the header's blue,
    // and a neutral grey shadow reads muddy over it.
    <div
      onClick={handleClick}
      className={`flex-shrink-0 cursor-pointer bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover active:scale-[0.99] transition-all group mb-3 ${width ? "" : "w-72"}`}
      style={width ? { width } : undefined}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-200">
        <PropertyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Keeps the badges legible over a bright photo */}
        <div
          className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent)" }}
        />

        {/* Top-left: VERIFIED + purpose */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg self-start"
            style={{
              background: "linear-gradient(135deg, #10b981, #047857)",
              // Tight neutral shadow rather than a coloured bloom — the green
              // glow haloed the pill's edges and read as soft.
              boxShadow: "0 1px 4px rgba(0,0,0,0.20)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ width: 11, height: 11, flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {/* font-medium, not semibold: MyriadPro ships only 400 and 700, and
                CSS resolves 600 upward to 700 — so anything above 500 is Bold. */}
            <span className="text-white font-myriad font-medium tracking-[0.14em] uppercase"
              style={{ fontSize: 11, WebkitFontSmoothing: "antialiased" }}>
              Verified
            </span>
          </div>

          <div
            className="inline-flex items-center px-3 py-1 rounded-md self-start"
            style={{
              // Opaque so the photo cannot bleed through and soften the text.
              background: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.14)",
            }}
          >
            <span
              className="font-myriad font-medium tracking-[0.1em] uppercase"
              style={{
                fontSize: 11,
                color: isForSale ? "#047857" : "#1d4ed8",
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {tag || "For Sale"}
            </span>
          </div>
        </div>

        {/* Heart button */}
        <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
          <HeartBtn size="sm" propertyId={id} />
        </div>

        {/* Bottom-left: posted date. Paired with the view count opposite it, so
            a reader sees how much attention a listing has had and over how long
            — the two only mean something together. */}
        {postedLabel && (
          <div
            className="absolute bottom-2.5 left-2.5 z-10 inline-flex items-center px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(23,28,38,0.72)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
            }}
            title={postedExact ? `Posted ${postedExact}` : undefined}
          >
            <span className="text-white font-myriad font-semibold" style={{ fontSize: 10 }}>
              {postedLabel}
            </span>
          </div>
        )}

        {/* Bottom-right: view count */}
        <div
          className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(30,50,140,0.75)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            border: "1px solid rgba(100,130,255,0.5)",
            boxShadow: "0 2px 10px rgba(20,40,120,0.9)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" style={{ width: 10, height: 10, flexShrink: 0 }}>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          <span className="text-white font-myriad font-bold" style={{ fontSize: 10.5 }}>
            {formatViewCount(viewCount)}
          </span>
        </div>
      </div>

      {/* Info — density pass matching NewListingCard: gaps and frame insets
          tighten, type sizes stay untouched. */}
      <div className="px-3 pt-2 pb-2.5">
        {/* Location + Rating row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 min-w-0">
            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p className="text-[12px] text-gray-500 font-myriad truncate">{location}</p>
          </div>
          {rating && (
            <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
              <svg className="w-3 h-3 text-secondary fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-[12px] font-semibold text-primary font-myriad">{rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <p
          className="text-[15px] font-display text-secondary font-bold line-clamp-1 mb-1"
          style={{ letterSpacing: "-0.1px" }}
        >
          {title}
        </p>

        {/* Specs */}
        {(beds || baths || area) && (
          <div className="flex items-center gap-2 mb-1.5">
            {beds && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-myriad">
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/>
                  <path d="M2 15h20"/><path d="M5 15v-3"/><path d="M19 15v-3"/>
                </svg>
                {beds}
              </span>
            )}
            {baths && (
              <>
                <span className="text-gray-300 text-[10px]">·</span>
                <span className="flex items-center gap-1 text-[11px] text-gray-500 font-myriad">
                  <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z"/>
                    <path d="M6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6"/>
                  </svg>
                  {baths}
                </span>
              </>
            )}
            {area && (
              <>
                <span className="text-gray-300 text-[10px]">·</span>
                <span className="text-[11px] text-gray-500 font-myriad">{area}</span>
              </>
            )}
          </div>
        )}

        {/* Price */}
        <PropertyPrice price={price} size="sm" />
      </div>
    </div>
  );
});

FeaturedCard.displayName = 'FeaturedCard';
export default FeaturedCard;
