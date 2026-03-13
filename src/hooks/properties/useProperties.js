
import { useQuery } from "@tanstack/react-query";
import { 
  getAllProperties, 
  getFeaturedProperties, 
  getNewListings, 
  searchProperties 
} from "../../api/propertyApi";
import { transformProperties, transformPropertyResponse } from "../../utils/propertyTransform";

// ─── Query Keys (for cache management) ────────────────────────────────────────

export const propertyKeys = {
  all:      ["properties"],
  allList:  () => [...propertyKeys.all, "list"],
  featured: () => [...propertyKeys.all, "featured"],
  new:      () => [...propertyKeys.all, "new"],
  search:   (query) => [...propertyKeys.all, "search", query],
};

// ─── All Properties Query (for Map Page) ─────────────────────────────────────

export function useAllProperties(options = {}) {
  return useQuery({
    queryKey: propertyKeys.allList(),
    queryFn: async () => {
      const response = await getAllProperties();
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },

    staleTime: 1000 * 60 * 10,    // 10 min
    gcTime: 1000 * 60 * 30,       // 30 min cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    
    ...options,
  });
}

// ─── Featured Properties Query ────────────────────────────────────────────────

export function useFeaturedProperties(options = {}) {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: async () => {
      const response = await getFeaturedProperties();
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },

    staleTime: 1000 * 60 * 15,    // 15 min - featured rarely change
    gcTime: 1000 * 60 * 30,       // 30 min cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    
    ...options,
  });
}

// ─── New Listings Query ───────────────────────────────────────────────────────

export function useNewListings(options = {}) {
  return useQuery({
    queryKey: propertyKeys.new(),
    queryFn: async () => {
      const response = await getNewListings();
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },

    staleTime: 1000 * 60 * 10,    // 10 min
    gcTime: 1000 * 60 * 30,       // 30 min cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    
    ...options,
  });
}

// ─── Search Properties Query (for SearchPage) ────────────────────────────────

export function useSearchProperties(query, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.search(query),
    queryFn: async () => {
      const response = await searchProperties(query);
      const transformed = transformPropertyResponse(response);
      return transformed.properties;
    },

    enabled: enabled && !!query,  // Only run if query exists
    staleTime: 1000 * 60 * 2,     // Search results stale faster
  });
}

// ─── Saved Properties Query (by IDs) ─────────────────────────────────────────

export function useSavedPropertiesData(savedIds) {
  return useQuery({
    queryKey: [...propertyKeys.all, "saved", savedIds],
    queryFn: async () => {
      if (!savedIds.length) return [];

      // Get all properties and filter by saved IDs
      const response = await getAllProperties();
      const transformed = transformPropertyResponse(response);
      return transformed.properties.filter((p) => savedIds.includes(p.id));
    },

    enabled: savedIds.length > 0,
    staleTime: 1000 * 60 * 30,     // 30 min
    gcTime: 1000 * 60 * 60,        // 1 hour cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
