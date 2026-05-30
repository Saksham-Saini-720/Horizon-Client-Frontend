
import { useQuery } from '@tanstack/react-query';
import { getNearbyProperties, getAllProperties } from '../../api/propertyApi';
import { transformPropertyResponse } from '../../utils/propertyTransform';

const LUSAKA_CENTER = { lat: -15.4167, lng: 28.2833 };

// Haversine distance in metres between two lat/lng points
const haversineMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

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
      // Step 1: Try nearby endpoint with the selected radius
      if (longitude && latitude) {
        const nearbyResp = await getNearbyProperties(longitude, latitude, maxDistance, 30);
        const { properties: nearby } = transformPropertyResponse(nearbyResp);
        if (nearby.length > 0) {
          return nearby;
        }
      }

      // Step 2: getAllProperties — filter by city name, then by selected radius
      const allResp = await getAllProperties({ limit: 100 });
      const { properties: all } = transformPropertyResponse(allResp);

      let filtered = all;
      if (cityName) {
        const city = cityName.toLowerCase();
        filtered = all.filter(p => {
          const loc = (p.location ?? '').toLowerCase();
          return loc.includes(city);
        });

        if (filtered.length === 0) {
          return [];
        }
      }

      // Assign approximate coordinates so we can distance-filter them
      const withCoords = assignApproxCoords(filtered, latitude, longitude);

      // Only return properties whose approximate position falls within the selected radius
      if (latitude && longitude) {
        return withCoords.filter(p =>
          haversineMeters(latitude, longitude, p.latitude, p.longitude) <= maxDistance
        );
      }

      return withCoords;
    },
    enabled: true,
    staleTime:            0,
    gcTime:               1000 * 60 * 10,
    refetchOnMount:       false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useMapProperties;
