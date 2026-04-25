import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUnreadCount } from "../../store/slices/conversationSlice";
import {
  HiHome,
  HiHeart,
  HiChatBubbleLeft,
  HiChatBubbleLeftRight,
  HiUser,
} from "react-icons/hi2";

const NavItem = ({ to, icon, label, badge }) => (
  <NavLink to={to} className="relative flex flex-col items-center gap-0.5 py-3 px-3 transition-all">
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
          className="text-[10px] font-semibold font-myriad tracking-wider uppercase transition-colors duration-200"
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
  const unreadCount = useSelector(selectUnreadCount);

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #141852 0%, #2D368E 100%)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -6px 32px rgba(45,54,142,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Decorative arc rings – top-left */}
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width="90" height="70" viewBox="0 0 90 70"
        style={{ opacity: 0.09 }}
      >
        <circle cx="0" cy="0" r="55"  fill="none" stroke="white" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="78"  fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="100" fill="none" stroke="white" strokeWidth="0.3" />
      </svg>

      {/* Decorative arc rings – top-right */}
      <svg
        className="absolute top-0 right-0 pointer-events-none"
        width="90" height="70" viewBox="0 0 90 70"
        style={{ opacity: 0.09 }}
      >
        <circle cx="90" cy="0" r="55"  fill="none" stroke="white" strokeWidth="0.8" />
        <circle cx="90" cy="0" r="78"  fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="90" cy="0" r="100" fill="none" stroke="white" strokeWidth="0.3" />
      </svg>

      {/* Glowing top-edge accent line */}
      <div
        className="absolute top-0 left-8 right-8 h-px rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
        }}
      />

      {/* Ambient centre glow */}
      <div
        className="absolute top-0 left-1/2 pointer-events-none"
        style={{
          transform: 'translateX(-50%)',
          width: '160px',
          height: '50px',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      <nav className="relative flex items-center justify-around pt-1">
        <NavItem to="/"          label="Home"     icon={<HiHome               className="w-6 h-6" />} />
        <NavItem to="/saved"     label="Saved"    icon={<HiHeart              className="w-6 h-6" />} />
        <NavItem to="/inquiries" label="Inquiries" icon={<HiChatBubbleLeft    className="w-6 h-6" />} />
        <NavItem to="/chat"      label="Inbox"    icon={<HiChatBubbleLeftRight className="w-6 h-6" />} badge={unreadCount} />
        <NavItem to="/profile"   label="Profile"  icon={<HiUser               className="w-6 h-6" />} />
      </nav>
    </footer>
  );
}
