// src/api/enquiryApi.js
import axiosInstance from './axiosInstance';


export const submitPropertyEnquiry = async (propertyId, data) => {
  try {
    const response = await axiosInstance.post(
      `/enquiries/property/${propertyId}`,
      data
    );
    return response.data;
  } catch (error) {
    // Extract error message from API response
    const message = error.response?.data?.message || 'Failed to submit enquiry';
    throw new Error(message);
  }
};

/**
 * Get User's Enquiries (Optional - if API exists)
 */
// export const getUserEnquiries = async () => {
//   try {
//     const response = await axiosInstance.get('/enquiries');
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to fetch enquiries');
//   }
// };

/**
 * Get Enquiry by ID (Optional - if API exists)
 */
// export const getEnquiryById = async (enquiryId) => {
//   try {
//     const response = await axiosInstance.get(`/enquiries/${enquiryId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to fetch enquiry');
//   }
// };
