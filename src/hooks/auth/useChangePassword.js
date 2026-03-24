
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const changePasswordApi = async ({ currentPassword, newPassword }) => {
  const response = await axiosInstance.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const useChangePassword = ({ onSuccess } = {}) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: (data) => {
      toast.success(data?.message || 'Password changed. Please login again.');
      // Backend blacklists tokens — force logout
      setTimeout(() => {
        dispatch(clearAuth());
      }, 1500);
      onSuccess?.();
    },
    onError: (error) => {
      const msg = error?.response?.data?.error?.message ||
                  error?.response?.data?.message ||
                  'Failed to change password.';
      toast.error(msg);
    },
    retry: false,
  });
};

export default useChangePassword;
