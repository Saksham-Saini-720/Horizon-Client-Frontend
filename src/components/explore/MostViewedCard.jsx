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
  owner,
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

  const isForSale = tag === "For Sale";

  return (
    <div
      onClick={handleClick}
      className="group relative flex-shrink-0 w-[320px] h-[300px] rounded-[28px] overflow-hidden cursor-pointer mb-3"
      style={{
        boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
        transition: "transform 0.4s cubic-bezier(.22,.68,0,1.2), box-shadow 0.4s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px) scale(1.025)";
        e.currentTarget.style.boxShadow = "0 24px 60px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.35)";
      }}
    >
      {/* ── Image Slider ── */}
      <div className="absolute inset-0">
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
          style={{ transform: `translateX(-${currentIndex * 320}px)` }}
        >
          {displayImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} ${index + 1}`}
              className="w-[320px] h-[480px] object-cover flex-shrink-0"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* ── Gradient Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* ── Top Bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[18px] pt-[18px] z-10">
        {/* HOT Badge */}
        <div
          className="flex items-center gap-[5px] font-myriad text-white text-[11px] font-semibold tracking-[1.2px] uppercase px-3 py-[6px] rounded-full"
          style={{
            background: "linear-gradient(135deg, #ff6b00, #e8000b)",
            boxShadow: "0 4px 16px rgba(232,0,11,0.45)",
            animation: "hotPulse 2s ease-in-out infinite",
          }}
        >
          MOST VIEWED
        </div>

        {/* View Count */}
        <div
          className="flex items-center gap-[5px] font-myriad text-white text-[12px] font-medium px-[11px] py-[5px] rounded-full"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,0.8)"
            style={{ width: 12, height: 12, flexShrink: 0 }}
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          {formatViewCount(viewCount)}
        </div>

        {/* Heart Button */}
        <div onClick={(e) => e.stopPropagation()}>
          <HeartBtn size="md" propertyId={id} />
        </div>
      </div>

      {/* ── Dot Indicators ── */}
      {displayImages.length > 1 && (
        <div className="absolute z-10 flex gap-[5px]" style={{ bottom: 188, left: "50%", transform: "translateX(-50%)" }}>
          {displayImages.map((_, i) => (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              style={{
                width: i === currentIndex ? 18 : 5,
                height: 5,
                borderRadius: i === currentIndex ? 3 : "50%",
                background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "all 0.4s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Bottom Content (all inside image) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 pt-[22px]">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-semibold font-myriad tracking-[1px] uppercase px-[10px] py-1 rounded-[4px]"
            style={{
              background: isForSale ? "rgba(0,200,120,0.3)" : "rgba(80,140,255,0.3)",
              border: `1px solid ${isForSale ? "rgba(0,200,120,0.5)" : "rgba(80,140,255,0.5)"}`,
              color: isForSale ? "#7fffc4" : "#a0c4ff",
              backdropFilter: "blur(6px)",
            }}
          >
            {tag}
          </span>
        </div>

        {/* Price */}
        <p
          className="text-white font-myriad leading-none mb-[6px]"
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "-0.5px",
            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          {price}
        </p>

        {/* Title */}
        <p
          className="text-[15px] font-myriad font-semibold mb-[5px] truncate"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          {title}
        </p>

        {/* Location */}
        <div className="flex items-center gap-[5px] mb-[14px]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 12, height: 12, flexShrink: 0 }}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span
            className="text-[12px] font-myriad font-black truncate"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {location}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.15)", marginBottom: 12 }} />

        {/* Specs */}
        <div className="flex items-center gap-4 mb-3">
          {beds && (
            <div className="flex items-center gap-[5px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" style={{ width: 14, height: 14 }}>
                <path d="M2 20v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7M2 15h20M5 15v-3M19 15v-3" />
              </svg>
              <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{beds}</span>
            </div>
          )}
          {baths && (
            <div className="flex items-center gap-[5px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" style={{ width: 14, height: 14 }}>
                <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4zM6 12V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6" />
              </svg>
              <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{baths}</span>
            </div>
          )}
          {area && (
            <div className="flex items-center gap-[5px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" style={{ width: 14, height: 14 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{area}</span>
            </div>
          )}
        </div>

        {/* Agent */}
        {owner?.name && (
          <div
            className="flex items-center gap-[9px] pt-[10px]"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #f0a500, #e05a00)",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" style={{ width: 14, height: 14 }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-myriad" style={{ color: "rgba(255,255,255,0.45)" }}>Listed by</p>
              <p className="text-[12px] font-semibold font-myriad truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                {owner.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Shine on Hover ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-[-60%] left-[-60%] w-[60%] h-[220%] group-hover:translate-x-[380px] transition-transform duration-1000"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
          }}
        />
      </div>

      {/* ── HOT pulse keyframes (injected once) ──
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
        @keyframes hotPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(232,0,11,0.45); }
          50% { box-shadow: 0 4px 28px rgba(232,0,11,0.75), 0 0 0 4px rgba(232,0,11,0.15); }
        }
      `}</style> */}
    </div>
  );
});

MostViewedCard.displayName = "MostViewedCard";

export default MostViewedCard;
