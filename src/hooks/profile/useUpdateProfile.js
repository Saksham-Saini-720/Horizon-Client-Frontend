
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateBasicInfo, updateClientPreferences, updateClientNotifications } from '../../api/profileApi';
import { updateUser } from '../../store/slices/authSlice'; 
import toast from 'react-hot-toast';

export const useUpdateBasicInfo = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateBasicInfo,
    onSuccess: (response) => {
      const user = response.data?.user;
      
      // Update Redux using updateUser
      if (user) {
        dispatch(updateUser({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          ...user,
        }));
      }
      
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Show success toast
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

/**
 * useUpdatePreferences Hook
 * Updates user's preferences
 */
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientPreferences,
    onSuccess: () => {
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Show success toast
      toast.success('Preferences updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update preferences');
    },
  });
};

/**
 * useUpdateNotifications Hook
 * Updates user's notification settings
 */
export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientNotifications,
    onSuccess: () => {
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Show success toast
      toast.success('Notification settings updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update notifications');
    },
  });
};
