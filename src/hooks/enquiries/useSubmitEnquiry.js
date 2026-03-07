// src/hooks/enquiries/useSubmitEnquiry.js
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { submitPropertyEnquiry } from '../../api/enquiryApi';
import { addInquiry } from '../../store/slices/activitySlice';
import toast from 'react-hot-toast';

/**
 * useSubmitEnquiry Hook
 * Handles property enquiry submission with Redux integration
 * 
 * Usage:
 * const submitMutation = useSubmitEnquiry();
 * submitMutation.mutate({ propertyId, data, property, agent });
 */
export const useSubmitEnquiry = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ propertyId, data }) => {
      // Call API
      const response = await submitPropertyEnquiry(propertyId, data);
      return response;
    },

    onSuccess: (response, variables) => {
      // Extract data from response
      const enquiryData = response.data || response;
      
      // Save to Redux activity slice
      dispatch(addInquiry({
        id: enquiryData.enquiry_id || Date.now(),
        property: variables.property || {
          id: variables.propertyId,
          title: 'Property',
        },
        message: variables.data.message,
        agent: variables.agent || null,
        status: enquiryData.enquiry_status || 'submitted',
        timestamp: 'just now',
        createdAt: Date.now(),
      }));

      // Show success toast
      toast.success(
        enquiryData.message || 'Enquiry sent successfully! The agent will contact you soon.',
        {
          duration: 4000,
          position: 'top-center',
        }
      );
    },

    onError: (error) => {
      // Show error toast
      const errorMessage = error.message || 'Failed to submit enquiry. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    },

    retry: false, // Don't retry on error
  });
};

export default useSubmitEnquiry;
