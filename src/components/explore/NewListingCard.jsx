
import { memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeartBtn from "../ui/HeartBtn";

// ─── Mini Carousel ────────────────────────────────────────────────────────────

const MiniCarousel = memo(({ images = [], title = "Property" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding images */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <img
              src={image}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.32), transparent)" }}
      />

      {/* Sliding dot indicators */}
      {images.length > 1 && (
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
            {images.map((_, i) => {
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
  );
});

MiniCarousel.displayName = "MiniCarousel";

// ─── NewListingCard ───────────────────────────────────────────────────────────

const NewListingCard = memo(({ id, price, title, location, beds, baths, area, tag, img, images, owner }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate(`/property/${id}`), [navigate, id]);

  const isForSale = !tag || tag?.toLowerCase().includes("sale");
  const imagesToShow = images && images.length > 0 ? images : img ? [img] : [];

  const priceParts = price?.split(" ") || [];
  const currency   = priceParts.length > 1 ? priceParts[0] : "ZMW";
  const priceNum   = priceParts.length > 1 ? priceParts.slice(1).join(" ") : price;

  return (
    <div
      onClick={handleClick}
      className="relative bg-white rounded-[28px] cursor-pointer"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.012)";
        e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* ── Image with white padding frame ── */}
      <div className="px-3 pt-3 pb-0">
        <div className="relative h-[220px] sm:h-[260px] rounded-[18px] overflow-hidden">

          {/* Carousel */}
          <MiniCarousel images={imagesToShow} title={title} />

          {/* Top-left: VERIFIED + tag */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
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
              className="inline-flex items-center px-2.5 py-[3px] rounded-full self-start"
              style={{ background: "rgba(255,255,255,0.94)", boxShadow: "0 1px 6px rgba(0,0,0,0.12)" }}
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
          <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.94)", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
            >
              <HeartBtn size="sm" propertyId={id} />
            </div>
          </div>

        </div>
      </div>

      {/* Orange accent line */}
      <div
        className="mx-3 mt-3"
        style={{
          height: 1.5,
          background: "linear-gradient(90deg, #C96C38 0%, rgba(201,108,56,0.3) 60%, transparent 100%)",
          borderRadius: 1,
        }}
      />

      {/* ── Content section ── */}
      <div className="px-4 pt-3 pb-4">

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span
            className="font-myriad font-bold uppercase tracking-[0.12em] flex-shrink-0"
            style={{ fontSize: 10.5, color: "#C96C38" }}
          >
            {currency}
          </span>
          <p
            className="leading-none font-display text-[22px] sm:text-[27px]"
            style={{ fontWeight: 700, color: "#111827", letterSpacing: "-0.3px" }}
          >
            {priceNum}
          </p>
        </div>

        {/* Title */}
        {title && (
          <p
            className="font-display text-secondary font-bold truncate mb-2"
            style={{ fontSize: 15, letterSpacing: "-0.1px" }}
          >
            {title}
          </p>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 mb-3">
            <div
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2D368E, #C96C38)" }}
            >
              <svg viewBox="0 0 24 24" fill="white" style={{ width: 9, height: 9 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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
            <div style={{ height: 1, background: "linear-gradient(90deg, #F3F4F6, transparent)", marginBottom: 10 }} />
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
          className="flex items-center justify-between mt-3 pt-3"
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

        {/* Agent section */}
        {owner?.name && (
          <div
            className="flex items-center gap-2.5 mt-3 pt-3"
            style={{ borderTop: "1px solid #F3F4F6" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2D368E, #C96C38)" }}
            >
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-myriad" style={{ fontSize: 10, color: "#9CA3AF" }}>Listed by</p>
              <p className="font-myriad font-bold truncate" style={{ fontSize: 13, color: "#1F2937" }}>
                {owner.name}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

NewListingCard.displayName = "NewListingCard";

export default NewListingCard;
