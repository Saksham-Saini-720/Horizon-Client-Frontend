
import { memo } from 'react';

/**
 * ProfileHeader Component
 * Shows user info, verification status, and edit button
 * NOW WORKS WITH API PROFILE DATA
 */
const ProfileHeader = memo(({ user, onEdit }) => {
  // Get initials from first and last name
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  // Format member since date
  const formatMemberSince = (dateString) => {
    if (!dateString) return 'January 2024';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    
    //   {/* User Info Card */}
      <div className="bg-gradient-to-br from-secondary/20 to-secondary-light rounded-3xl px-6 py-4 mt-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="relative">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-20 h-20 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-white text-[24px] font-semibold font-inter shadow-lg">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h2 className="text-[20px] font-semibold text-primary font-inter mb-3">
              {user?.firstName} {user?.lastName}
            </h2>
            
            {/* Phone */}
            {user?.phone && (
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="text-[15px] text-gray-600 font-inter">
                  {user.phone}
                </span>
                {user.verified && (
                  <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            )}

            {/* Email */}
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-[15px] text-gray-600 font-inter">
                {user?.email}
              </span>
              {user?.verified && (
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Verified Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[12px] font-semibold text-green-600 font-inter">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-secondary hover:bg-amber-50 hover:text-secondary transition-all group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:rotate-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span className="text-[15px] font-semibold font-inter">
            Edit Profile
          </span>
        </button>
      </div>
    
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
