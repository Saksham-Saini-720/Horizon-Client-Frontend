
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
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-0.5 py-3 px-4 transition-colors ${
        isActive ? "text-primary-light " : "text-gray-400 hover:text-gray-300"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className="relative">
          {icon}
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-primary-light rounded-full flex items-center justify-center px-1">
              <span className="text-white text-[10px] font-semibold leading-none">
                {badge > 9 ? '9+' : badge}
              </span>
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold font-myriad tracking-wider uppercase">
          {label}
        </span>
        {isActive ? (
          <div className="w-1 h-1 rounded-full bg-primary-light" />
        ) : (
          <div className="w-1 h-1" />
        )}
      </>
    )}
  </NavLink>
);

export default function Footer() {
  const unreadCount = useSelector(selectUnreadCount);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-secondary rounded-t-3xl shadow-2xl z-40 pt-2">
      <nav className="flex items-center justify-around">

        <NavItem to="/" label="Home" icon={<HiHome className="w-6 h-6" />} />

        <NavItem to="/saved" label="Saved" icon={<HiHeart className="w-6 h-6" />} />

        <NavItem to="/inquiries" label="Inquiries" icon={<HiChatBubbleLeft className="w-6 h-6" />} />

        <NavItem to="/chat" label="Inbox" badge={unreadCount} icon={<HiChatBubbleLeftRight className="w-6 h-6" />} />

        <NavItem to="/profile" label="Profile" icon={<HiUser className="w-6 h-6" />} />

      </nav>
    </footer>
  );
}
