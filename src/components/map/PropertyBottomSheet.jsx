
import { memo } from 'react';

const PropertyBottomSheet = memo(({ property, onClose, onViewDetails }) => {
  const img      = property.img      ?? property.image      ?? property.images?.[0]  ?? null;
  const title    = property.title    ?? property.name        ?? 'Property';
  const price    = property.price    ?? property.amount      ?? '';
  const location = property.location ?? property.address     ?? property.city        ?? '';
  const beds     = property.beds     ?? property.bedrooms    ?? null;
  const area     = property.area     ?? property.size        ?? null;

  return (
    <>
      {/* Backdrop — z-[1001] so it's above Leaflet's max z-index (~1000) */}
      <div
        className="fixed inset-0 bg-black/20"
        style={{ zIndex: 1001 }}
        onClick={onClose}
      />

      {/* Sheet — z-[1002] above backdrop */}
      <div
        className="fixed left-0 right-0 bottom-0"
        style={{ zIndex: 1002, animation: 'bsUp 0.28s cubic-bezier(0.32,0.72,0,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100">

          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Content */}
          <div className="px-4 pt-2 pb-2">
            <div className="flex items-start gap-3">

              {/* Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {img ? (
                  <img src={img} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-0.5">
                  {price}
                </p>
                <h3 className="text-[14px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] line-clamp-1 mb-1">
                  {title}
                </h3>
                {location ? (
                  <div className="flex items-center gap-1 mb-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] truncate">{location}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-3 text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
                  {beds != null && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      </svg>
                      {beds}
                    </span>
                  )}
                  {area != null && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                      </svg>
                      {area}
                    </span>
                  )}
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="px-4 pb-8 pt-2">
            <button
              onClick={onViewDetails}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1C2A3A] text-white text-[15px] font-bold font-['DM_Sans',sans-serif] hover:bg-[#263547] active:scale-[0.98] transition-all shadow-lg"
            >
              View Details
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bsUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
});

PropertyBottomSheet.displayName = 'PropertyBottomSheet';
export default PropertyBottomSheet;
