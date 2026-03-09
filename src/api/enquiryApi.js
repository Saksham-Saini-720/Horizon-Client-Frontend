// src/api/enquiryApi.js - COMPLETE VERSION
import axiosInstance from './axiosInstance';

/**
 * Submit Property Enquiry
 * POST /api/v1/enquiries/property/:id
 * PUBLIC (rate-limited)
 */
export const submitPropertyEnquiry = async (propertyId, data) => {
  try {
    const response = await axiosInstance.post(
      `/enquiries/property/${propertyId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit enquiry');
  }
};

/**
 * Get User's Enquiries
 * GET /api/v1/enquiries
 * AUTHENTICATED
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
 * Get Enquiry by ID
 * GET /api/v1/enquiries/:id
 * AUTHENTICATED
 */
export const getEnquiryById = async (enquiryId) => {
  try {
    const response = await axiosInstance.get(`/enquiries/${enquiryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch enquiry');
  }
};

/**
 * Update Enquiry Status (Agent/Admin)
 * PUT /api/v1/enquiries/:id/status
 * AUTHENTICATED - agent or admin
 */
export const updateEnquiryStatus = async (enquiryId, status, notes = '') => {
  try {
    const response = await axiosInstance.put(`/enquiries/${enquiryId}/status`, {
      status,
      notes,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update enquiry status');
  }
};

/**
 * Delete Enquiry
 * DELETE /api/v1/enquiries/:id
 * AUTHENTICATED
 */
export const deleteEnquiry = async (enquiryId) => {
  try {
    const response = await axiosInstance.delete(`/enquiries/${enquiryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete enquiry');
  }
};
