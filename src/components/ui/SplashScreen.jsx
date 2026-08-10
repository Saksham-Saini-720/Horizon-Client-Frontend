import { motion as Motion } from "framer-motion";
import horizonLogo from "../../assets/icons/white_logo.png";
import leadingReLogo from "../../assets/icons/Leading.png";
import auction from "../../assets/icons/auction_logo.png";
import village from "../../assets/icons/green_village.png";
import tree from "../../assets/icons/tree.png";

/**
 * Cold-boot splash, ported from the admin app so both products open the same
 * way.
 *
 * The admin version carried an SVG arc that curved text over the logo, driven
 * by a per-character opacity loop in an effect. Its source string was empty, so
 * the whole mechanism rendered nothing — it is dropped here rather than carried
 * across, along with its dependency on the Great Vibes font (which the client
 * no longer loads). Removing it also lets the logo simply centre itself instead
 * of being nudged with absolute offsets to clear text that was never drawn.
 */

// Scattered brand marks. Positions are percentages of the viewport, tuned to
// fill the corners a phone leaves empty around the centred logo.
const WATERMARKS = [
  { src: auction,       x: "70%", y: "88%", scale: 1.19, invertBlack: true  },
  { src: leadingReLogo, x: "7%",  y: "5%",  scale: 1.7,  invertBlack: true  },
  { src: village,       x: "80%", y: "38%", scale: 1.4,  invertBlack: false },
  { src: tree,          x: "70%", y: "2%",  scale: 1.99, invertBlack: true  },
  { src: village,       x: "2%",  y: "35%", scale: 1.4,  invertBlack: false },
  { src: village,       x: "7%",  y: "82%", scale: 1.65, invertBlack: false },
  { src: auction,       x: "15%", y: "58%", scale: 1.2,  invertBlack: true  },
  { src: leadingReLogo, x: "70%", y: "63%", scale: 1.5,  invertBlack: true  },
  { src: tree,          x: "30%", y: "45%", scale: 1.99, invertBlack: true  },
];

export default function SplashScreen() {
  return (
    <Motion.div
      // Above the onboarding overlay (z-9999), which mounts underneath and
      // would otherwise cover the splash on a first run.
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-between"
      style={{ backgroundColor: "#2D368E", padding: "5vh 0" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background watermarks */}
      {WATERMARKS.map((wm, i) => (
        <Motion.img
          key={i}
          src={wm.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: wm.x,
            top: wm.y,
            width: "clamp(80px, 10vw, 160px)",
            objectFit: "contain",
            // Marks arrive as black-on-transparent or full colour; both are
            // forced to white so they read as one set against the navy.
            filter: wm.invertBlack
              ? "invert(1) hue-rotate(180deg)"
              : "brightness(0) invert(1)",
            transform: `scale(${wm.scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
            userSelect: "none",
          }}
          initial={{ opacity: 0.1 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* ── Logo ── */}
      <Motion.div
        className="flex-1 flex items-center justify-center relative z-10"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      >
        <img
          src={horizonLogo}
          alt="Horizon Properties"
          className="object-contain"
          style={{ width: "clamp(200px, 55vw, 260px)" }}
        />
      </Motion.div>

      {/* ── Bouncing dots ── */}
      <div className="flex items-center gap-2 relative z-10">
        {[0, 1, 2].map((i) => (
          <Motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>

      {/* ── "A member of" endorsement ── */}
      <div className="flex flex-col items-center relative z-10 mt-8">
        <Motion.p
          className="text-white uppercase m-0"
          style={{ fontSize: 13, letterSpacing: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          A member of
        </Motion.p>
        <Motion.img
          src={leadingReLogo}
          alt="LeadingRE"
          style={{
            width: "clamp(190px, 30vw, 240px)",
            filter: "brightness(0) invert(1)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        />
      </div>
    </Motion.div>
  );
}
