
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/utils/useRedux";
import useLogout from "../hooks/auth/useLogout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import SettingsMenu from "../components/profile/SettingsMenu";
import EditProfileModal from "../components/profile/EditProfileModal";
import LogoutModal from "../components/profile/LogoutModal";

// ─── Not Logged In State ──────────────────────────────────────────────────────

const NotLoggedInState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center px-4 pb-28">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>

      <h2 className="text-[24px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
        Welcome to Horizon
      </h2>

      <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] text-center max-w-xs mb-8">
        Log in to manage your profile, saved properties, inquiries, and more
      </p>

      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3.5 rounded-xl bg-[#1C2A3A] text-white text-[15px] font-semibold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] active:scale-95 transition-all shadow-lg"
      >
        Log In
      </button>
    </div>
  );
};

// ─── Bio Section ──────────────────────────────────────────────────────────────

const BioSection = ({ user }) => {
  if (!user?.bio) return null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-['DM_Sans',sans-serif]">
        About
      </h3>
      <p className="text-[14px] text-gray-700 font-['DM_Sans',sans-serif] leading-relaxed">
        {user.bio}
      </p>
    </div>
  );
};

// ─── Account Info ─────────────────────────────────────────────────────────────

const AccountInfo = ({ user }) => {
  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3 font-['DM_Sans',sans-serif]">
        Account Info
      </h3>
      
      <div className="space-y-3">
        <InfoRow icon="📧" label="Email" value={user?.email} />
        {user?.phone && (
          <InfoRow icon="📱" label="Phone" value={user.phone} />
        )}
        <InfoRow icon="📅" label="Member since" value={joinDate} />
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
      <span className="text-[20px]">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
        {label}
      </p>
      <p className="text-[14px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] truncate">
        {value}
      </p>
    </div>
  </div>
);

// ─── ProfilePage ──────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = useCallback(() => {
    // Call logout mutation (API + state cleanup)
    logoutMutation.mutate();
    // Close modal immediately (navigation happens in mutation)
    setShowLogoutModal(false);
  }, [logoutMutation]);

  // Show not logged in state when NOT authenticated
  if (!isAuthenticated || !user) {
    return <NotLoggedInState />;
  }

  // Show profile when authenticated
  return (
    <div className="min-h-screen bg-[#F7F6F2] pb-28">
      
      {/* Header with gradient */}
      <ProfileHeader 
        user={user} 
        onEdit={() => setShowEditModal(true)} 
      />

      {/* Content */}
      <div className="px-4">
        
        {/* Stats Card (overlapping header) */}
        <ProfileStats />

        {/* Bio */}
        <BioSection user={user} />

        {/* Account Info */}
        <AccountInfo user={user} />

        {/* Settings Menu */}
        <SettingsMenu onLogout={() => setShowLogoutModal(true)} />

      </div>

      {/* Modals */}
      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={logoutMutation.isPending}
      />

    </div>
  );
};

export default ProfilePage;
