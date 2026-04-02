
import { useQuery } from '@tanstack/react-query';
import { getMostViewedProperties } from '../../api/propertyApi';
import { transformPropertyResponse } from '../../utils/propertyTransform';


export const useMostViewedProperties = (limit = 10, options = {}) => {
  return useQuery({
    queryKey: ['properties', 'most-viewed', limit],
    queryFn: async () => {
      const response = await getMostViewedProperties(limit);
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },
    staleTime: 1000 * 60 * 5,        // 5 minutes - data stays fresh
    gcTime: 1000 * 60 * 30,          // 30 minutes - cache time
    refetchOnMount: false,            // Don't refetch on component mount
    refetchOnWindowFocus: false,      // Don't refetch on window focus
    retry: 2,                         // Retry failed requests twice
    ...options,
  });
};

export default useMostViewedProperties;
