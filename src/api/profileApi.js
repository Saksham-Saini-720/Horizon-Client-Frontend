// src/api/profileApi.js - FINAL (Matches backend structure)
import axiosInstance from './axiosInstance';

/**
 * Get My Profile
 * GET /api/v1/profiles
 * Returns: { user: {...}, profile: {...} }
 */
export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get('/profiles');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

/**
 * Update Basic Info
 * PUT /api/v1/profiles/basic
 */
export const updateBasicInfo = async (data) => {
  try {
    const response = await axiosInstance.put('/profiles/basic', {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update basic info');
  }
};

/**
 * Update Client Preferences
 * PUT /api/v1/profiles/client/preferences
 * Backend expects: { preferences: { propertyTypes, locations, budget, amenities, purpose } }
 */
export const updateClientPreferences = async (preferences) => {
  try {
    const response = await axiosInstance.put('/profiles/client/preferences', {
      preferences: {
        propertyTypes: preferences.propertyTypes || [], // ✅ Backend field name
        locations: preferences.locations || [],
        budget: preferences.budget || { min: 0, currency: 'USD' },
        amenities: preferences.amenities || [],
        purpose: preferences.purpose || 'both',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update preferences');
  }
};

/**
 * Update Client Notifications
 * PUT /api/v1/profiles/client/notifications
 * Backend expects: { notifications: { inApp, email, push } }
 */
export const updateClientNotifications = async (notifications) => {
  try {
    const response = await axiosInstance.put('/profiles/client/notifications', {
      notifications: {
        inApp: notifications.inApp ?? true,
        email: notifications.email ?? true,
        push: notifications.push ?? false,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update notifications');
  }
};





