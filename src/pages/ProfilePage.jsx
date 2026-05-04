
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLogout from '../hooks/auth/useLogout';
import { useProfile } from '../hooks/profile/useProfile';
import { useEnquiries } from '../hooks/activity/useEnquiries';
import { useTours } from '../hooks/activity/useTours';
import { useSavedProperties } from '../hooks/properties/useSavedProperties';
import { useUpdatePreferences, useUpdateNotifications } from '../hooks/profile/useUpdateProfile';
import { useDebounce } from '../hooks/utils/useDebounce';
import ProfileHeader from '../components/profile/ProfileHeader';
import QuickAccessGrid from '../components/profile/QuickAccessCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import LogoutModal from '../components/profile/LogoutModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import HelpSupportModal from '../components/profile/HelpSupportModal';
import useConversations from '../hooks/conversations/useConversations';

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle = ({ value, onChange, disabled }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
      value ? 'bg-secondary' : 'bg-gray-200'
    } disabled:opacity-50`}
  >
    <div
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        value ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
);

// ── Single settings list row ──────────────────────────────────────────────────
const SettingsRow = ({
  icon,
  iconBg = 'bg-primary-light/10',
  title,
  subtitle,
  badge,
  chevron = true,
  rightEl,
  onClick,
  className = '',
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${className}`}
  >
    <div
      className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[15px] font-semibold text-primary font-myriad">{title}</p>
      {subtitle && (
        <p className="text-[12px] text-gray-400 font-myriad mt-0.5">{subtitle}</p>
      )}
    </div>
    {badge != null && (
      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary-light flex items-center justify-center text-[11px] font-bold text-white font-myriad">
        {badge}
      </span>
    )}
    {rightEl}
    {chevron && (
      <svg
        className="w-4 h-4 text-gray-300 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </button>
);

// ── Thin list divider ─────────────────────────────────────────────────────────
const Divider = () => <div className="h-px bg-gray-100 mx-4" />;

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-[12px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-2 ml-1">
    {children}
  </p>
);

// ── Not logged in ─────────────────────────────────────────────────────────────
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
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h2 className="text-[24px] font-semibold text-primary font-myriad mb-2">
        Welcome to Horizon
      </h2>
      <p className="text-[15px] text-gray-500 font-myriad text-center max-w-xs mb-8">
        Log in to manage your profile, saved properties, inquiries, and more
      </p>
      <button
        onClick={() => navigate('/login')}
        className="px-8 py-3.5 rounded-xl bg-primary text-white text-[16px] font-semibold font-myriad hover:bg-primary-light active:scale-95 transition-all shadow-lg"
      >
        Log In
      </button>
    </div>
  );
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-100 pb-24 animate-pulse">
    <div className="bg-gradient-to-br from-[#1a2550] to-secondary h-72" />
    <div className="px-4 -mt-10">
      <div className="bg-white h-20 rounded-2xl shadow-lg" />
    </div>
    <div className="px-4 mt-6 space-y-4">
      <div className="bg-white h-36 rounded-2xl" />
      <div className="bg-white h-28 rounded-2xl" />
      <div className="bg-white h-48 rounded-2xl" />
    </div>
  </div>
);

// ── ProfilePage ───────────────────────────────────────────────────────────────
const ProfilePage = memo(() => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  // Modal visibility
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Inline expandable sections
  const [showNotifSection, setShowNotifSection] = useState(false);
  const [showPropertyTypes, setShowPropertyTypes] = useState(false);

  // Auth state
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated || false);
  const reduxUser = useSelector(state => state.auth?.user);

  // Server data
  const { data: profile, isLoading: profileLoading, isError, error } = useProfile({
    enabled: isAuthenticated,
  });
  const { data: savedProperties = [] } = useSavedProperties({ enabled: isAuthenticated });
  useEnquiries({}, { enabled: isAuthenticated });
  const { data: tours = [] } = useTours({}, { enabled: isAuthenticated });
  const { conversations = [], total: convTotal = 0 } = useConversations();

  // Preferences / notifications mutations
  const updateNotifications = useUpdateNotifications();
  const updatePreferences = useUpdatePreferences();

  const [contactPrefs, setContactPrefs] = useState({
    inApp: true,
    email: true,
    push: false,
  });
  const [interestedIn, setInterestedIn] = useState([]);

  // Sync local state when profile loads
  useEffect(() => {
    if (!profile) return;
    setContactPrefs({
      inApp: profile.notifications?.inApp ?? true,
      email: profile.notifications?.email ?? true,
      push: profile.notifications?.push ?? false,
    });
    if (profile.preferences?.interestedIn) setInterestedIn(profile.preferences.interestedIn);
  }, [profile?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced auto-save for property type interests
  const debouncedInterests = useDebounce(interestedIn, 1500);
  const userChangedInterests = useRef(false);

  useEffect(() => {
    if (!userChangedInterests.current) return;
    if (!profile) return;
    updatePreferences.mutate({
      propertyTypes: debouncedInterests,
      locations: profile.preferences?.locations || [],
      budget: profile.preferences?.budget,
      amenities: profile.preferences?.amenities || [],
      purpose: profile.preferences?.purpose || 'both',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInterests]);

  const toggleContactPref = useCallback((key) => {
    const updated = { ...contactPrefs, [key]: !contactPrefs[key] };
    setContactPrefs(updated);
    updateNotifications.mutate(updated);
  }, [updateNotifications, contactPrefs]);

  const toggleInterest = useCallback((type) => {
    userChangedInterests.current = true;
    setInterestedIn(prev =>
      prev.includes(type) ? prev.filter(i => i !== type) : [...prev, type]
    );
  }, []);

  // Derived counts
  const savedCount = savedProperties.length;
  const messagesCount = convTotal || conversations.length;

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
    setShowLogoutModal(false);
  }, [logoutMutation]);

  // ── Guard states ──
  if (!isAuthenticated) return <NotLoggedInState />;
  if (profileLoading) return <ProfileSkeleton />;

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
        <h2 className="text-[24px] font-semibold text-primary font-myriad mb-2">Failed to Load Profile</h2>
        <p className="text-[15px] text-gray-500 font-myriad text-center max-w-xs mb-8">
          {error?.message || 'Something went wrong'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3.5 rounded-xl bg-primary text-white text-[15px] font-semibold font-myriad hover:bg-primary-light active:scale-95 transition-all shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayUser = profile || reduxUser;

  if (!displayUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pb-28">
        <h2 className="text-[24px] font-semibold text-primary mb-4">No User Data</h2>
        <button onClick={() => navigate('/login')} className="px-8 py-3.5 rounded-xl bg-primary text-white">
          Back to Login
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      {/* Dark gradient header */}
      <ProfileHeader user={displayUser} onEdit={() => setShowEditModal(true)} />

      <div className="px-4">
        {/* Stats bar — overlaps header with negative margin */}
        <div className="-mt-10 mb-6 relative z-10">
          <QuickAccessGrid
            savedCount={savedCount}
            toursCount={tours.length}
            inboxCount={messagesCount}
            onNavigate={navigate}
          />
        </div>

        {/* ── ACCOUNT ── */}
        <div className="mb-5">
          <SectionLabel>Account</SectionLabel>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <SettingsRow
              onClick={() => setShowEditModal(true)}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              title="Personal details"
              subtitle="Name, address, identity"
            />
            <Divider />
            <SettingsRow
              onClick={() => setShowNotifSection(p => !p)}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
              title="Notifications"
              subtitle="Push, email & SMS"
              // badge={messagesCount > 0 ? messagesCount : undefined}
            />
            {showNotifSection && (
              <div className="px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100">
                <div className="space-y-4">
                  {[
                    { key: 'inApp', label: 'In-App Notifications', desc: 'Get notified inside the app' },
                    { key: 'email', label: 'Email Notifications',  desc: 'Receive updates via email' },
                    { key: 'push',  label: 'Push Notifications',   desc: 'Browser push alerts' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-[14px] font-semibold text-primary font-myriad">{label}</p>
                        <p className="text-[12px] text-gray-400 font-myriad">{desc}</p>
                      </div>
                      <Toggle
                        value={contactPrefs[key]}
                        onChange={() => toggleContactPref(key)}
                        disabled={updateNotifications.isPending}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── PREFERENCES ── */}
        <div className="mb-5">
          <SectionLabel>Preferences</SectionLabel>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <SettingsRow
              onClick={() => navigate('/saved')}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
              title="Saved searches"
              subtitle={`${savedCount} active alert${savedCount !== 1 ? 's' : ''}`}
            />
            <Divider />
            <SettingsRow
              onClick={() => setShowPropertyTypes(p => !p)}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
              title="Property types"
              subtitle="Your property preferences"
            />
            {showPropertyTypes && (
              <div className="px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {['apartment', 'house', 'villa', 'commercial', 'land'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleInterest(type)}
                      disabled={updatePreferences.isPending}
                      className={`px-5 py-2 rounded-full text-[14px] font-semibold font-myriad transition-all capitalize ${
                        interestedIn.includes(type)
                          ? 'bg-secondary text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {updatePreferences.isPending && (
                  <p className="text-[11px] text-gray-400 font-myriad mt-2">Saving…</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── ACCOUNT & SECURITY ── */}
        <div className="mb-8">
          <SectionLabel>Account &amp; Security</SectionLabel>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <SettingsRow
              onClick={() => setShowPasswordModal(true)}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
              title="Change Password"
              subtitle="Update your password"
            />
            <Divider />
            <SettingsRow
              onClick={() => navigate('/terms')}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              }
              title="Terms & Conditions"
              subtitle="Read our terms of use"
            />
            <Divider />
            <SettingsRow
              onClick={() => navigate('/privacy')}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              title="Privacy Policy"
              subtitle="How we use your data"
            />
            <Divider />
            <SettingsRow
              onClick={() => setShowSupportModal(true)}
              icon={
                <svg className="w-4 h-4 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              }
              title="Help & Support"
              subtitle="Get help with your account"
            />
          </div>

          {/* Sign out button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full mt-4 py-[14px] rounded-2xl font-semibold text-[15px] font-myriad transition-all active:scale-[0.98]"
            style={{
              background: '#FFF5F0',
              border: '1.5px solid rgba(201,108,56,0.35)',
              color: '#C96C38',
            }}
          >
            Sign out
          </button>

          <p className="text-center text-[11px] text-gray-400 font-myriad mt-5">
            Horizon Properties
          </p>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={displayUser}
      />
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={logoutMutation.isPending}
      />
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      <HelpSupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
});

ProfilePage.displayName = 'ProfilePage';
export default ProfilePage;
