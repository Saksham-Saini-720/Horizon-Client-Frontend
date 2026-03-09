// src/hooks/tours/useTourManagement.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelTourRequest, rescheduleTourRequest, confirmTour, completeTour, deleteTour } from '../../api/tourApi';
import toast from 'react-hot-toast';

/**
 * useCancelTour Hook
 * Cancel a tour request (client)
 */
export const useCancelTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, reason }) => cancelTourRequest(tourId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tour cancelled successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel tour');
    },
  });
};

/**
 * useRescheduleTour Hook
 * Reschedule a tour request (client)
 */
export const useRescheduleTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, preferredDate, preferredTime }) => 
      rescheduleTourRequest(tourId, preferredDate, preferredTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tour rescheduled successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reschedule tour');
    },
  });
};

/**
 * useConfirmTour Hook
 * Confirm a tour (agent)
 */
export const useConfirmTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, confirmedDateTime }) => confirmTour(tourId, confirmedDateTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tour confirmed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to confirm tour');
    },
  });
};

/**
 * useCompleteTour Hook
 * Mark tour as completed (agent)
 */
export const useCompleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, notes }) => completeTour(tourId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tour marked as completed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to complete tour');
    },
  });
};

/**
 * useDeleteTour Hook
 * Delete a tour
 */
export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tourId) => deleteTour(tourId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tour deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete tour');
    },
  });
};
