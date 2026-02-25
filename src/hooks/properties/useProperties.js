
import { useQuery } from "@tanstack/react-query";
// import { getFeaturedProperties, getNewListings } from "../../api/propertyApi";

// ─── Query Keys (for cache management) ────────────────────────────────────────

export const propertyKeys = {
  all:      ["properties"],
  featured: () => [...propertyKeys.all, "featured"],
  new:      () => [...propertyKeys.all, "new"],
  search:   (query) => [...propertyKeys.all, "search", query],
};

// ─── Mock API (replace with real API calls) ──────────────────────────────────

const mockFeaturedApi = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return [
    { id: 1, price: "$850,000",  title: "Modern Executive Villa in...",   location: "Kabulonga, Lusaka", beds: 3, baths: 2, area: "200 sqm", tag: "For Sale" ,   img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" },
    { id: 2, price: "$4,500/mo", title: "Luxury Penthouse at Roma Park",  location: "Roma Park, Lusaka",  beds: 3, baths: 2, area: "200 sqm", tag: "For Sale",   img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" },
    { id: 3, price: "$275,000",  title: "Elegant Townhouse in Woodlands", location: "Woodlands, Lusaka",   beds: 3, baths: 2, area: "200 sqm", tag: "For Sale",  img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80" },
    { id: 4, price: "$450,000",  title: "Beachfront Villa in Siavonga",  beds: 3, baths: 2, area: "200 sqm", tag: "For Sale", location: "Lake Kariba, Siavonga", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80" },
  ];
};

const mockNewListingsApi = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return [
    { id: 5, price: "$275,000",  title: "Elegant Townhouse in Woodlands", location: "Woodlands, Lusaka", beds: 3, baths: 2, area: "200 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80" },
    { id: 6, price: "$1,800/mo", title: "Modern 2-Bed Apartment",         location: "Woodlands, Lusaka", beds: 2, baths: 2, area: "110 sqm", tag: "For Rent", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
    { id: 7, price: "$320,000",  title: "Spacious Family Home",           location: "Chilenje, Lusaka",  beds: 4, baths: 3, area: "280 sqm", tag: "For Sale", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
  ];
};

// ─── Featured Properties Query ────────────────────────────────────────────────

export function useFeaturedProperties() {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: mockFeaturedApi,
    // Real API:
    // queryFn: () => getFeaturedProperties(),

    staleTime: 1000 * 60 * 15,    // 15 min - featured rarely change
    gcTime: 1000 * 60 * 30,       // 30 min cache
    refetchOnMount: false,        // Don't refetch if data exists
    refetchOnWindowFocus: false,  // Don't refetch on focus
  });
}

// ─── New Listings Query ───────────────────────────────────────────────────────

export function useNewListings() {
  return useQuery({
    queryKey: propertyKeys.new(),
    queryFn: mockNewListingsApi,
    // Real API:
    // queryFn: () => getNewListings(),

    staleTime: 1000 * 60 * 10,    // 10 min
    gcTime: 1000 * 60 * 30,       // 30 min cache
    refetchOnMount: false,        // Don't refetch if data exists
    refetchOnWindowFocus: false,  // Don't refetch on focus
  });
}

// ─── Search Properties Query (for SearchPage) ────────────────────────────────

export function useSearchProperties(query, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.search(query),
    queryFn: async () => {
      // Real API:
      // return await searchProperties({ query });

      // Mock for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allProps = [...await mockFeaturedApi(), ...await mockNewListingsApi()];
      return allProps.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
      );
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

      // Real API:
      // return await getPropertiesByIds(savedIds);

      // Mock: combine all data and filter by saved IDs
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allProps = [...await mockFeaturedApi(), ...await mockNewListingsApi()];
      return allProps.filter((p) => savedIds.includes(p.id));
    },

    enabled: savedIds.length > 0,  // Only run if there are saved IDs
    staleTime: 1000 * 60 * 30,     // 30 min - won't refetch on revisit
    gcTime: 1000 * 60 * 60,        // 1 hour cache
    refetchOnMount: false,         // Don't refetch on mount if data exists
    refetchOnWindowFocus: false,   // Don't refetch on window focus
  });
}
