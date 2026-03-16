
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapProperties } from '../hooks/properties/useMapProperties';
import { useGeolocation } from '../hooks/useGeolocation';
import PropertyMarker from '../components/map/PropertyMarker';
import LocationMarker from '../components/map/LocationMarker';
import PropertyBottomSheet from '../components/map/PropertyBottomSheet';
import toast from 'react-hot-toast';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LUSAKA = { latitude: -15.4167, longitude: 28.2833, name: 'Lusaka' };

const isInZambia = (loc) => {
  if (!loc) return false;
  const lat = loc.latitude ?? loc.lat;
  const lng = loc.longitude ?? loc.lng;
  return lat >= -18 && lat <= -8 && lng >= 22 && lng <= 34;
};

const MapFlyTo = ({ center, zoom = 13 }) => {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (!center?.[0] || !center?.[1]) return;
    const same = prev.current?.[0] === center[0] && prev.current?.[1] === center[1];
    if (!same) { map.flyTo(center, zoom, { duration: 1.2 }); prev.current = center; }
  }, [center, zoom, map]);
  return null;
};

const MapPage = () => {
  const navigate       = useNavigate();
  const routeLocation  = useLocation();
  const passedLocation = routeLocation.state?.location;

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchRadius,     setSearchRadius]     = useState(5000);
  const [useGPS,           setUseGPS]           = useState(!passedLocation);
  const fallbackShown = useRef(false);

  const { location: gpsLocation, error: locationError, loading: locationLoading, requestLocation } =
    useGeolocation();

  const effectiveGps   = useGPS
    ? (isInZambia(gpsLocation) ? gpsLocation : (gpsLocation ? LUSAKA : null))
    : null;
  const activeLocation = useGPS ? effectiveGps : passedLocation;
  const usingFallback  = useGPS && !!gpsLocation && !isInZambia(gpsLocation);

  const activeLat = activeLocation?.latitude  ?? activeLocation?.lat;
  const activeLng = activeLocation?.longitude ?? activeLocation?.lng;

  // useMapProperties: tries nearby → 50km → getAllProperties fallback
  const cityName = passedLocation?.name ?? null;
  const { data: properties = [], isLoading: propertiesLoading, isError: propertiesError } =
    useMapProperties(activeLng, activeLat, searchRadius, cityName); // ⭐ city filter

  useEffect(() => {
    if (useGPS && locationError)
      toast.error(locationError, { duration: 5000, position: 'top-center' });
  }, [locationError, useGPS]);

  useEffect(() => {
    if (usingFallback && !fallbackShown.current) {
      fallbackShown.current = true;
      toast('Showing Lusaka properties', { icon: '📍', duration: 3000 });
    }
  }, [usingFallback]);

  const handleMarkerClick  = useCallback((p) => setSelectedProperty(p), []);

  const handleRadiusChange = useCallback((r) => {
    setSearchRadius(r);
    setSelectedProperty(null);
    toast.success(`Searching within ${r / 1000}km`, { duration: 1500, icon: '🔍' });
  }, []);

  const handleToggleLocation = useCallback(() => {
    if (!passedLocation) return;
    setSelectedProperty(null);
    setUseGPS((prev) => {
      const next = !prev;
      setTimeout(() => toast.success(
        next ? 'Using GPS location' : `Switched to ${passedLocation.name}`,
        { duration: 2000, icon: '📍' }
      ), 0);
      return next;
    });
  }, [passedLocation]);

  const mapCenter    = activeLat && activeLng
    ? [activeLat, activeLng]
    : [LUSAKA.latitude, LUSAKA.longitude];

  const locationName = usingFallback
    ? 'Lusaka'
    : useGPS
    ? 'Your Location'
    : (passedLocation?.name ?? 'Selected Location');

  if (useGPS && locationLoading && !gpsLocation) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin mb-4" />
        <p className="text-[16px] font-semibold text-gray-700 font-inter">Getting your location…</p>
        <p className="text-[15px] text-gray-400 mt-1 font-inter">Please allow location access</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div className="flex-1 mx-4 text-center">
            <h1 className="text-[16px] font-semibold text-primary font-inter">Nearby Properties</h1>
            <p className="text-[11px] text-gray-500 font-inter">
              {locationName} • {searchRadius / 1000}km radius
            </p>
          </div>
          <button onClick={() => navigate('/search')} className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer center={mapCenter} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <MapFlyTo center={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {activeLocation && <LocationMarker location={activeLocation} radius={searchRadius} />}
        {!propertiesLoading && !propertiesError && properties.map((p) => (
          <PropertyMarker
            key={p.id}
            property={p}
            isSelected={selectedProperty?.id === p.id}
            onClick={() => handleMarkerClick(p)}
          />
        ))}
      </MapContainer>

      {/* Floating Controls */}
      <div className="absolute right-4 top-24 z-[999] flex flex-col gap-3">
        {passedLocation && (
          <button
            onClick={handleToggleLocation}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 ${useGPS ? 'bg-white text-gray-700' : 'bg-blue-600 text-white'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <p className="text-[9px] font-semibold text-gray-400 tracking-widest text-center mb-1.5 px-1">RADIUS</p>
          {[2000, 5000, 10000].map((r) => (
            <button key={r} onClick={() => handleRadiusChange(r)}
              className={`w-full px-3 py-2 rounded-xl text-[12px] font-semibold font-inter transition-colors mb-1 last:mb-0 ${
                searchRadius === r ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {r / 1000}km
            </button>
          ))}
        </div>
      </div>

      {/* Count / loading chip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[999]">
        {propertiesLoading ? (
          <div className="bg-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            <span className="text-[15px] font-semibold text-gray-600 font-inter">
              Finding nearby properties…
            </span>
          </div>
        ) : !selectedProperty ? (
          <div className="bg-primary text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-[15px] font-semibold font-inter">
              {propertiesError
                ? 'Failed to load properties'
                : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} nearby`}
            </span>
          </div>
        ) : null}
      </div>

      {/* Bottom Sheet */}
      {selectedProperty && (
        <PropertyBottomSheet
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onViewDetails={() => navigate(`/property/${selectedProperty.id}`)}
        />
      )}
    </div>
  );
};

export default MapPage;
