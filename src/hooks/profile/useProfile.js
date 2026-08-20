
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getMyProfile } from '../../api/profileApi';
import { updateUser } from '../../store/slices/authSlice';
import { formatPersonName } from "../../utils/formatPersonName";

/**
 * Transform backend profile to frontend format
 * Backend: { user: {...}, profile: {...} }
 * Frontend: Flat structure
 */
const transformProfile = (data) => {
  const { user, profile } = data;
  
  return {
    // User fields (flat)
    _id: user._id,
    id: user._id,
    firstName: formatPersonName(user.firstName),
    lastName: formatPersonName(user.lastName),
    email: user.email,
    phone: user.phone,
    role: user.role,
    verified: user.emailVerification || false,
    // Kept under its backend name too — the auth gates read `emailVerification`,
    // so this fetch doubles as a self-heal for a stale stored snapshot.
    emailVerification: user.emailVerification === true,
    profileImage: user.avatar,
    status: user.status,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    
    // Profile fields
    preferences: {
      interestedIn: profile.preferences?.propertyTypes || [],
      locations: profile.preferences?.locations || [],
      budget: profile.preferences?.budget,
      amenities: profile.preferences?.amenities || [],
      purpose: profile.preferences?.purpose || 'both',
    },
    
    notifications: {
      inApp: user.notificationPreferences?.inApp ?? profile.notifications?.newListings ?? true,
      email: user.notificationPreferences?.email ?? profile.notifications?.priceDrops ?? true,
      push: user.notificationPreferences?.push ?? profile.notifications?.openHouses ?? false,
    },
    
    // Saved properties
    savedProperties: profile.savedProperties || [],
    
    // Other profile data
    viewingHistory: profile.viewingHistory || [],
    searchHistory: profile.searchHistory || [],
    inquiries: profile.inquiries || [],
  };
};

/**
 * useProfile Hook - FINAL VERSION
 * Single source of truth for profile data
 */
export const useProfile = (options = {}) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      
      const response = await getMyProfile();
      
      // Transform to frontend format
      const profile = transformProfile(response.data);
      
      // Sync with Redux (flat structure for auth)
      dispatch(updateUser({
        id: profile._id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        verified: profile.verified,
        emailVerification: profile.emailVerification,
        profileImage: profile.profileImage,
        preferences: profile.preferences,
        notifications: profile.notifications,
      }));
      
      return profile;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    ...options,
  });
};

export default useProfile;
