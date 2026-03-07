// src/api/propertyApi.js
import axiosInstance from './axiosInstance';

// ─── Property Listing APIs ────────────────────────────────────────────────────

/**
 * Get all properties with filters and pagination
 * GET /api/v1/properties
 */
export const getAllProperties = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/properties', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch properties');
  }
};

/**
 * Get property by ID
 * GET /api/v1/properties/:id
 */
export const getPropertyById = async (propertyId) => {
  try {
    const response = await axiosInstance.get(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch property');
  }
};

/**
 * Search properties with query
 * GET /api/v1/properties?search=keyword
 */
export const searchProperties = async (searchQuery, params = {}) => {
  try {
    const response = await axiosInstance.get('/properties', {
      params: { search: searchQuery, ...params }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search properties');
  }
};

/**
 * Get featured properties
 * GET /api/v1/properties/featured
 */
export const getFeaturedProperties = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/properties/featured', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch featured properties');
  }
};

/**
 * Get new listings (sorted by newest)
 * GET /api/v1/properties?sort=newest
 */
export const getNewListings = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/properties', {
      params: {
        sort: 'newest',
        limit: 10,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch new listings');
  }
};

/**
 * Get nearby properties using GPS coordinates
 * GET /api/v1/properties/nearby
 */
export const getNearbyProperties = async (longitude, latitude, maxDistance = 5000, limit = 20) => {
  try {
    const response = await axiosInstance.get('/properties/nearby', {
      params: {
        longitude,
        latitude,
        maxDistance,
        limit
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch nearby properties');
  }
};

/**
 * View property (tracked view - requires auth)
 * GET /api/v1/properties/:id/view
 */
export const viewPropertyTracked = async (propertyId) => {
  try {
    const response = await axiosInstance.get(`/properties/${propertyId}/view`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to view property');
  }
};

// ─── Property Enquiry APIs ────────────────────────────────────────────────────

/**
 * Submit Property Enquiry
 * POST /api/v1/enquiries/property/:id
 */
export const submitPropertyEnquiry = async (propertyId, data) => {
  try {
    const response = await axiosInstance.post(
      `/enquiries/property/${propertyId}`,
      data
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit enquiry';
    throw new Error(message);
  }
};

/**
 * Get user's enquiries
 * GET /api/v1/enquiries
 */
export const getUserEnquiries = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/enquiries', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch enquiries');
  }
};

/**
 * Get enquiry by ID
 */
export const getEnquiryById = async (enquiryId) => {
  try {
    const response = await axiosInstance.get(`/enquiries/${enquiryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch enquiry');
  }
};

// ─── Saved/Favorite Properties ────────────────────────────────────────────────

/**
 * Save property to favorites
 * POST /api/v1/profile/client/saved-properties
 */
export const saveProperty = async (propertyId, notes = '') => {
  try {
    const response = await axiosInstance.post('/profiles/client/saved-properties', {
      propertyId,
      notes
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save property');
  }
};

/**
 * Remove property from favorites
 * DELETE /api/v1/profile/client/saved-properties/:propertyId
 */
export const unsaveProperty = async (propertyId) => {
  try {
    const response = await axiosInstance.delete(`/profiles/client/saved-properties/${propertyId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unsave property');
  }
};

/**
 * Get saved properties
 * GET /api/v1/profile/client/saved-properties
 */
export const getSavedProperties = async () => {
  try {
    const response = await axiosInstance.get('/profiles/client/saved-properties');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch saved properties');
  }
};
