import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUnreadCount } from "../../store/slices/conversationSlice";
import { useUnreadCount } from "../../hooks/conversations/useMarkAsRead";
import {
  HiHome,
  HiHeart,
  HiChatBubbleLeft,
  HiChatBubbleLeftRight,
  HiUser,
} from "react-icons/hi2";

const NavItem = ({ to, icon, label, badge }) => (
  <NavLink to={to} className="relative flex flex-col items-center gap-0.5 py-2 px-3 transition-all">
    {({ isActive }) => (
      <>
        {/* Active glow blob behind icon */}
        {isActive && (
          <span
            className="absolute pointer-events-none"
            style={{
              top: '8px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,108,56,0.3) 0%, transparent 70%)',
              filter: 'blur(10px)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )}

        {/* Icon + badge */}
        <div className="relative">
          <div
            style={{
              color: isActive ? '#C96C38' : 'rgba(255,255,255,0.38)',
              filter: isActive ? 'drop-shadow(0 0 7px rgba(201,108,56,0.75))' : 'none',
              transition: 'color 0.2s, filter 0.2s',
            }}
          >
            {icon}
          </div>

          {badge > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center px-1"
              style={{
                background: '#C96C38',
                boxShadow: '0 0 8px rgba(201,108,56,0.7)',
              }}
            >
              <span className="text-white text-[10px] font-semibold leading-none">
                {badge > 9 ? '9+' : badge}
              </span>
            </span>
          )}
        </div>

        {/* Label */}
        <span
          className="text-[10px] font-medium font-myriad tracking-widest uppercase transition-colors duration-200"
          style={{ color: isActive ? '#C96C38' : 'rgba(255,255,255,0.32)' }}
        >
          {label}
        </span>

        {/* Active dot indicator */}
        {isActive ? (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#C96C38',
              boxShadow: '0 0 6px rgba(201,108,56,0.9), 0 0 14px rgba(201,108,56,0.4)',
            }}
          />
        ) : (
          <span className="w-1.5 h-1.5" />
        )}
      </>
    )}
  </NavLink>
);

export default function Footer() {
  useUnreadCount();
  const unreadCount = useSelector(selectUnreadCount);

  return (
    /*
      How the bar follows the phone's curved corners:

      Not by rounding its own bottom corners — no CSS can read the device's
      radius, and a self-applied curve just nests a second, smaller arc inside
      the screen's, leaving a sliver of page showing in the gap. Instead the bar
      runs square and full bleed to the very edge, and the display clips it. The
      curve you see is the hardware's.

      Two things make that work, and it needs both:
        1. viewport-fit=cover in index.html, so the page is allowed to paint
           into the corner region at all.
        2. env(safe-area-inset-bottom) below, so the labels clear the home
           indicator rather than sitting under it.

      The env() fallback matters: on a device without insets, or with
      viewport-fit missing, it resolves to 0px and the bar keeps its base
      padding instead of collapsing.

      The decoration is gone deliberately: two sets of arc rings, a glowing top
      edge and a violet ambient blob were all fighting for attention behind five
      small icons. Flat navy lets the active tab be the only thing that draws
      the eye — which is the whole job of a nav bar.
    */
    <footer className="fixed bottom-0 left-0 right-0 z-40">
      <nav
        className="relative flex items-center justify-around rounded-t-[26px] overflow-hidden pt-1.5"
        style={{
          background: '#1E2A6B',
          boxShadow: '0 -6px 28px rgba(12,22,74,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
          // Height comes from the shared variable so the bar's real footprint
          // always matches what everything else positions against. box-sizing
          // is border-box, so the inset padding eats into this height rather
          // than adding to it — the icons ride above the home indicator and the
          // total stays exactly --nav-h.
          height: 'var(--nav-h)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <NavItem to="/"          label="Home"     icon={<HiHome               className="w-6 h-6" />} />
        <NavItem to="/saved"     label="Saved"    icon={<HiHeart              className="w-6 h-6" />} />
        <NavItem to="/inquiries" label="Inquiries" icon={<HiChatBubbleLeft    className="w-6 h-6" />} />
        <NavItem to="/chat"      label="Inbox"    icon={<HiChatBubbleLeftRight className="w-6 h-6" />} badge={unreadCount} />
        <NavItem to="/profile"   label="Profile"  icon={<HiUser               className="w-6 h-6" />} />
      </nav>
    </footer>
  );
}
