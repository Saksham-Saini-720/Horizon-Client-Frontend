
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createProperty, 
  updateProperty, 
  deleteProperty,
  updateFeaturedImage,
  addGalleryImages,
  removeGalleryImage,
  submitPropertyForApproval,
  approveProperty,
  rejectProperty,
  updatePropertyStatus
} from '../../api/propertyApi';
import toast from 'react-hot-toast';

/**
 * useCreateProperty Hook
 * Create new property (verified agent)
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create property');
    },
  });
};

/**
 * useUpdateProperty Hook
 * Update property (owner)
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, data }) => updateProperty(propertyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['userProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update property');
    },
  });
};

/**
 * useDeleteProperty Hook
 * Delete property (owner)
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete property');
    },
  });
};

/**
 * useUpdateFeaturedImage Hook
 * Update property featured image (owner)
 */
export const useUpdateFeaturedImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, imageFile }) => updateFeaturedImage(propertyId, imageFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['userProperties'] });
      toast.success('Featured image updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update featured image');
    },
  });
};

/**
 * useAddGalleryImages Hook
 * Add gallery images (owner)
 */
export const useAddGalleryImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, images, captions }) => addGalleryImages(propertyId, images, captions),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['userProperties'] });
      toast.success('Gallery images added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add gallery images');
    },
  });
};

/**
 * useRemoveGalleryImage Hook
 * Remove gallery image (owner)
 */
export const useRemoveGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, imageIndex }) => removeGalleryImage(propertyId, imageIndex),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['userProperties'] });
      toast.success('Gallery image removed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove gallery image');
    },
  });
};

/**
 * useSubmitPropertyForApproval Hook
 * Submit property for approval (owner)
 */
export const useSubmitPropertyForApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPropertyForApproval,
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['userProperties'] });
      toast.success('Property submitted for approval');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit property');
    },
  });
};

/**
 * useApproveProperty Hook
 * Approve property (admin/manager)
 */
export const useApproveProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property approved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve property');
    },
  });
};

/**
 * useRejectProperty Hook
 * Reject property (admin/manager)
 */
export const useRejectProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, reason }) => rejectProperty(propertyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property rejected');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reject property');
    },
  });
};

/**
 * useUpdatePropertyStatus Hook
 * Update property status (admin/manager)
 */
export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, status, rejectionReason }) => 
      updatePropertyStatus(propertyId, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property status updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update property status');
    },
  });
};
