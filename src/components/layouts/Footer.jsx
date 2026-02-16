import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ExploreIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const SavedIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const InquiriesIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={active ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Nav Items Config ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "explore",   label: "Explore",   Icon: ExploreIcon   },
  { id: "saved",     label: "Saved",     Icon: SavedIcon     },
  { id: "inquiries", label: "Inquiries", Icon: InquiriesIcon },
  { id: "profile",   label: "Profile",   Icon: ProfileIcon   },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer({ initialTab = "explore", onChange }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  const handleTabClick = (id) => {
    setActiveTab(id);
    onChange?.(id);
    navigate(id === "explore" ? "/" : `/${id}`);
  };

  return (
    <>
      {/* Spacer so page content does not hide behind nav */}
      <div className="h-[70px]" />

      <nav className="fixed bottom-0 left-0 right-0 bg-white z-[1000] shadow-[0_-1px_0_0_#F3F4F6,0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">

        {/* Top fade line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Tab row */}
        <div className="flex justify-around items-center max-w-[480px] mx-auto px-2 h-16">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;

            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative flex flex-col items-center justify-center gap-[3px]
                  flex-1 border-none bg-transparent cursor-pointer
                  py-1.5 pb-1 outline-none transition-colors duration-200
                  [-webkit-tap-highlight-color:transparent]
                  ${isActive ? "text-amber-400" : "text-gray-400"}
                `}
              >
                {/* Active dot */}
                {isActive && (
                  <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-400" />
                )}

                {/* Icon wrapper */}
                <span
                  className={`
                    flex items-center justify-center w-10 h-8 rounded-xl
                    transition-colors duration-200
                    ${isActive ? "bg-amber-400/10" : "bg-transparent"}
                  `}
                >
                  <Icon active={isActive} />
                </span>

                {/* Label */}
                <span
                  className={`
                    text-[11px] tracking-[0.01em] leading-none
                    font-['DM_Sans',Segoe_UI,sans-serif]
                    transition-all duration-200
                    ${isActive ? "font-semibold text-amber-400" : "font-normal text-gray-400"}
                  `}
                >
                  {label}
                </span>

              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
