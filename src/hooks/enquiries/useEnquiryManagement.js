// src/hooks/enquiries/useEnquiryManagement.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEnquiryStatus, deleteEnquiry } from '../../api/enquiryApi';
import toast from 'react-hot-toast';

/**
 * useUpdateEnquiryStatus Hook
 * Update enquiry status (agent/admin)
 */
export const useUpdateEnquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enquiryId, status, notes }) => updateEnquiryStatus(enquiryId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry status updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update enquiry status');
    },
  });
};

/**
 * useDeleteEnquiry Hook
 * Delete an enquiry
 */
export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enquiryId) => deleteEnquiry(enquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete enquiry');
    },
  });
};
