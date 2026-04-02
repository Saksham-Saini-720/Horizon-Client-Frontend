import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/icons/white_logo.png";

const HIDE_BACK   = [];
const ROUTE_TITLES = {
  "/search":    "Search",
  "/saved":     "Saved",
  "/inquiries": "Inquiries",
  "/tours":     "Tours",
  "/profile":   "Profile",
  "/login":     "Login",
  "/register":  "Register",
  "/chat":      "Messages",
};

// ─── HorizonLogo ──────────────────────────────────────────────────────────────

export const HorizonLogo = ({ size = 40 }) => (
  <div
    className="rounded-2xl flex items-center justify-center flex-shrink-0 cursor-pointer"
    style={{
      width: size,
      height: size,
      background: "linear-gradient(145deg, #2D368E 0%, #2D368E 100%)",
      boxShadow: "0 2px 8px rgba(255,255,255,0.35)",
    }}
  >
    <img src={logo} alt="logo" className="w-5/5 h-auto object-contain p-[1px]" />
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();

  if (location.pathname === "/") return null;

  const showBack  = !HIDE_BACK.includes(location.pathname);
  const query     = searchParams.get("q");
  const baseTitle = ROUTE_TITLES[location.pathname] ?? "Horizon";
  const title     = location.pathname === "/search" && query
    ? `"${query}"`
    : baseTitle;

  return (
    <header className="flex items-center justify-between px-5 h-16 bg-secondary border-b border-secondary sticky top-0 z-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 flex-1">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center outline-none border-none cursor-pointer hover:bg-gray-200 active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#1C2A3A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        )}
        <h1 className="text-[24px] font-bold text-white  m-0 truncate font-myriad">
          {title}
        </h1>
      </div>
      <div onClick={()=> navigate("/")} className="cursor-pointer">
        <HorizonLogo size={50} />
      </div>
    </header>
  );
};

export default Navbar;
