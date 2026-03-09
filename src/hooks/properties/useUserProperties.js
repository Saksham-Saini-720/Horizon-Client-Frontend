// src/hooks/properties/useUserProperties.js
import { useQuery } from '@tanstack/react-query';
import { getUserProperties } from '../../api/propertyApi';
import { transformPropertyResponse } from '../../utils/propertyTransform';

/**
 * useUserProperties Hook
 * Get properties listed by the current user (agent or client)
 * 
 * Usage:
 * const { data: properties, isLoading, error } = useUserProperties({ status: 'active' });
 */
export const useUserProperties = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['userProperties', filters],
    queryFn: async () => {
      console.log('🔵 [useUserProperties] Fetching user properties...');
      
      const response = await getUserProperties(filters);
      
      // Transform response
      const transformed = transformPropertyResponse(response);
      
      console.log('✅ [useUserProperties] Fetched:', transformed.properties.length, 'properties');
      
      return transformed;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export default useUserProperties;
