// src/components/map/MapSkeleton.jsx
import { memo } from "react";

/**
 * MapSkeleton Component
 * Loading state for map page
 */
const MapSkeleton = memo(() => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">
      {/* Header Skeleton */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      </div>

      {/* Map Skeleton */}
      <div className="w-full h-full relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />

        {/* Marker Skeletons */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-20 h-8 rounded-full bg-gray-300 animate-pulse"
            style={{
              top: `${(i * 17) % 60 + 15}%`,
              left: `${(i * 23) % 70 + 15}%`,
            }}
          />
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
      </div>
    </div>
  );
});

MapSkeleton.displayName = 'MapSkeleton';

export default MapSkeleton;
