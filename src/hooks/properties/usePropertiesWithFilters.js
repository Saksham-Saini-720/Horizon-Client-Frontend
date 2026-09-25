
import { useQuery } from "@tanstack/react-query";
import { getAllProperties, getFeaturedProperties } from "../../api/propertyApi";
import { transformPropertyResponse } from "../../utils/propertyTransform";

// Store vocabulary -> API vocabulary. The API's accepted values are
// createdAt/-createdAt (real post date), price/-price, views/-views, and
// squareFeet/-squareFeet; anything else falls back to newest-first.
const SORT_PARAM = {
  newest: '-createdAt',
  oldest: 'createdAt',
  'price-low': 'price',
  'price-high': '-price',
  popular: '-views',
};

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
      
      return {
        properties: transformed.properties,
        pagination: transformed.pagination,
      };
    },

    staleTime: 1000 * 30,      // 30s → reflect admin changes (e.g. unpublish) promptly
    gcTime: 1000 * 60 * 15,    // 15 min cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,

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

    staleTime: 1000 * 30,          // 30s → near-instant freshness for featured changes
    gcTime: 1000 * 60 * 30,
    refetchOnMount: true,          // refetch when ExplorePage mounts
    refetchOnWindowFocus: true,    // refetch when user returns to the tab

    ...options,
  });
}

export function useNewListingsFiltered(filters = {}, options = {}) {
  return useQuery({
    queryKey: propertyKeys.new(filters),
    queryFn: async () => {
      const params = {
        sort: 'newest',
        limit: filters.limit || 10,
        ...buildQueryParams(filters),
      };
      
      const response = await getAllProperties(params);
      const transformed = transformPropertyResponse(response);
      
      return {
        properties: transformed.properties,
        pagination: transformed.pagination,
      };
    },

    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: true,

    ...options,
  });
}

function buildQueryParams(filters) {
  const params = {};

  if (filters.search) {
    params.search = filters.search;
  }

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

  // Bedrooms / bathrooms.
  //
  // A trailing "+" means "this many or more" and sends only a lower bound;
  // anything else is an exact count and pins both bounds.
  //
  // This used to test for the literal string '4+'. The standalone bedrooms modal
  // does offer exactly that, so it worked there — but the full-filters modal
  // offers '5+' for bedrooms, which fell through to the exact-match branch and
  // became "exactly 5", hiding every 6-bedroom listing behind a pill labelled
  // "5+". Reading the suffix instead of naming one value keeps the two modals
  // from having to agree on which option happens to be the open-ended one.
  const roomBounds = (value) => {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return null;
    return String(value).trim().endsWith('+') ? { min: n } : { min: n, max: n };
  };

  const beds = filters.bedrooms ? roomBounds(filters.bedrooms) : null;
  if (beds) {
    params.minBedrooms = beds.min;
    if (beds.max !== undefined) params.maxBedrooms = beds.max;
  }

  const baths = filters.bathrooms ? roomBounds(filters.bathrooms) : null;
  if (baths) {
    params.minBathrooms = baths.min;
    if (baths.max !== undefined) params.maxBathrooms = baths.max;
  }

  // Size range. The unit is only worth sending with a bound beside it, and it
  // must always accompany one — the API defaults an omitted unit to square
  // metres, which would silently reinterpret an acre figure.
  const hasMinArea = filters.minArea !== '' && filters.minArea != null;
  const hasMaxArea = filters.maxArea !== '' && filters.maxArea != null;
  if (hasMinArea || hasMaxArea) {
    if (hasMinArea) params.minArea = Number(filters.minArea);
    if (hasMaxArea) params.maxArea = Number(filters.maxArea);
    params.areaUnit = filters.areaUnit || 'sqm';
  }

  // Posted-date window. Sent as a day count so the server anchors it to its own
  // clock — a client-computed timestamp drifts with device time and, worse, made
  // every request a unique cache key.
  if (filters.postedWithinDays) {
    params.postedWithinDays = Number(filters.postedWithinDays);
  }

  // Property type
  if (filters.type) {
    params.type = filters.type;
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

  // Sort.
  //
  // The store speaks 'newest' | 'price-low' | 'price-high' | 'popular'; the API
  // speaks '-createdAt' | 'price' | '-price' | '-views'. These were passed
  // straight through, so the API received 'newest', failed to match it, and fell
  // back to its default — which is newest-first, so the bug was invisible. It
  // would have surfaced the moment a sort control was wired up: picking
  // "price: low to high" would have returned newest-first instead.
  //
  // Note '-createdAt' orders by the real post date, not the import date; the
  // parameter keeps its historical name.
  if (filters.sort) {
    params.sort = SORT_PARAM[filters.sort] ?? filters.sort;
  }

  params.page = filters.page || 1;
  params.limit = filters.limit || 10;

  return params;
}

