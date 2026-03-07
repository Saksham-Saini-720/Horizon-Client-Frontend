// src/api/tourApi.js - UPDATED to match API docs
import axiosInstance from './axiosInstance';

/**
 * Submit Tour Request
 * POST /api/v1/tours/property/:id
 * PUBLIC endpoint - no auth required
 */
export const submitTourRequest = async (propertyId, data) => {
  try {
    const response = await axiosInstance.post(`/tours/property/${propertyId}`, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferredDate: data.preferredDate, // YYYY-MM-DD
      preferredTime: data.preferredTime, // HH:mm (single time)
      numberOfPeople: data.numberOfPeople || 1,
      message: data.message || '',
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit tour request');
  }
};

/**
 * Get User's Tour Requests
 * GET /api/v1/tours
 * AUTHENTICATED - requires Bearer token
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
 * Cancel Tour Request
 * PATCH /api/v1/tours/:id/cancel
 * AUTHENTICATED
 */
export const cancelTourRequest = async (tourId, reason) => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel tour');
  }
};

/**
 * Reschedule Tour Request
 * PATCH /api/v1/tours/:id/reschedule
 * AUTHENTICATED
 */
export const rescheduleTourRequest = async (tourId, data) => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/reschedule`, {
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      reason: data.reason || '',
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reschedule tour');
  }
};
