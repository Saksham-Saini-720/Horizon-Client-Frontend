
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelTourRequest, rescheduleTourRequest } from '../../api/tourApi';
import toast from 'react-hot-toast';

/**
 * useCancelTour Hook
 * Cancel a tour request
 */
export const useCancelTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, reason }) => cancelTourRequest(tourId, reason),
    onSuccess: () => {
      // Invalidate tours query to refetch
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      
      toast.success('Tour cancelled successfully', {
        duration: 3000,
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel tour', {
        duration: 4000,
        position: 'top-center',
      });
    },
  });
};

/**
 * useRescheduleTour Hook
 * Reschedule a tour request
 */
export const useRescheduleTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, preferredDate, preferredTime }) => 
      rescheduleTourRequest(tourId, preferredDate, preferredTime),
    onSuccess: () => {
      // Invalidate tours query to refetch
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      
      toast.success('Tour rescheduled successfully. Waiting for agent confirmation.', {
        duration: 4000,
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reschedule tour', {
        duration: 4000,
        position: 'top-center',
      });
    },
  });
};

/**
 * useDeleteTour Hook
 * Delete a tour from the activity list
 * (Client-side removal from the list)
 */
export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tourId }) => {
      // Optimistically remove from cache
      queryClient.setQueryData(['tours'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(tour => tour.id !== tourId);
      });
      
      // Return success immediately (client-side delete)
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Tour request removed from your list', {
        duration: 3000,
        position: 'top-center',
      });
    },
    onError: () => {
      // Rollback on error
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      
      toast.error('Failed to remove tour', {
        duration: 3000,
        position: 'top-center',
      });
    },
  });
};
