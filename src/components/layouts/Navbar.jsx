import { useLocation, useNavigate } from "react-router-dom";

// ─── Route → Title Map ────────────────────────────────────────────────────────

const ROUTE_TITLES = {
  "/":           "Explore",
  "/saved":      "Saved",
  "/inquiries":  "Inquiries",
  "/tours":      "Tours",
  "/profile":    "Profile",
  "/login":      "Login",
  "/register":   "Register",
};

// In routes pe back button nahi dikhega (main tabs)
const HIDE_BACK = ["/", "/saved", "/inquiries", "/tours", "/profile"];

// ─── HorizonLogo ──────────────────────────────────────────────────────────────

export const HorizonLogo = () => (
  <div
    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
    style={{
      background: "linear-gradient(145deg, #F5B731 0%, #E8A020 100%)",
      boxShadow: "0 2px 8px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
    }}
  >
    <span className="font-serif text-lg font-bold text-[#1C2A3A] select-none leading-none">
      H
    </span>
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const title   = ROUTE_TITLES[location.pathname] ?? "Horizon";
  const showBack = !HIDE_BACK.includes(location.pathname);

  return (
    <header className="flex items-center justify-between px-5 h-16 bg-[#FAFAF8] border-b border-[#EEEDE8] sticky top-0 z-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">

      {/* Left: optional back button + title */}
      <div className="flex items-center gap-3 flex-1">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-9 h-9 rounded-xl bg-[#F0EFE9] flex items-center justify-center flex-shrink-0 outline-none border-none cursor-pointer hover:bg-[#E4E2DB] active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#1C2A3A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        )}

        <h1 className="text-[17px] font-bold text-[#1C2A3A] tracking-tight m-0">
          {title}
        </h1>
      </div>

      {/* Right: logo */}
      <HorizonLogo />

    </header>
  );
};

export default Navbar;
