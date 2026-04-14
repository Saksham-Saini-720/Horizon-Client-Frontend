
import axiosInstance from './axiosInstance';


// ─── Public Property APIs ─────────────────────────────────────────────────────

/**
 * Get all properties with filters and pagination
 * GET /api/v1/properties
 * PUBLIC
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
 * PUBLIC
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
 * PUBLIC
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
 * Get property agent/owner details
 * GET /api/v1/properties/:id/agent
 * AUTHENTICATED - client only
 */
export const getPropertyAgent = async (propertyId) => {
  try {
    const response = await axiosInstance.get(`/properties/${propertyId}/agent`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch agent details');
  }
};

export const getMostViewedProperties = async (limit = 10) => {
  const response = await axiosInstance.get(`/properties/most-viewed`, {
    params: { limit }
  });
  return response.data;
};

/**
 * Get featured properties
 * GET /api/v1/properties/featured
 * PUBLIC
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
 * PUBLIC
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
 * PUBLIC
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
 * AUTHENTICATED
 */
export const viewPropertyTracked = async (propertyId) => {
  try {
    const response = await axiosInstance.get(`/properties/${propertyId}/view`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to view property');
  }
};

// ─── User Properties APIs (Client/Agent) ──────────────────────────────────────

/**
 * Get user's properties (for agents or clients who listed properties)
 * GET /api/v1/properties/my-properties
 * AUTHENTICATED - client or agent
 */
export const getUserProperties = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/properties/my-properties', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user properties');
  }
};




// ─── Saved/Favorite Properties ────────────────────────────────────────────────

/**
 * Save property to favorites
 * POST /api/v1/profiles/client/saved-properties
 * AUTHENTICATED
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
 * DELETE /api/v1/profiles/client/saved-properties/:propertyId
 * AUTHENTICATED
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
 * GET /api/v1/profiles/client/saved-properties
 * AUTHENTICATED
 */
export const getSavedProperties = async () => {
  try {
    const response = await axiosInstance.get('/profiles/client/saved-properties');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch saved properties');
  }
};
