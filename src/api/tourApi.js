// src/api/tourApi.js - COMPLETE VERSION
import axiosInstance from './axiosInstance';

/**
 * Submit Tour Request
 * POST /api/v1/tours/property/:id
 * PUBLIC (rate-limited)
 */
export const submitTourRequest = async (propertyId, data) => {
  try {
    const response = await axiosInstance.post(
      `/tours/property/${propertyId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit tour request');
  }
};

/**
 * Get User's Tours
 * GET /api/v1/tours
 * AUTHENTICATED
 */
export const getUserTours = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/tours', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tours');
  }
};

/**
 * Get Tour by ID
 * GET /api/v1/tours/:id
 * AUTHENTICATED
 */
export const getTourById = async (tourId) => {
  try {
    const response = await axiosInstance.get(`/tours/${tourId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tour');
  }
};

/**
 * Cancel Tour Request (Client)
 * PATCH /api/v1/tours/:id/cancel
 * AUTHENTICATED
 */
export const cancelTourRequest = async (tourId, reason) => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel tour');
  }
};

/**
 * Reschedule Tour (Client)
 * PATCH /api/v1/tours/:id/reschedule
 * AUTHENTICATED
 */
export const rescheduleTourRequest = async (tourId, preferredDate, preferredTime) => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/reschedule`, {
      preferredDate,
      preferredTime,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reschedule tour');
  }
};

/**
 * Confirm Tour (Agent)
 * PATCH /api/v1/tours/:id/confirm
 * AUTHENTICATED - agent only
 */
export const confirmTour = async (tourId, confirmedDateTime) => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/confirm`, {
      confirmedDateTime,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to confirm tour');
  }
};

/**
 * Complete Tour (Agent)
 * PATCH /api/v1/tours/:id/complete
 * AUTHENTICATED - agent only
 */
export const completeTour = async (tourId, notes = '') => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/complete`, {
      notes,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to complete tour');
  }
};

/**
 * Delete Tour
 * DELETE /api/v1/tours/:id
 * AUTHENTICATED
 */
export const deleteTour = async (tourId) => {
  try {
    const response = await axiosInstance.delete(`/tours/${tourId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete tour');
  }
};
