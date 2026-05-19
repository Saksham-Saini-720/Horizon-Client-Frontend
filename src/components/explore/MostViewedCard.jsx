import { memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeartBtn from "../ui/HeartBtn";

const MostViewedCard = memo(({
  id,
  price,
  title,
  location,
  beds,
  baths,
  area,
  tag,
  img,
  images,
  viewCount = 0,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  const formatViewCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const displayImages = images && images.length > 0 ? images : [img];

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  const priceParts = price?.split(" ") || [];
  const currency   = priceParts.length > 1 ? priceParts[0] : "ZMW";
  const priceNum   = priceParts.length > 1 ? priceParts.slice(1).join(" ") : price;
  const isForSale  = !tag || tag?.toLowerCase().includes("sale");

  return (
    <div
      onClick={handleClick}
      className="group relative flex-shrink-0 w-[360px] rounded-[28px] overflow-hidden cursor-pointer bg-white"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-7px) scale(1.015)";
        e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* ── Image with white padding frame ── */}
      <div className="px-[10px] pt-[10px] pb-0">
        <div className="relative h-[260px] rounded-[18px] overflow-hidden">

          {/* Sliding images */}
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {displayImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${title} ${index + 1}`}
                className="min-w-full h-full object-cover object-center flex-shrink-0 group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            ))}
          </div>

          {/* Subtle bottom gradient for badge readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
          />

          {/* Top-left: VERIFIED + tag */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #10b981, #047857)",
                boxShadow: "0 2px 8px rgba(16,185,129,0.45)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ width: 9, height: 9, flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-white font-myriad font-bold tracking-[0.14em] uppercase"
                style={{ fontSize: 9 }}>
                Verified
              </span>
            </div>

            <div
              className="inline-flex items-center px-2.5 py-[3px] rounded-md self-start"
              style={{
                background: "rgba(255,255,255,0.94)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
              }}
            >
              <span
                className="font-myriad font-extrabold tracking-[0.1em] uppercase"
                style={{ fontSize: 9, color: isForSale ? "#047857" : "#1d4ed8" }}
              >
                {tag || "For Sale"}
              </span>
            </div>
          </div>

          {/* Top-right: Heart */}
          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.94)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <HeartBtn size="sm" propertyId={id} />
            </div>
          </div>

          {/* Bottom-right: View count */}
          <div
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(29,70,180,0.88)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 2px 10px rgba(29,70,180,0.45)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 10, height: 10, flexShrink: 0 }}>
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            <span className="text-white font-myriad font-bold" style={{ fontSize: 10.5 }}>
              {formatViewCount(viewCount)}
            </span>
          </div>

          {/* Sliding dot indicators */}
          {displayImages.length > 1 && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 overflow-hidden"
              style={{
                width: "80px",
                maskImage: "linear-gradient(to right, transparent, black 22%, black 78%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 22%, black 78%, transparent)",
              }}
            >
              <div
                className="flex items-center transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${35 - currentIndex * 10}px)` }}
              >
                {displayImages.map((_, i) => {
                  const d = Math.abs(i - currentIndex);
                  return (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                      className="w-[10px] flex-shrink-0 flex items-center justify-center"
                      aria-label={`Go to image ${i + 1}`}
                    >
                      <div
                        className="rounded-full bg-white transition-all duration-300"
                        style={{
                          width:   d === 0 ? 8 : d === 1 ? 6 : 5,
                          height:  d === 0 ? 8 : d === 1 ? 6 : 5,
                          opacity: d === 0 ? 1 : d === 1 ? 0.7 : d === 2 ? 0.4 : 0.15,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orange accent line */}
      {/* <div
        className="mx-3 mt-3"
        style={{
          height: 1.5,
          background: "linear-gradient(90deg, #C96C38 0%, rgba(201,108,56,0.3) 60%, transparent 100%)",
          borderRadius: 1,
        }}
      /> */}

      {/* ── Content section ── */}
      <div className="px-4 pt-3 pb-4">

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span
            className="font-myriad font-bold uppercase tracking-[0.12em] flex-shrink-0"
            style={{ fontSize: 10.5, color: "#808080" }}
          >
            {currency}
          </span>
          <p
            className="leading-none font-display"
            style={{ fontSize: 27, fontWeight: 700, color: "#111827", letterSpacing: "-0.3px" }}
          >
            {priceNum}
          </p>
        </div>

        {/* Title */}
        {title && (
          <p
            className="font-myriad font-bold truncate mb-2"
            style={{ fontSize: 14.5, color: "#1F2937", letterSpacing: "-0.1px" }}
          >
            {title}
          </p>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2D368E, #C96C38)" }}
            >
              <svg viewBox="0 0 24 24" fill="white" style={{ width: 9, height: 9 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="font-myriad font-medium truncate" style={{ fontSize: 12, color: "#6B7280" }}>
              {location}
            </span>
          </div>
        )}

        {/* Spec chips */}
        {(beds || baths || area) && (
          <>
            <div style={{ height: 1, background: "linear-gradient(90deg, #F3F4F6, transparent)", marginBottom: 1 }} />
            <div className="flex items-center gap-2">
              {beds && (
                <div
                  className="flex flex-1 items-center justify-center gap-1 px-2.5 py-1.5 rounded-full"
                  style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C96C38" strokeWidth="2"
                    strokeLinecap="round" style={{ width: 11, height: 11, flexShrink: 0 }}>
                    <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7M2 15h20M5 15v-3M19 15v-3" />
                  </svg>
                  <span className="font-myriad font-semibold" style={{ fontSize: 11, color: "#374151" }}>
                    {beds}
                  </span>
                </div>
              )}
              {baths && (
                <div
                  className="flex flex-1 items-center justify-center gap-1 px-2.5 py-1.5 rounded-full"
                  style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C96C38" strokeWidth="2"
                    strokeLinecap="round" style={{ width: 11, height: 11, flexShrink: 0 }}>
                    <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4zM6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6" />
                  </svg>
                  <span className="font-myriad font-semibold" style={{ fontSize: 11, color: "#374151" }}>
                    {baths}
                  </span>
                </div>
              )}
              {area && (
                <div
                  className="flex flex-1 items-center justify-center gap-1 px-2.5 py-1.5 rounded-full"
                  style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C96C38" strokeWidth="2"
                    strokeLinecap="round" style={{ width: 11, height: 11, flexShrink: 0 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  <span className="font-myriad font-semibold" style={{ fontSize: 11, color: "#374151" }}>
                    {area}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* View details CTA */}
        <div
          className="flex items-center justify-between mt-1 pt-1"
          style={{ borderTop: "1px solid #F3F4F6" }}
        >
          <span className="font-myriad font-semibold" style={{ fontSize: 12, color: "#9CA3AF" }}>
            Tap to view property
          </span>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #2D368E, #3641a8)" }}
          >
            <span className="text-white font-myriad font-bold" style={{ fontSize: 10.5 }}>
              Details
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" style={{ width: 10, height: 10 }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});

MostViewedCard.displayName = "MostViewedCard";

export default MostViewedCard;
