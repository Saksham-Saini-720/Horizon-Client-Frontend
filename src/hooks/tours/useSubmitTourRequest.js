
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { submitTourRequest } from '../../api/tourApi';
import { addTourRequest } from '../../store/slices/activitySlice';
import toast from 'react-hot-toast';

/**
 * useSubmitTourRequest Hook
 * Handles tour request submission with API + Redux integration
 * 
 * UPDATED: Now matches backend API format
 * - Sends single preferredTime (not array)
 * - Requires user profile data (name, email, phone)
 * - Uses public endpoint /tours/property/:id
 * 
 * Usage:
 * const submitMutation = useSubmitTourRequest();
 * submitMutation.mutate({ 
 *   propertyId, 
 *   preferredDate,      // "2026-03-15" 
 *   preferredTime,      // "10:00" (single time)
 *   numberOfPeople,     // 1-10
 *   message,            // Optional note
 *   property,           // Property object (for Redux)
 *   agent               // Agent object (for Redux)
 * });
 */
export const useSubmitTourRequest = () => {
  const dispatch = useDispatch();
  
  // Get user profile data from Redux auth state
  const user = useSelector(state => state.auth.user);

  return useMutation({
    mutationFn: async (data) => {
      // Validate user data is available
      const userName = user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}`.trim()
        : user?.name || 'User';
      
      const userEmail = user?.email;
      const userPhone = user?.phone;

      if (!userEmail || !userPhone) {
        throw new Error('User profile data is incomplete. Please update your profile.');
      }

      // Format data for API (matching backend expectations)
      const apiData = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        preferredDate: data.preferredDate, // YYYY-MM-DD format
        preferredTime: data.preferredTime, // HH:mm format (single time)
        numberOfPeople: data.numberOfPeople || 1,
        message: data.message || '',
      };

      // Call API - PUBLIC endpoint
      const response = await submitTourRequest(data.propertyId, apiData);
      return response;
    },

    onSuccess: (response, variables) => {
      // Extract data from response
      const tourData = response.data?.tour || response.data || response;
      
      // Save to Redux activity slice
      dispatch(addTourRequest({
        id: tourData.tour_id || tourData._id || Date.now().toString(),
        property: {
          id: variables.property?.id || variables.propertyId,
          title: variables.property?.title || 'Property',
          location: variables.property?.location || '',
          img: variables.property?.img || variables.property?.images?.[0] || '',
          price: variables.property?.price || '',
        },
        visitType: variables.visitType || 'in-person', // Frontend tracks this
        preferredDate: variables.preferredDate,
        preferredTime: variables.preferredTime,
        preferredTimes: variables.preferredTimes || [variables.preferredTime], // Store all selected times for display
        selectedTimes: variables.preferredTimes || [variables.preferredTime], // For backward compatibility
        numberOfPeople: variables.numberOfPeople || 1,
        notes: variables.message || '',
        message: variables.message || '',
        agent: variables.agent ? {
          id: variables.agent.id,
          name: variables.agent.name,
          title: variables.agent.title,
          avatar: variables.agent.avatar,
          phone: variables.agent.phone,
          email: variables.agent.email,
        } : null,
        status: tourData.status || 'pending',
        timestamp: 'just now',
        createdAt: Date.now(),
      }));

      // Success toast is shown by TourSuccessModal
      // So we don't show it here
    },

    onError: (error) => {
      // Show error toast
      const errorMessage = error.message || 'Failed to submit tour request. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    },

    retry: false, // Don't retry on error
  });
};

export default useSubmitTourRequest;
