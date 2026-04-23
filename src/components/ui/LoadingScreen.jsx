import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import horizonLogo from "../../assets/icons/white_logo.png";
import auction from "../../assets/icons/auction_logo.png";
import village from "../../assets/icons/green_village.png";
import tree from "../../assets/icons/tree.png";

const SLIDES = [
  {
    id: 0,
    badge: "Your Real Estate Partner",
    heading: "Discover homes built for",
    headingAccent: "real living.",
    sub: "Horizon Properties brings you hand-picked listings from trusted agents across every neighbourhood.",
    icon: village,
  },
  {
    id: 1,
    badge: "Smart Search",
    heading: "Browse, save & connect with",
    headingAccent: "verified agents.",
    sub: "Save your favourites, set alerts for new listings, and chat directly with licensed professionals.",
    icon: auction,
  },
  {
    id: 2,
    badge: "Welcome home",
    heading: "Find a place that feels",
    headingAccent: "like yours",
    sub: "Browse hand-curated homes across the city, save favourites, and chat directly with verified agents.",
    icon: tree,
    isLast: true,
  },
];

// alternating primary.light (#C96C38) and white rings
const RINGS = [
  { r: 195, color: "rgba(255,255,255,0.06)"   },   // white — outermost
  { r: 150, color: "rgba(201,108,56,0.18)"    },   // primary.light
  { r: 110, color: "rgba(255,255,255,0.09)"   },   // white
  { r:  74, color: "rgba(201,108,56,0.28)"    },   // primary.light — innermost
];

function ConcentricRings() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {RINGS.map(({ r, color }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: `1px solid ${color}`,
          }}
        />
      ))}
    </div>
  );
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
};

export default function LoadingScreen({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const total = SLIDES.length;

  const goNext = () => {
    if (isLast) { onComplete?.(); return; }
    setDir(1);
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (index === 0) return;
    setDir(-1);
    setIndex((i) => i - 1);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(160deg, #2D368E 0%, #232C7A 45%, #171C26 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Ambient floating dots */}
      <Motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "28%",
          left: "12%",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#C96C38",
          opacity: 0.9,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <Motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{
          position: "absolute",
          top: "22%",
          right: "14%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.75)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "54px 24px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500 }}>
          Step{" "}
          <span style={{ color: "#E8793A", fontWeight: 700 }}>
            {String(index + 1).padStart(2, "0")}
          </span>{" "}
          of {String(total).padStart(2, "0")}
        </span>

        <button
          onClick={() => onComplete?.()}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
            fontSize: 13,
            fontWeight: 500,
            padding: "6px 20px",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>

      {/* Center: concentric rings + logo */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <ConcentricRings />

        {/* subtle glow behind logo — very low opacity so it doesn't create a colour blob */}
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,108,56,0.12) 0%, transparent 70%)",
            zIndex: 3,
          }}
        />

        <img
          src={horizonLogo}
          alt="Horizon Properties"
          style={{
            width: 180,
            objectFit: "contain",
            filter: "drop-shadow(0 4px 24px rgba(232,121,58,0.28))",
            position: "relative",
            zIndex: 4,
          }}
        />
      </div>

      {/* Slide text */}
      <div
        style={{
          padding: "0 28px 12px",
          position: "relative",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <Motion.div
            key={index}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.36, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Badge */}
            <p
              style={{
                color: "#E8793A",
                fontSize: 15,
                fontStyle: "italic",
                fontFamily: "'Georgia', serif",
                marginBottom: 10,
                marginTop: 0,
              }}
            >
              {slide.badge}
            </p>

            {/* Heading */}
            <h1
              style={{
                color: "white",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.22,
                margin: "0 0 2px 0",
                letterSpacing: "-0.3px",
              }}
            >
              {slide.heading}
              {/* small orange dot after the heading line */}
              <span style={{ color: "#E8793A", marginLeft: 4, fontSize: 22 }}>•</span>
            </h1>

            {/* Accent line */}
            <h1
              style={{
                color: "#E8793A",
                fontSize: 30,
                fontWeight: 800,
                fontStyle: "italic",
                fontFamily: "'Georgia', serif",
                lineHeight: 1.22,
                margin: "0 0 16px 0",
                letterSpacing: "-0.3px",
              }}
            >
              {slide.headingAccent}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                lineHeight: 1.65,
                margin: 0,
                fontStyle: "italic",
                fontFamily: "'Georgia', serif",
              }}
            >
              {slide.sub}
            </p>
          </Motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bars */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "16px 28px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background:
                i < index
                  ? "#E8793A"
                  : i === index
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.2)",
              transition: "background 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* Bottom nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px 52px",
          position: "relative",
          zIndex: 10,
          gap: 16,
        }}
      >
        {/* Back button */}
        <button
          onClick={goPrev}
          disabled={index === 0}
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: index === 0 ? "not-allowed" : "pointer",
            opacity: index === 0 ? 0.3 : 1,
            flexShrink: 0,
            transition: "opacity 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* CTA button */}
        <Motion.button
          onClick={goNext}
          style={{
            flex: 1,
            height: 54,
            borderRadius: 999,
            background: "linear-gradient(135deg, #E8793A 0%, #D4601E 100%)",
            border: "none",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 6px 28px rgba(232,121,58,0.40)",
            letterSpacing: "0.2px",
          }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ boxShadow: "0 8px 36px rgba(232,121,58,0.55)" }}
        >
          {isLast ? "Get started" : "Next"}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Motion.button>
      </div>
    </div>
  );
}
