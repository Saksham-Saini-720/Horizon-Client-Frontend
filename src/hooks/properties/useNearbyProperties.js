
import { useQuery } from '@tanstack/react-query';
import { getNearbyProperties } from '../../api/propertyApi';
import { transformPropertyResponse } from '../../utils/propertyTransform';

/**
 * useNearbyProperties Hook
 * Fetches properties near a specific location
 * 
 * @param {number} longitude - User's longitude
 * @param {number} latitude - User's latitude
 * @param {number} maxDistance - Maximum distance in meters (default: 5000m = 5km)
 * @param {number} limit - Maximum number of properties (default: 20)
 * @param {object} options - Additional query options
 */
export const useNearbyProperties = (
  longitude,
  latitude,
  maxDistance = 5000,
  limit = 20,
  options = {}
) => {
  return useQuery({
    queryKey: ['properties', 'nearby', longitude, latitude, maxDistance, limit],
    queryFn: async () => {
      
      const response = await getNearbyProperties(longitude, latitude, maxDistance, limit);
      const transformed = transformPropertyResponse(response);
      
      return transformed.properties;
    },
    
    // Only fetch if we have valid coordinates
    enabled: !!(longitude && latitude),
    
    staleTime: 1000 * 60 * 5,      // 5 minutes
    gcTime: 1000 * 60 * 10,        // 10 minutes cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    
    ...options,
  });
};

export default useNearbyProperties;
