
import { useQuery } from '@tanstack/react-query';
import { getNearbyProperties, getAllProperties } from '../../api/propertyApi';
import { transformPropertyResponse } from '../../utils/propertyTransform';

const LUSAKA_CENTER = { lat: -15.4167, lng: 28.2833 };

// Scatter markers around city center if no real coordinates
const assignApproxCoords = (properties, cityLat, cityLng) => {
  return properties.map((p, i) => {
    if (p.latitude && p.longitude) return p;
    const seed  = (p.id?.charCodeAt?.(0) ?? i) + i;
    const angle = (seed * 137.5 * Math.PI) / 180;
    const r     = 0.008 + (seed % 10) * 0.002;
    return {
      ...p,
      latitude:  (cityLat ?? LUSAKA_CENTER.lat) + r * Math.sin(angle),
      longitude: (cityLng ?? LUSAKA_CENTER.lng) + r * Math.cos(angle),
    };
  });
};

export const useMapProperties = (longitude, latitude, maxDistance = 5000, cityName = null) => {
  return useQuery({
    queryKey: ['mapProperties', longitude, latitude, maxDistance, cityName],
    queryFn: async () => {
      // Step 1: Try nearby endpoint
      if (longitude && latitude) {
        const nearbyResp = await getNearbyProperties(longitude, latitude, maxDistance, 30);
        const { properties: nearby } = transformPropertyResponse(nearbyResp);
        if (nearby.length > 0) {
          return nearby;
        }

        // Step 2: Try 50km radius
        const wideResp = await getNearbyProperties(longitude, latitude, 50000, 30);
        const { properties: wide } = transformPropertyResponse(wideResp);
        if (wide.length > 0) {
          return wide;
        }
      }

      // Step 3: getAllProperties — filter by city name
      const allResp = await getAllProperties({ limit: 100 });
      const { properties: all } = transformPropertyResponse(allResp);

      // KEY FIX: Only show properties matching selected city
      let filtered = all;
      if (cityName) {
        const city = cityName.toLowerCase();
        filtered = all.filter(p => {
          const loc = (p.location ?? '').toLowerCase();
          return loc.includes(city);
        });

        // If no match at all, return empty — don't show wrong city's properties
        if (filtered.length === 0) {
          return [];
        }
      }

      return assignApproxCoords(filtered, latitude, longitude);
    },
    enabled: true,
    staleTime:            1000 * 60 * 5,
    gcTime:               1000 * 60 * 10,
    refetchOnMount:       false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useMapProperties;
