// src/components/map/PropertyBottomSheet.jsx
import { memo } from "react";

/**
 * PropertyBottomSheet Component
 * Bottom sheet showing property preview
 * Fixed: Proper z-index above footer, smooth slide animation
 */
const PropertyBottomSheet = memo(({ property, onClose, onViewDetails }) => {
  return (
    <>
      {/* Backdrop - Darkens the map */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet - Above footer */}
      <div className="fixed bottom-16 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 pb-safe">
          {/* Property Preview */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Property Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                {property.img ? (
                  <img
                    src={property.img}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                )}
              </div>

              {/* Property Details */}
              <div className="flex-1 min-w-0">
                {/* Price */}
                <p className="text-[18px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
                  {property.price}
                </p>

                {/* Title */}
                <h3 className="text-[15px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] line-clamp-1 mb-1">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 mb-2">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-[13px] text-gray-500 font-['DM_Sans',sans-serif] line-clamp-1">
                    {property.location}
                  </span>
                </div>

                {/* Property Stats */}
                <div className="flex items-center gap-3 text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
                  {property.beds && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                      <span>{property.beds}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                      <span>{property.area}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* View Details Button */}
          <div className="px-4 pb-6">
            <button
              onClick={onViewDetails}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#1C2A3A] text-white text-[16px] font-bold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] transition-all active:scale-[0.98] shadow-lg"
            >
              View Details
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

PropertyBottomSheet.displayName = 'PropertyBottomSheet';

export default PropertyBottomSheet;
