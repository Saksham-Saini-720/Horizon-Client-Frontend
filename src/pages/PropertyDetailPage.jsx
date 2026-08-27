import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useDragControls } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import usePropertyDetail from "../hooks/properties/usePropertyDetail";
import usePropertyAgent from "../hooks/properties/usePropertyAgent";
import { useAuth } from "../hooks/utils/useRedux";
import Button from "../components/ui/Button";
import PropertyImageCarousel from "../components/property/PropertyImageCarousel";
import PropertyGallery from "../components/property/PropertyGallery";
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

// ─── Sheet geometry ───────────────────────────────────────────────────────────

/**
 * Where the sheet rests, i.e. how tall the hero is.
 *
 * 75vw is a 4:3 box at the screen's width — the standard ratio for real estate
 * photography, and the shape most listing photos already are. Because the box
 * matches the picture, `cover` crops almost nothing and letterboxes nothing:
 * no zoom and no bars, which no fixed viewport-height value can achieve.
 *
 * The hero never leaves this ratio. A landscape photo cannot fill a portrait
 * screen without cropping or letterboxing, so morphing it to full screen can
 * only pick which of those to suffer — seeing the whole frame is the gallery's
 * job instead. Capped at 52dvh so a wide window cannot push the sheet off.
 */
const SHEET_TOP = "min(75vw, 52dvh)";
// The fixed "Schedule a tour" bar plus the app's bottom nav. The sheet stops
// above both so its last row is never trapped behind them.
//
// Derived from the same CSS variables those two elements use, rather than the
// hardcoded 154 it was before — that number assumed an 80px nav and went stale
// the moment the nav picked up the home-indicator inset.
const BOTTOM_CHROME = "calc(var(--nav-h) + var(--action-bar-h))";
// How much of the sheet stays on screen when dragged down: enough to show the
// grab handle, so there is always something to pull back up.
const PEEK = 44;
// Past this much travel (or this much flick speed) the drag commits instead of
// springing back.
const FLICK_VELOCITY = 400;

// The hero runs this far past the sheet's top edge, so image sits behind the
// sheet's rounded corners instead of white notches showing through.
const HERO_OVERSHOOT = 28;

// Dots sit just above the sheet's edge. Measured from the hero's OWN bottom,
// not the viewport: the hero is a 4:3 box, so its bottom 28px are the part
// hidden behind the sheet, and the dots clear that plus a 14px gap.
const DOTS_STYLE = { bottom: HERO_OVERSHOOT + 14 };

// ─── PropertyDetailPage ───────────────────────────────────────────────────────

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State for enquiry trigger
  const [shouldOpenEnquiry, setShouldOpenEnquiry] = useState(false);

  // Dragged up => the sheet fills the screen for reading, per Material's bottom
  // sheet spec. The hero never moves; it is a fixed 4:3 frame either way.
  const [expanded, setExpanded] = useState(false);
  // How far up "expanded" is, in px — the sheet's own offset from the top.
  // Measured rather than assumed, since SHEET_TOP is a viewport-relative value.
  const [expandedY, setExpandedY] = useState(0);
  // Full-screen photo viewer.
  const [galleryOpen, setGalleryOpen] = useState(false);

  const sheetRef = useRef(null);
  // The scrolling element is the sheet's body, not the window.
  const scrollRef = useRef(null);
  // Drag starts from the handle only (dragListener is off), so dragging the
  // sheet can never fight with scrolling its content.
  const dragControls = useDragControls();
  // Distinguishes a tap on the handle from the click that follows a drag.
  const didDrag = useRef(false);

  // Fetch property details
  const { data: property, isLoading, isError, error, refetch } = usePropertyDetail(id);

  // Fetch agent details (only if authenticated)
  const {
    data: agentDetails,
    isLoading: isAgentLoading,
  } = usePropertyAgent(id);

  // Reopen the sheet when the route moves to a different property, so a listing
  // never opens with the sheet still dragged shut from the previous one.
  // Adjusted during render rather than in an effect — React's documented "reset
  // state when a prop changes" pattern. It tracks the previous id in state, not
  // a ref, because refs may not be read or written during render.
  const [renderedId, setRenderedId] = useState(id);
  if (renderedId !== id) {
    setRenderedId(id);
    setExpanded(false);
    setGalleryOpen(false);
  }

  // The sheet body scrolls, not the window, so window.scrollTo would do nothing
  // — you would land part-way down the next property.
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [id]);

  // How far the sheet travels to fill the screen: its own distance from the top
  // of the clipping container. Depends on the viewport, so it re-runs on resize
  // and orientation change, and once more when `property` first renders.
  useLayoutEffect(() => {
    const measure = () => setExpandedY(sheetRef.current?.offsetTop ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [property]);

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

  // Signed-in users get the richer AgentProfile (bio, agency, rating), but that
  // lookup returns null whenever the assigned agent has no AgentProfile row —
  // and without the fallback, signing in showed LESS than browsing anonymously.
  // property.agent is always derivable from the listing itself.
  const displayAgent = (isAuthenticated ? agentDetails : null) ?? property.agent;

  // Success state
  return (
    // The page itself does not scroll — it is a fixed column exactly one
    // viewport tall. The hero keeps its natural height and the sheet takes the
    // rest, scrolling its own content. That is what keeps the image completely
    // still: nothing can slide over it because nothing outside the sheet moves.
    //
    // h-dvh, not h-screen: on mobile `vh` is the tallest the viewport ever gets,
    // so with the browser chrome showing, h-screen would push the sheet's last
    // rows below the fold with no page scroll left to reach them.
    <div className="h-dvh bg-canvas overflow-hidden relative">
      {/*
        Fixed 4:3 hero. It never resizes and never changes fit, so it is always
        framed correctly — the 28px overshoot just keeps image behind the
        sheet's rounded top corners, which would otherwise show white notches.

        Tapping it opens the gallery. That is the trade the whole layout rests
        on: the hero stays perfectly framed, and seeing the entire photo is a
        deliberate mode rather than something the hero contorts itself to do.
      */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: `calc(${SHEET_TOP} + ${HERO_OVERSHOOT}px)` }}
      >
        <div
          onClick={() => setGalleryOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="View photos full screen"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setGalleryOpen(true);
            }
          }}
          className="h-full cursor-zoom-in"
        >
          <PropertyImageCarousel
            mediaItems={property.mediaItems}
            fill
            dotsStyle={DOTS_STYLE}
          />
        </div>
        <PropertyHeader propertyId={id} />
      </div>

      {/*
        Clips the sheet at the top of the fixed chrome, so it can never paint
        into the strip behind the action bar and the bottom nav.

        pointer-events-none is essential: this box spans from the top of the
        screen, so it lies over the whole hero. Transparent or not, it would
        otherwise swallow every tap and swipe meant for the image and the
        back/share/save buttons underneath. The sheet re-enables events for
        itself.
      */}
      <div
        className="absolute inset-x-0 top-0 z-10 overflow-hidden pointer-events-none"
        style={{ bottom: BOTTOM_CHROME }}
      >
      {/* Drags UP to fill the screen, with content scrolling inside it — the
          direction Material's bottom sheet spec describes. Dragging down to
          uncover media is what forced the hero to distort. */}
      <Motion.div
        ref={sheetRef}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: -expandedY, bottom: 0 }}
        dragElastic={0.04}
        animate={{ y: expanded ? -expandedY : 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        onDragStart={() => { didDrag.current = true; }}
        onDragEnd={(_, info) => {
          // Commit on a flick or on enough travel; otherwise the animate prop
          // springs it back to whichever state it was already in.
          if (info.velocity.y < -FLICK_VELOCITY || info.offset.y < -PEEK) {
            setExpanded(true);
          } else if (info.velocity.y > FLICK_VELOCITY || info.offset.y > PEEK) {
            setExpanded(false);
          }
          // Cleared after the click event that follows this drag has fired.
          setTimeout(() => { didDrag.current = false; }, 0);
        }}
        className="absolute left-0 right-0 bottom-0 flex flex-col rounded-t-[28px] bg-canvas shadow-2xl pointer-events-auto"
        style={{ top: SHEET_TOP }}
      >
        {/* Grab handle — the only drag surface, and a tap target for toggling.
            touch-none keeps the browser from claiming the gesture as a scroll. */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          onClick={() => { if (!didDrag.current) setExpanded((v) => !v); }}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-label={expanded ? "Shrink details to show the photo" : "Expand property details"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setExpanded((v) => !v);
            }
          }}
          className="flex-shrink-0 flex justify-center pt-3 pb-2 touch-none cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/*
          min-h-0 is load-bearing: a flex child defaults to min-height:auto and
          refuses to shrink below its content, so without it this grows to fit
          and overflow-y-auto never gets anything to scroll. overscroll-contain
          stops a scroll hitting the end here from chaining to the page.
        */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-6"
        >
        {/* Property Info: tags, title, location, price */}
        <PropertyInfo property={property} />

        {/* Bed / Bath / area stats — the raw number, labelled by its own unit */}
        <PropertyStats
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          area={property.rawArea}
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

        {/* Agent Card */}
        <AgentCard
          agent={displayAgent}
          property={property}
          isLoading={isAuthenticated && isAgentLoading}
        />
        </div>
      </Motion.div>
      </div>

      {/* Fixed action bar (Schedule a tour + Enquiry) */}
      <PropertyActions
        agent={displayAgent}
        property={property}
        shouldOpenEnquiry={shouldOpenEnquiry}
      />

      {/* Where the whole frame gets seen — see the note on SHEET_TOP */}
      <PropertyGallery
        mediaItems={property.mediaItems}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
};

export default PropertyDetailPage;
