// src/api/propertyApi.js - COMPLETE VERSION
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

// ─── Agent Property Management APIs ───────────────────────────────────────────

/**
 * Create new property
 * POST /api/v1/properties
 * AUTHENTICATED - verified agent only
 */
export const createProperty = async (formData) => {
  try {
    const response = await axiosInstance.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create property');
  }
};

/**
 * Update property
 * PUT /api/v1/properties/:id
 * AUTHENTICATED - owner only
 */
export const updateProperty = async (propertyId, data) => {
  try {
    const response = await axiosInstance.put(`/properties/${propertyId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update property');
  }
};

/**
 * Delete property
 * DELETE /api/v1/properties/:id
 * AUTHENTICATED - owner only
 */
export const deleteProperty = async (propertyId) => {
  try {
    const response = await axiosInstance.delete(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete property');
  }
};

/**
 * Update featured image
 * PUT /api/v1/properties/:id/featured-image
 * AUTHENTICATED - owner only
 */
export const updateFeaturedImage = async (propertyId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axiosInstance.put(
      `/properties/${propertyId}/featured-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update featured image');
  }
};

/**
 * Add gallery images
 * POST /api/v1/properties/:id/gallery
 * AUTHENTICATED - owner only
 */
export const addGalleryImages = async (propertyId, images, captions = []) => {
  try {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    if (captions.length > 0) {
      formData.append('captions', JSON.stringify(captions));
    }
    
    const response = await axiosInstance.post(
      `/properties/${propertyId}/gallery`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add gallery images');
  }
};

/**
 * Remove gallery image
 * DELETE /api/v1/properties/:id/gallery/:index
 * AUTHENTICATED - owner only
 */
export const removeGalleryImage = async (propertyId, imageIndex) => {
  try {
    const response = await axiosInstance.delete(
      `/properties/${propertyId}/gallery/${imageIndex}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove gallery image');
  }
};

/**
 * Submit property for approval
 * POST /api/v1/properties/:id/submit
 * AUTHENTICATED - owner only
 */
export const submitPropertyForApproval = async (propertyId) => {
  try {
    const response = await axiosInstance.post(`/properties/${propertyId}/submit`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit property');
  }
};

// ─── Admin Property APIs ──────────────────────────────────────────────────────

/**
 * Approve property
 * POST /api/v1/properties/:id/approve
 * AUTHENTICATED - admin/manager only
 */
export const approveProperty = async (propertyId) => {
  try {
    const response = await axiosInstance.post(`/properties/${propertyId}/approve`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to approve property');
  }
};

/**
 * Reject property
 * POST /api/v1/properties/:id/reject
 * AUTHENTICATED - admin/manager only
 */
export const rejectProperty = async (propertyId, reason) => {
  try {
    const response = await axiosInstance.post(`/properties/${propertyId}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject property');
  }
};

/**
 * Update property status
 * PATCH /api/v1/properties/:id/status
 * AUTHENTICATED - admin/manager only
 */
export const updatePropertyStatus = async (propertyId, status, rejectionReason = null) => {
  try {
    const response = await axiosInstance.patch(`/properties/${propertyId}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update property status');
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
