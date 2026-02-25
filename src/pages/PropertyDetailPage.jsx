
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import usePropertyDetail from "../hooks/properties/usePropertyDetail";
import PropertyImageCarousel from "../components/property/PropertyImageCarousel";
import PropertyHeader from "../components/property/PropertyHeader";
import PropertyInfo from "../components/property/PropertyInfo";
import PropertyStats from "../components/property/PropertyStats";
import PropertyDescription from "../components/property/PropertyDescription";
import PropertyAmenities from "../components/property/PropertyAmenities";
import AgentCard from "../components/property/AgentCard";
import PropertyActions from "../components/property/PropertyActions";
import PropertyDetailSkeleton from "../components/property/PropertyDetailSkeleton";

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      
      <h2 className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
        Property Not Found
      </h2>
      
      <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] text-center mb-6">
        The property you're looking for doesn't exist or has been removed.
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] hover:bg-gray-50 active:scale-95 transition-all"
        >
          Go Back
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl bg-[#1C2A3A] text-white text-[15px] font-semibold font-['DM_Sans',sans-serif] hover:opacity-90 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// ─── PropertyDetailPage ───────────────────────────────────────────────────────

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { data: property, isLoading, isError, refetch } = usePropertyDetail(id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <>
        <PropertyHeader propertyId={id} />
        <PropertyDetailSkeleton />
      </>
    );
  }

  // Error state
  if (isError || !property) {
    return <ErrorState onRetry={refetch} />;
  }

  // Success state
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Image Carousel with Header Overlay */}
      <div className="relative">
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
      <PropertyDescription description={property.description} />

      {/* Amenities */}
      <PropertyAmenities amenities={property.amenities} />

      {/* Agent Card */}
      <AgentCard agent={property.agent} />

      {/* Action Buttons (Fixed at bottom) */}
      <PropertyActions agent={property.agent}/>
    </div>
  );
};

export default PropertyDetailPage;
