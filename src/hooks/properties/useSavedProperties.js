// src/hooks/properties/useSavedProperties.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getSavedProperties, saveProperty, unsaveProperty } from '../../api/propertyApi';
import { transformProperties } from '../../utils/propertyTransform';
import { addSaved, removeSaved, setSavedIds } from '../../store/slices/savedSlice';
import toast from 'react-hot-toast';

// Query keys with filters
export const savedKeys = {
  all: ['saved-properties'],
  filtered: (filters) => [...savedKeys.all, 'filtered', filters],
};

/**
 * Hook to fetch saved properties from API with filters
 * Syncs with Redux on success
 */
export function useSavedProperties(filters = {}, options = {}) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: savedKeys.filtered(filters),
    queryFn: async () => {
      const response = await getSavedProperties();
      
      // Extract properties from saved entries
      const savedEntries = response.data?.savedProperties || [];
      
      // Transform properties
      let properties = savedEntries.map(entry => {
        const transformed = transformProperties([entry.property])[0];
        return {
          ...transformed,
          savedNote: entry.notes || '', // Personal notes
          savedAt: entry.savedAt || entry.createdAt,
        };
      });

      // Apply client-side filters (since backend doesn't support filters yet)
      if (filters.purpose) {
        properties = properties.filter(p => {
          if (filters.purpose === 'sale') {
            return p.tag === 'For Sale' || p.purpose === 'sale';
          }
          if (filters.purpose === 'rent') {
            return p.tag === 'For Rent' || p.purpose === 'rent';
          }
          return true;
        });
      }

      // Apply sort
      if (filters.sort) {
        properties = sortProperties(properties, filters.sort);
      }

      // Sync ALL savedIds to Redux (not filtered ones)
      const allSavedIds = savedEntries.map(e => e.property._id || e.property.id);
      dispatch(setSavedIds(allSavedIds));

      return properties;
    },

    staleTime: 1000 * 60 * 5,  // 5 min
    gcTime: 1000 * 60 * 30,    // 30 min cache
    refetchOnMount: 'always',  // Always refetch on mount
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
      // Invalidate ALL saved properties queries
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
      // Invalidate ALL saved properties queries
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

// Helper function for sorting
function sortProperties(properties, sortType) {
  const sorted = [...properties];

  switch (sortType) {
    case 'recent':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.savedAt || a.createdAt);
        const dateB = new Date(b.savedAt || b.createdAt);
        return dateB - dateA;
      });

    case 'price-low':
      return sorted.sort((a, b) => {
        const priceA = a.rawPrice || parseInt(a.price.replace(/[^0-9]/g, '') || 0);
        const priceB = b.rawPrice || parseInt(b.price.replace(/[^0-9]/g, '') || 0);
        return priceA - priceB;
      });

    case 'price-high':
      return sorted.sort((a, b) => {
        const priceA = a.rawPrice || parseInt(a.price.replace(/[^0-9]/g, '') || 0);
        const priceB = b.rawPrice || parseInt(b.price.replace(/[^0-9]/g, '') || 0);
        return priceB - priceA;
      });

    case 'name-az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sorted;
  }
}

export default useSavedProperties;
