import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePropertyDetail from "../hooks/properties/usePropertyDetail";
import usePropertyAgent from "../hooks/properties/usePropertyAgent";
import { useAuth } from "../hooks/utils/useRedux";
import Button from "../components/ui/Button";
import PropertyImageCarousel from "../components/property/PropertyImageCarousel";
import PropertyHeader from "../components/property/PropertyHeader";
import PropertyInfo from "../components/property/PropertyInfo";
import PropertyStats from "../components/property/PropertyStats";
import PropertyDescription from "../components/property/PropertyDescription";
import PropertyAmenities from "../components/property/PropertyAmenities";
import AgentCard from "../components/property/AgentCard";
import PropertyActions from "../components/property/PropertyActions";
import PropertyDetailSkeleton from "../components/property/PropertyDetailSkeleton";

// ─── Error State Component ────────────────────────────────────────────────────

const PropertyNotFound = ({ onRetry, onGoBack }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 pb-28">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-red-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>

    <h2 className="text-[20px] font-semibold text-primary font-myriad mb-2">
      Property Not Found
    </h2>

    <p className="text-[15px] text-gray-500 font-myriad text-center mb-6 max-w-sm">
      The property you're looking for doesn't exist or has been removed.
    </p>

    <div className="flex gap-3">
      <Button variant="secondary" onClick={onGoBack}>
        Go Back
      </Button>
      <Button variant="primary" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  </div>
);

// ─── PropertyDetailPage ───────────────────────────────────────────────────────

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State for enquiry trigger
  const [shouldOpenEnquiry, setShouldOpenEnquiry] = useState(false);
  
  // Fetch property details
  const { data: property, isLoading, isError, error, refetch } = usePropertyDetail(id);
  
  // Fetch agent details (only if authenticated)
  const { 
    data: agentDetails, 
    isLoading: isAgentLoading 
  } = usePropertyAgent(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // // Handle enquiry trigger from AgentCard
  // const handleEnquire = useCallback(() => {
  //   setShouldOpenEnquiry(true);
  //   setTimeout(() => {
  //     const actionsElement = document.querySelector('[data-property-actions]');
  //     if (actionsElement) {
  //       actionsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     }
  //   }, 100);
  // }, []);

  // Reset enquiry trigger after it's been handled
  useEffect(() => {
    if (shouldOpenEnquiry) {
      const timer = setTimeout(() => {
        setShouldOpenEnquiry(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldOpenEnquiry]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <PropertyDetailSkeleton />
      </div>
    );
  }

  // Error state
  if (isError || !property) {
    console.error('Property fetch error:', error);
    return (
      <PropertyNotFound
        onRetry={refetch}
        onGoBack={() => navigate(-1)}
      />
    );
  }

  // Determine which agent data to use
  // If authenticated:
  //   - If agentDetails exists (API returned agent) → use it
  //   - If agentDetails is null (no dedicated agent assigned) → pass null to show "No Agent" state
  //   - If not authenticated → use basic owner info from property
  const displayAgent = isAuthenticated 
    ? agentDetails  // Will be null if no agent assigned, or agent object if assigned
    : property.agent; // Fallback for non-authenticated users

  // Success state
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Image Carousel with Header Overlay */}
      <div className="relative min-h-60">
        <PropertyImageCarousel images={property.images} />
        <PropertyHeader propertyId={id} />
      </div>

      {/* Property Info */}
      <PropertyInfo property={property} />

      {/* Stats */}
      <PropertyStats
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        area={property.area}
        areaUnit={property.areaUnit}
      />

      {/* Description */}
      {property.description && (
        <PropertyDescription description={property.description} />
      )}

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <PropertyAmenities amenities={property.amenities} />
      )}

      {/* Agent Card - Always show (with "No Agent" state if needed) */}
      <AgentCard 
        agent={displayAgent} 
        property={property}
        isLoading={isAuthenticated && isAgentLoading}
        // onEnquire={handleEnquire}
      />

      {/* Action Buttons (Fixed at bottom) */}
      <PropertyActions 
        agent={displayAgent} 
        property={property}
        shouldOpenEnquiry={shouldOpenEnquiry}
      />
    </div>
  );
};

export default PropertyDetailPage;
