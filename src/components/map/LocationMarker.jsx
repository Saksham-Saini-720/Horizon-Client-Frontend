// src/components/map/LocationMarker.jsx
import { memo } from 'react';

/**
 * LocationMarker Component
 * Shows user's current location on the map
 */
const LocationMarker = memo(({ position }) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Outer Pulse Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-blue-500 opacity-20 animate-ping" />
      </div>

      {/* Middle Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full bg-blue-400 opacity-30" />
      </div>

      {/* Center Dot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
      </div>
    </div>
  );
});

LocationMarker.displayName = 'LocationMarker';

export default LocationMarker;
