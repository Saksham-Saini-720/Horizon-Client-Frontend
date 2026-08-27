
import { memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeartBtn from "../ui/HeartBtn";
import PropertyPrice from "../ui/PropertyPrice";

// ─── Spec row ─────────────────────────────────────────────────────────────────

const BedIcon = (
  <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7M2 15h20M5 15v-3M19 15v-3" />
);
const BathIcon = (
  <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4zM6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6" />
);
const AreaIcon = (
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </>
);

// The icon carries the accent colour and the value stays near-black, so the row
// reads as data rather than as a row of buttons.
const SpecItem = ({ icon, label, className = "" }) => (
  <span className={`flex items-center gap-1.5 min-w-0 ${className}`}>
    <svg
      viewBox="0 0 24 24" fill="none" stroke="#C96C38" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ width: 13, height: 13, flexShrink: 0 }}
    >
      {icon}
    </svg>
    <span className="font-myriad font-medium truncate" style={{ fontSize: 12, color: "#374151" }}>
      {label}
    </span>
  </span>
);

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

const NewListingCard = memo(({ id, price, title, location, beds, baths, area, tag, img, images, postedLabel, postedExact }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate(`/property/${id}`), [navigate, id]);

  const isForSale = !tag || tag?.toLowerCase().includes("sale");
  const imagesToShow = images && images.length > 0 ? images : img ? [img] : [];

  return (
    // Shares the shadow-card token with FeaturedCard. The hover lift is CSS
    // rather than the three inline mouse handlers it replaces, which wrote their
    // own duplicate shadow values straight to element.style.
    <div
      onClick={handleClick}
      className="relative bg-white rounded-3xl cursor-pointer border border-black/5 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 ease-out"
    >
      {/* ── Image with white padding frame ── */}
      <div className="px-2 pt-2 pb-0">
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

          {/* Posted date, over the image. A listing's age is part of judging it
              — a plot posted six years ago is a different proposition from one
              posted yesterday — and the catalogue spans 2019 to now. */}
          {postedLabel && (
            <div
              className="absolute bottom-3 left-3 z-20 inline-flex items-center px-2.5 py-[3px] rounded-full"
              style={{ background: "rgba(23,28,38,0.72)", backdropFilter: "blur(4px)" }}
              title={postedExact ? `Posted ${postedExact}` : undefined}
            >
              <span
                className="font-myriad font-semibold tracking-[0.06em] text-white"
                style={{ fontSize: 9.5 }}
              >
                {postedLabel}
              </span>
            </div>
          )}

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
        className="mx-2 mt-2"
        style={{
          height: 1.5,
          background: "linear-gradient(90deg, #C96C38 0%, rgba(201,108,56,0.3) 60%, transparent 100%)",
          borderRadius: 1,
        }}
      />

      {/* ── Content section ── */}
      <div className="px-3.5 pt-2.5 pb-3">

        {/* Price row */}
        <PropertyPrice price={price} size="md" className="mb-1" />

        {/* Title */}
        {title && (
          <p
            className="font-display text-secondary font-bold truncate mb-1"
            style={{ fontSize: 15, letterSpacing: "-0.1px" }}
          >
            {title}
          </p>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 mb-2">
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

        {/*
          Specs as plain text with icons, not pills.

          A pill is an interactive affordance — this app already uses that exact
          shape for the tappable filter row at the top of Explore (Buy / Rent /
          Price / Bedrooms). Repeating it here for a read-only bed count invites
          a tap that does nothing, so the two treatments are kept distinct:
          pill = you can act on it, text = it is telling you something.

          Beds and baths sit together and area is pushed right, since they are
          the pair users compare against each other.
        */}
        {(beds || baths || area) && (
          <div className="flex items-center gap-3">
            {beds && <SpecItem icon={BedIcon} label={beds} />}
            {baths && <SpecItem icon={BathIcon} label={baths} />}
            {area && <SpecItem icon={AreaIcon} label={area} className="ml-auto" />}
          </div>
        )}

        {/*
          No "Listed by" row here by design. Attribution is a decision the user
          makes after opening a listing, not while scanning a grid, and the
          detail page already carries a full AgentCard with contact actions.
          The VERIFIED badge covers the trust signal at browse stage, and the
          other two card types never showed an agent — this was the odd one out.
        */}
      </div>
    </div>
  );
});

NewListingCard.displayName = "NewListingCard";

export default NewListingCard;
