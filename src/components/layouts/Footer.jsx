
import { NavLink } from "react-router-dom";

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
        isActive ? "text-amber-500" : "text-gray-400 hover:text-gray-600"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className="relative">
          {icon}
          {isActive && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
          )}
        </div>
        <span className={`text-[11px] font-semibold font-['DM_Sans',sans-serif] ${isActive ? "text-amber-500" : "text-gray-500"}`}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40">
      <nav className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
        
        <NavItem
          to="/"
          label="Explore"
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          }
        />

        <NavItem
          to="/saved"
          label="Saved"
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          }
        />

        <NavItem
          to="/inquiries"
          label="Inquiries"
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          }
        />

        <NavItem
          to="/profile"
          label="Profile"
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          }
        />

      </nav>
    </footer>
  );
}
