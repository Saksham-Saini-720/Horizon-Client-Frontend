
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getSavedProperties, saveProperty, unsaveProperty } from '../../api/propertyApi';
import { transformProperties } from '../../utils/propertyTransform';
import { addSaved, removeSaved, setSavedIds } from '../../store/slices/savedSlice';
import toast from 'react-hot-toast';

// Query keys
export const savedKeys = {
  all: ['saved-properties'],
};

/**
 * Hook to fetch saved properties from API
 * Syncs with Redux on success
 */
export function useSavedProperties(options = {}) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: savedKeys.all,
    queryFn: async () => {
      const response = await getSavedProperties();
      
      // Extract properties from saved entries
      const savedEntries = response.data?.savedProperties || [];
      
      // FILTER OUT NULL PROPERTIES (deleted properties)
      const validEntries = savedEntries.filter(entry => {
        if (!entry.property || entry.property === null) {
          return false;
        }
        return true;
      });
      
      // Transform ONLY valid properties
      const properties = validEntries.map(entry => {
        const transformed = transformProperties([entry.property])[0];
        return {
          ...transformed,
          savedNote: entry.notes || '', // Personal notes
          savedAt: entry.savedAt || entry.createdAt,
        };
      });

      // Sync savedIds to Redux
      const savedIds = properties.map(p => p.id);
      dispatch(setSavedIds(savedIds));

      return properties;
    },

    staleTime: 1000 * 60 * 5,  // 5 min
    gcTime: 1000 * 60 * 30,    // 30 min cache
    refetchOnMount: 'always',  // Always refetch on mount (user might have saved/unsaved elsewhere)
    refetchOnWindowFocus: true, // Refetch on focus
    
    ...options,
  });
}

/**
 * Hook to save/unsave a property
 * Optimistic updates with Redux
 */
export function useSavePropertyMutation() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const saveMutation = useMutation({
    mutationFn: async ({ propertyId, notes = '' }) => {
      return await saveProperty(propertyId, notes);
    },

    onMutate: async ({ propertyId }) => {
      // Optimistic update - add to Redux immediately
      dispatch(addSaved(propertyId));

      // Show optimistic toast
      toast.success('Property saved!', {
        duration: 2000,
        position: 'top-center',
      });

      return { propertyId };
    },

    onSuccess: () => {
      // Invalidate saved properties to refetch
      queryClient.invalidateQueries({ queryKey: savedKeys.all });
    },

    onError: (error, variables) => {
      // Rollback optimistic update
      dispatch(removeSaved(variables.propertyId));

      toast.error(error.message || 'Failed to save property', {
        duration: 3000,
        position: 'top-center',
      });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async ({ propertyId }) => {
      return await unsaveProperty(propertyId);
    },

    onMutate: async ({ propertyId }) => {
      // Optimistic update - remove from Redux immediately
      dispatch(removeSaved(propertyId));

      // Show optimistic toast
      toast.success('Property removed', {
        duration: 2000,
        position: 'top-center',
      });

      return { propertyId };
    },

    onSuccess: () => {
      // Invalidate saved properties to refetch
      queryClient.invalidateQueries({ queryKey: savedKeys.all });
    },

    onError: (error, variables) => {
      // Rollback optimistic update
      dispatch(addSaved(variables.propertyId));

      toast.error(error.message || 'Failed to remove property', {
        duration: 3000,
        position: 'top-center',
      });
    },
  });

  return {
    saveProperty: saveMutation.mutate,
    unsaveProperty: unsaveMutation.mutate,
    isSaving: saveMutation.isPending,
    isUnsaving: unsaveMutation.isPending,
  };
}

export default useSavedProperties;
