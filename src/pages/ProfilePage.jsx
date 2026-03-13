// src/pages/ProfilePage.jsx - FIXED: Correct saved count
import { memo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useLogout from '../hooks/auth/useLogout';
import { useProfile } from '../hooks/profile/useProfile';
import { useEnquiries } from '../hooks/activity/useEnquiries';
import { useTours } from '../hooks/activity/useTours';
import { useSavedProperties } from '../hooks/properties/useSavedProperties'; // ⭐ ADDED
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
 * ProfileSkeleton Component
 */
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-100 pb-24 px-4 animate-pulse">
    <div className="bg-white mt-6 px-6 rounded-3xl mb-6 shadow-lg h-64" />
    <div className="bg-white h-20 rounded-2xl mb-6" />
    <div className="grid grid-cols-2 gap-4 mb-6">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-white h-32 rounded-2xl" />
      ))}
    </div>
  </div>
);

/**
 * ProfilePage Component - FIXED: Correct saved count
 * Uses useSavedProperties for accurate count (filters deleted properties)
 */
const ProfilePage = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutMutation = useLogout();
  
  // State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Get auth state from Redux
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated || false);
  const reduxUser = useSelector(state => state.auth?.user);
  
  console.log('🔵 [ProfilePage] Mounted - Auth:', isAuthenticated);
  
  // ✅ SINGLE profile fetch (includes user + profile data)
  const { 
    data: profile, 
    isLoading: profileLoading, 
    isError, 
    error 
  } = useProfile({
    enabled: isAuthenticated,
  });
  
  // ⭐ FIX: Use useSavedProperties for accurate count (filters deleted properties)
  const { data: savedProperties = [] } = useSavedProperties({ 
    enabled: isAuthenticated,
  });
  
  // ✅ Activity counts (only if authenticated)
  const { data: enquiries = [] } = useEnquiries({}, { 
    enabled: isAuthenticated,
  });
  
  const { data: tours = [] } = useTours({}, { 
    enabled: isAuthenticated,
  });
  
  // ⭐ FIXED: Get count from useSavedProperties (already filters null properties)
  const savedCount = savedProperties.length;

  console.log('📊 [ProfilePage] Counts - Saved:', savedCount, 'Enquiries:', enquiries.length, 'Tours:', tours.length);

  // Handle logout
  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
    setShowLogoutModal(false);
  }, [logoutMutation]);

  // Show not logged in state
  if (!isAuthenticated) {
    return <NotLoggedInState />;
  }

  // Show loading skeleton
  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pb-28">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-[24px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
          Failed to Load Profile
        </h2>
        <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] text-center max-w-xs mb-8">
          {error?.message || 'Something went wrong'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3.5 rounded-xl bg-[#1C2A3A] text-white text-[15px] font-semibold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] active:scale-95 transition-all shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // Use profile or fallback to Redux user
  const displayUser = profile || reduxUser;
  
  if (!displayUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pb-28">
        <h2 className="text-[24px] font-bold text-[#1C2A3A] mb-4">No User Data</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3.5 rounded-xl bg-[#1C2A3A] text-white"
        >
          Back to Login
        </button>
      </div>
    );
  }

  console.log('✅ [ProfilePage] Rendering with user:', displayUser.firstName);

  // Show profile
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="px-4">
        {/* Profile Header */}
        <ProfileHeader
          user={displayUser}
          onEdit={() => setShowEditModal(true)}
        />

        {/* Membership Badge */}
        <MembershipBadge 
          memberSince={displayUser.createdAt 
            ? new Date(displayUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'January 2024'
          } 
        />

        {/* Quick Access - NOW WITH CORRECT COUNT */}
        <QuickAccessGrid
          savedCount={savedCount}
          inquiriesCount={enquiries.length}
          toursCount={tours.length}
          messagesCount={0}
          onNavigate={navigate}
        />

        {/* Recent Activity */}
        <RecentActivity onNavigate={navigate} />

        {/* Preferences */}
        <Preferences profile={displayUser} />

        {/* Account & Security */}
        <AccountSecurity onLogout={() => setShowLogoutModal(true)} />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={displayUser}
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
