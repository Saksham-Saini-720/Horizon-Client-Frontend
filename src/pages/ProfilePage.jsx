
import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLogout from '../hooks/auth/useLogout';
import ProfileHeader from '../components/profile/ProfileHeader';
import MembershipBadge from '../components/profile/MembershipBadge';
import QuickAccessGrid from '../components/profile/QuickAccessCard';
import RecentActivity from '../components/profile/RecentActivity';
import Preferences from '../components/profile/Preferences';
import AccountSecurity from '../components/profile/AccountSecurity';
import EditProfileModal from '../components/profile/EditProfileModal';
import LogoutModal from '../components/profile/LogoutModal';

/**
 * NotLoggedInState Component
 * Shows when user is not authenticated
 */
const NotLoggedInState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pb-28">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg 
          className="w-12 h-12 text-gray-400" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
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
        onClick={() => navigate('/login')}
        className="px-8 py-3.5 rounded-xl bg-[#1C2A3A] text-white text-[15px] font-semibold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] active:scale-95 transition-all shadow-lg"
      >
        Log In
      </button>
    </div>
  );
};

/**
 * ProfilePage Component
 * Main profile page with all sections
 */
const ProfilePage = memo(() => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  
  // State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Get auth state from Redux
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated || false);
  const user = useSelector(state => state.auth?.user || null);
  
  // Get counts from Redux (if available)
  const inquiriesCount = useSelector(state => state.activity?.inquiries?.length || 0);
  const toursCount = useSelector(state => state.activity?.tours?.length || 0);
  const messagesCount = useSelector(state => state.activity?.messages?.length || 0);
  const savedCount = useSelector(state => state.saved?.properties?.length || 0);

  // Handle logout
  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
    setShowLogoutModal(false);
  }, [logoutMutation]);

  // Show not logged in state
  if (!isAuthenticated || !user) {
    return <NotLoggedInState />;
  }

  // Show profile when authenticated
  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <div className="px-4">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onEdit={() => setShowEditModal(true)}
        />

        {/* Membership Badge */}
        <MembershipBadge memberSince={user.memberSince || 'January 2024'} />

        {/* Quick Access - ONLY ONE INSTANCE */}
        <QuickAccessGrid
          savedCount={savedCount}
          inquiriesCount={inquiriesCount}
          toursCount={toursCount}
          messagesCount={messagesCount}
          onNavigate={navigate}
        />

        {/* Recent Activity */}
        <RecentActivity onNavigate={navigate} />

        {/* Preferences */}
        <Preferences />

        {/* Account & Security */}
        <AccountSecurity onLogout={() => setShowLogoutModal(true)} />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={logoutMutation.isPending}
      />
    </div>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
