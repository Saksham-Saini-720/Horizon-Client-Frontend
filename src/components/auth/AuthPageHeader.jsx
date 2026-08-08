import { memo } from "react";
import whiteLogo from "../../assets/icons/white_logo.png";

const AuthPageHeader = memo(() => (
  <div
    className="relative flex flex-col items-center justify-center pb-14 pt-16 overflow-hidden bg-gradient-to-br from-[#1a2550] to-secondary"
    // Taller band so the logo sits in open space rather than crowding the
    // sheet's top edge — roughly the quarter-screen the design gives it.
    style={{ minHeight: "24vh" }}
  >
    {/* Primary glow orb — top-right */}
    <div
      className="absolute -top-6 -right-6 w-52 h-52 rounded-full pointer-events-none"
      style={{ backgroundColor: "#C96C38", opacity: 0.35, filter: "blur(64px)" }}
    />
    {/* Secondary glow orb — inward */}
    <div
      className="absolute top-8 right-10 w-28 h-28 rounded-full pointer-events-none"
      style={{ backgroundColor: "#C96C38", opacity: 0.22, filter: "blur(40px)" }}
    />
    {/* Third orb — left side balance */}
    <div
      className="absolute top-12 -left-8 w-36 h-36 rounded-full pointer-events-none"
      style={{ backgroundColor: "#C96C38", opacity: 0.12, filter: "blur(56px)" }}
    />

    {/*
      Corner rings, not full-width arcs.

      The previous pair of ellipses were sized to sweep across the whole band,
      so both lines crossed the centred logo and competed with it. These are
      anchored off the top-right corner instead, where they read as a corner
      flourish and never reach the middle of the header. Fainter too — at
      opacity 0.15 a hairline stops being texture and becomes a line you notice.
    */}
    <div
      className="absolute -top-20 -right-28 w-64 h-64 rounded-full border pointer-events-none"
      style={{ borderColor: "rgba(255,255,255,0.10)" }}
    />
    <div
      className="absolute -top-32 -right-40 w-96 h-96 rounded-full border pointer-events-none"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    />

    <img
      src={whiteLogo}
      alt="Horizon Properties"
      className="w-32 object-contain relative z-10"
    />
  </div>
));

AuthPageHeader.displayName = "AuthPageHeader";
export default AuthPageHeader;
