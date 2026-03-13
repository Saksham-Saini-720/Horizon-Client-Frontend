
import { useQuery } from "@tanstack/react-query";
import { getAllProperties, getFeaturedProperties, getNewListings } from "../../api/propertyApi";
import { transformPropertyResponse } from "../../utils/propertyTransform";

// Query keys with filters
export const propertyKeys = {
  all: ["properties"],
  filtered: (filters) => [...propertyKeys.all, "filtered", filters],
  featured: (filters) => [...propertyKeys.all, "featured", filters],
  new: (filters) => [...propertyKeys.all, "new", filters],
};

/**
 * Hook for browsing properties with filters
 * Supports: purpose (buy/rent), price, bedrooms, location, etc.
 */
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

/**
 * Hook for featured properties with optional purpose filter
 */
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
      // console.log("API Response for New Listings with Filters:", response);
      const transformed = transformPropertyResponse(response);
      // console.log("Transformed Properties:", transformed);
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

  // Purpose (buy/rent)
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
    params.sort = filters.sort; // price_asc, price_desc, newest, oldest
  }

  // Pagination
  params.page = filters.page || 1;
  params.limit = filters.limit || 20;

  return params;
}
