import { memo, useEffect } from "react";
import PropertyImageCarousel from "./PropertyImageCarousel";

/**
 * Full-screen photo viewer.
 *
 * This is the other half of the fixed-ratio hero: the hero never distorts to
 * fit the screen, and when someone actually wants to study a photo they open
 * this instead. Letterboxing is correct here — the user has explicitly asked to
 * see the whole frame, which is exactly the case where bars read as intentional
 * rather than as a broken layout.
 */
const PropertyGallery = memo(({ mediaItems = [], isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-bold flex flex-col animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Property photos"
    >
      <button
        onClick={onClose}
        aria-label="Close photos"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-all hover:bg-white/25"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex-1 min-h-0">
        <PropertyImageCarousel
          mediaItems={mediaItems}
          fill
          objectFit="contain"
          dotsStyle={{ bottom: 32 }}
        />
      </div>
    </div>
  );
});

PropertyGallery.displayName = "PropertyGallery";

export default PropertyGallery;
