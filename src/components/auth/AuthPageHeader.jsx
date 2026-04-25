import { memo } from "react";
import whiteLogo from "../../assets/icons/white_logo.png";

const AuthPageHeader = memo(() => (
  <div
    className="relative flex flex-col items-center justify-end pb-10 pt-14 overflow-hidden bg-gradient-to-br from-[#1a2550] to-secondary"
    style={{ minHeight: "10vh" }}
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

    {/* Decorative arc lines */}
    <div className="absolute inset-0 pointer-events-none opacity-15">
      <svg
        className="w-full h-full"
        viewBox="0 0 400 300"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse cx="370" cy="60"  rx="220" ry="220" stroke="white" strokeWidth="0.8" />
        <ellipse cx="390" cy="100" rx="170" ry="170" stroke="white" strokeWidth="0.6" />
      </svg>
    </div>

    <img
      src={whiteLogo}
      alt="Horizon Properties"
      className="w-32 object-contain relative z-10"
    />
  </div>
));

AuthPageHeader.displayName = "AuthPageHeader";
export default AuthPageHeader;
