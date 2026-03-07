// src/pages/MapPage.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAllProperties } from "../hooks/properties/useProperties";
import PropertyMarker from "../components/map/PropertyMarker";
import PropertyBottomSheet from "../components/map/PropertyBottomSheet";
import MapSkeleton from "../components/map/MapSkeleton";

/**
 * MapPage Component
 * Interactive map view with property markers
 * Fixed: Proper height, menu navigates to search
 */
const MapPage = () => {
  const navigate = useNavigate();
  const { data: properties, isLoading } = useAllProperties();
  const [selectedProperty, setSelectedProperty] = useState(null);

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

  if (isLoading) {
    return <MapSkeleton />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
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

        {/* Menu Button - Navigate to Search */}
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
            strokeLinecap="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Map Container - Reduced height for footer visibility */}
      <div className="absolute top-16 left-0 right-0 bottom-20">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-200">
          {/* Property Markers */}
          <div className="absolute inset-0">
            {properties?.map((property) => (
              <PropertyMarker
                key={property.id}
                property={property}
                isSelected={selectedProperty?.id === property.id}
                onClick={() => handleMarkerClick(property)}
              />
            ))}
          </div>

          {/* Info Footer (when no property selected) */}
          {!selectedProperty && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
              <p className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] text-center">
                {properties?.length || 0} properties in this area
              </p>
              <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif] text-center mt-1">
                Tap a pin to see details
              </p>
            </div>
          )}
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
