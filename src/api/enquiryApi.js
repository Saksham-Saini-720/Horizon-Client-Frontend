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


