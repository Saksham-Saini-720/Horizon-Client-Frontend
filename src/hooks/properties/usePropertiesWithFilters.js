

import { useQuery } from "@tanstack/react-query";
import { getAllProperties, getFeaturedProperties } from "../../api/propertyApi";
import { transformPropertyResponse } from "../../utils/propertyTransform";

// Query keys with filters
export const propertyKeys = {
  all: ["properties"],
  filtered: (filters) => [...propertyKeys.all, "filtered", filters],
  featured: (filters) => [...propertyKeys.all, "featured", filters],
  new: (filters) => [...propertyKeys.all, "new", filters],
};

export function usePropertiesWithFilters(filters = {}, options = {}) {
  return useQuery({
    queryKey: propertyKeys.filtered(filters),
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await getAllProperties(params);
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },

    staleTime: 1000 * 60 * 5,  // 5 min
    gcTime: 1000 * 60 * 15,    // 15 min cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    
    ...options,
  });
}


export function useFeaturedPropertiesFiltered(filters = {}, options = {}) {
  return useQuery({
    queryKey: propertyKeys.featured(filters),
    queryFn: async () => {
      const params = {
        limit: 10,
        ...(filters.purpose && { purpose: filters.purpose }),
      };
      
      const response = await getFeaturedProperties(params);
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },

    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    
    ...options,
  });
}

/**
 * Hook for new listings with filters
 */
export function useNewListingsFiltered(filters = {}, options = {}) {
  return useQuery({
    queryKey: propertyKeys.new(filters),
    queryFn: async () => {
      const params = {
        sort: 'newest',
        limit: 10,
        ...buildQueryParams(filters),
      };
      
      const response = await getAllProperties(params);
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    
    ...options,
  });
}

/**
 * Build query parameters from filter object
 */
function buildQueryParams(filters) {
  const params = {};

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.purpose) {
    params.purpose = filters.purpose; // 'sale' or 'rent'
  }

  // Price range
  if (filters.minPrice) {
    params.minPrice = filters.minPrice;
  }
  if (filters.maxPrice) {
    params.maxPrice = filters.maxPrice;
  }

  // Bedrooms
  if (filters.bedrooms) {
    if (filters.bedrooms === '4+') {
      params.minBedrooms = 4;
    } else {
      params.minBedrooms = parseInt(filters.bedrooms);
      params.maxBedrooms = parseInt(filters.bedrooms);
    }
  }

  // Bathrooms
  if (filters.bathrooms) {
    if (filters.bathrooms === '4+') {
      params.minBathrooms = 4;
    } else {
      params.minBathrooms = parseInt(filters.bathrooms);
      params.maxBathrooms = parseInt(filters.bathrooms);
    }
  }

  // Property type
  if (filters.type) {
    params.type = filters.type; // apartment, house, villa, commercial, land
  }

  // Location
  if (filters.city) {
    params.city = filters.city;
  }
  if (filters.state) {
    params.state = filters.state;
  }

  // Amenities
  if (filters.amenities && filters.amenities.length > 0) {
    params.amenities = filters.amenities.join(',');
  }

  // Sort
  if (filters.sort) {
    params.sort = filters.sort; 
  }

  // Pagination
  params.page = filters.page || 1;
  params.limit = filters.limit || 20;

  return params;
}
