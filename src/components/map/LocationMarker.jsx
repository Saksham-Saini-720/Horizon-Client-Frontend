
import { Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

/**
 * LocationMarker Component
 * Leaflet marker — same pulsing blue dot visual as before
 * Shows user's current location + search radius circle
 */
const LocationMarker = ({ location, radius }) => {
  // Support both { lat, lng } and { latitude, longitude }
  const lat = location?.latitude  ?? location?.lat;
  const lng = location?.longitude ?? location?.lng;

  if (!lat || !lng) return null;

  // Pulsing blue dot icon — same visual as the old CSS version
  const icon = L.divIcon({
    className: '',
    iconSize:   [48, 48],
    iconAnchor: [24, 24],
    html: `
      <div style="
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Outer pulse (largest, most transparent) -->
        <div style="
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(59,130,246,0.15);
          animation: pulse-outer 2s ease-in-out infinite;
        "></div>
        <!-- Middle circle -->
        <div style="
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(96,165,250,0.3);
          animation: pulse-mid 2s ease-in-out infinite 0.3s;
        "></div>
        <!-- Center dot -->
        <div style="
          position: relative;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563EB;
          border: 2.5px solid white;
          box-shadow: 0 2px 8px rgba(37,99,235,0.5);
          z-index: 1;
        "></div>
      </div>
      <style>
        @keyframes pulse-outer {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.4); opacity: 0.1; }
        }
        @keyframes pulse-mid {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%       { transform: scale(1.2); opacity: 0.2; }
        }
      </style>
    `,
  });

  return (
    <>
      {/* Dashed radius circle — shows search area */}
      {radius && (
        <Circle
          center={[lat, lng]}
          radius={radius}
          pathOptions={{
            color:       '#3B82F6',
            fillColor:   '#3B82F6',
            fillOpacity: 0.05,
            weight:      1.5,
            dashArray:   '6 5',
          }}
        />
      )}

      {/* Pulsing dot */}
      <Marker
        position={[lat, lng]}
        icon={icon}
        zIndexOffset={2000}
      />
    </>
  );
};

export default LocationMarker;
