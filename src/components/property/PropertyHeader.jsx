
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSaved } from "../../hooks/utils/useRedux";
import toast from "react-hot-toast";

const PropertyHeader = memo(({ propertyId }) => {
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(propertyId);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleToggleSave = useCallback(() => {
    toggleSaved(propertyId);
    if (!saved) {
      toast.success("Added to saved properties");
    } else {
      toast("Removed from saved");
    }
  }, [propertyId, toggleSaved, saved]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this property",
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all"
      >
        <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Right Actions */}
      <div className="flex gap-2">
        {/* Heart Button */}
        <button
          onClick={handleToggleSave}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all"
        >
          <svg 
            className={`w-5 h-5 transition-all ${
              saved 
                ? "fill-red-500 text-red-500 scale-110" 
                : "text-gray-900"
            }`}
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </div>
  );
});

export default PropertyHeader;
