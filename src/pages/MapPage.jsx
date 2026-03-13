// src/pages/MapPage.jsx - WITH NEARBY PROPERTIES
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNearbyProperties } from "../hooks/properties/useNearbyProperties";
import { useGeolocation } from "../hooks/useGeolocation";
import PropertyMarker from "../components/map/PropertyMarker";
import LocationMarker from "../components/map/LocationMarker";
import PropertyBottomSheet from "../components/map/PropertyBottomSheet";
import MapSkeleton from "../components/map/MapSkeleton";
import toast from 'react-hot-toast';

/**
 * MapPage Component
 * Interactive map with nearby properties based on user's location
 * Real-time location tracking
 */
const MapPage = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  
  // Get user's location
  const { location, error: locationError, loading: locationLoading, requestLocation } = useGeolocation();

  // Fetch nearby properties based on location
  const { 
    data: properties = [], 
    isLoading: propertiesLoading,
    isError: propertiesError,
    error: propertiesErrorMsg,
    refetch: refetchProperties 
  } = useNearbyProperties(
    location?.longitude,
    location?.latitude,
    searchRadius,
    20
  );

  // Show error toast if location fails
  useEffect(() => {
    if (locationError) {
      toast.error(locationError, {
        duration: 5000,
        position: 'top-center',
      });
    }
  }, [locationError]);

  // Handle marker click
  const handleMarkerClick = useCallback((property) => {
    setSelectedProperty(property);
  }, []);

  // Handle close bottom sheet
  const handleCloseBottomSheet = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Handle view details
  const handleViewDetails = useCallback((propertyId) => {
    navigate(`/property/${propertyId}`);
  }, [navigate]);

  // Handle re-center to user's location
  const handleRecenter = useCallback(() => {
    requestLocation();
    toast.success('Map centered to your location', {
      duration: 2000,
      icon: '📍',
    });
  }, [requestLocation]);

  // Handle radius change
  const handleRadiusChange = useCallback((newRadius) => {
    setSearchRadius(newRadius);
    toast.success(`Searching within ${newRadius / 1000}km`, {
      duration: 2000,
      icon: '🔍',
    });
  }, []);

  // Loading state - show skeleton while getting location
  if (locationLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-4" />
        <p className="text-[16px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
          Getting your location...
        </p>
        <p className="text-[13px] text-gray-500 font-['DM_Sans',sans-serif]">
          Please allow location access
        </p>
      </div>
    );
  }

  // Error state - show error message if location fails
  if (locationError && !location) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
            <line x1="12" y1="7" x2="12" y2="11" />
          </svg>
        </div>
        <h2 className="text-[20px] font-bold text-gray-700 font-['DM_Sans',sans-serif] mb-2 text-center">
          Location Access Required
        </h2>
        <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] mb-6 text-center max-w-md">
          {locationError}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={requestLocation}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-[14px] font-semibold font-['DM_Sans',sans-serif] hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // User's location for marker (center of map for demo)
  const userLocationPosition = {
    top: '50%',
    left: '50%',
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Title */}
          <div className="flex-1 mx-4">
            <h1 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] text-center">
              Nearby Properties
            </h1>
            {location && (
              <p className="text-[11px] text-gray-500 font-['DM_Sans',sans-serif] text-center">
                Within {searchRadius / 1000}km of your location
              </p>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors"
            aria-label="Go to search"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute top-16 left-0 right-0 bottom-20">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-200">
          
          {/* User's Location Marker */}
          {location && <LocationMarker position={userLocationPosition} />}

          {/* Property Markers */}
          {propertiesLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-3" />
                <p className="text-[14px] font-semibold text-gray-600 font-['DM_Sans',sans-serif]">
                  Finding nearby properties...
                </p>
              </div>
            </div>
          ) : propertiesError ? (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className="text-[14px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
                  Failed to load properties
                </p>
                <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] mb-4">
                  {propertiesErrorMsg?.message || 'Please try again'}
                </p>
                <button
                  onClick={() => refetchProperties()}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0">
              {properties.map((property) => (
                <PropertyMarker
                  key={property.id}
                  property={property}
                  isSelected={selectedProperty?.id === property.id}
                  onClick={() => handleMarkerClick(property)}
                />
              ))}
            </div>
          )}

          {/* Info Footer (when no property selected) */}
          {!selectedProperty && !propertiesLoading && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
              <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] text-center">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} nearby
              </p>
              <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif] text-center mt-1">
                Tap a pin to see details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Controls - Right Side */}
      <div className="absolute right-4 top-24 z-30 flex flex-col gap-3">
        {/* Re-center Button */}
        <button
          onClick={handleRecenter}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all active:scale-95"
          aria-label="Re-center map"
        >
          <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        {/* Radius Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <p className="text-[10px] font-semibold text-gray-500 font-['DM_Sans',sans-serif] text-center mb-2 px-2">
            RADIUS
          </p>
          {[2000, 5000, 10000].map((radius) => (
            <button
              key={radius}
              onClick={() => handleRadiusChange(radius)}
              className={`w-full px-3 py-2 rounded-lg text-[12px] font-semibold font-['DM_Sans',sans-serif] transition-colors mb-1 last:mb-0 ${
                searchRadius === radius
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {radius / 1000}km
            </button>
          ))}
        </div>
      </div>

      {/* Property Bottom Sheet */}
      {selectedProperty && (
        <PropertyBottomSheet
          property={selectedProperty}
          onClose={handleCloseBottomSheet}
          onViewDetails={() => handleViewDetails(selectedProperty.id)}
        />
      )}
    </div>
  );
};

export default MapPage;
