
import { memo, useEffect, useRef, useState } from "react";

const SpeakerIcon = ({ isMuted, volume }) => {
  if (isMuted || volume === 0) {
    return (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    );
  }
  if (volume < 0.5) {
    return (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
};

// Minimum horizontal travel, in px, before a touch counts as a swipe.
const SWIPE_THRESHOLD = 40;

/**
 * `fill` makes the media fill its container instead of taking a square of the
 * page — used on the detail page, where the image sits behind a draggable sheet
 * and has to be full-screen for the sheet to reveal it.
 *
 * `dotsStyle` positions the indicators, because in fill mode "the bottom of the
 * image" is behind the sheet; the caller knows where the sheet's edge is. It is
 * an inline style rather than a class because the caller computes it from the
 * sheet geometry, and Tailwind cannot generate a class from a runtime value.
 */
const PropertyImageCarousel = memo(({
  mediaItems = [],
  fill = false,
  dotsStyle = { bottom: 48 },
  // "contain" shows the whole frame, letterboxed against the dark backdrop —
  // right for a hero, where cropping a landscape photo into a tall box zooms
  // hard into its middle. "cover" stays the default for fixed-ratio thumbnails.
  objectFit = "cover",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const videoRefs = useRef([]);
  const touchStartX = useRef(null);

  // Auto-play video when slide becomes active; pause + reset others
  useEffect(() => {
    mediaItems.forEach((item, i) => {
      const vid = videoRefs.current[i];
      if (!vid) return;
      if (i === currentIndex) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [currentIndex, mediaItems]);

  // Sync muted + volume to all video elements imperatively
  useEffect(() => {
    videoRefs.current.forEach((vid) => {
      if (!vid) return;
      vid.muted = isMuted;
      vid.volume = volume;
    });
  }, [isMuted, volume]);

  if (!mediaItems.length) {
    return (
      <div className={`relative w-full bg-gray-200 flex items-center justify-center ${fill ? "h-full" : "h-[400px]"}`}>
        <span className="text-gray-400">No media available</span>
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex];

  // Spelled out rather than built as `object-${objectFit}` — Tailwind scans
  // source statically, so an interpolated class name is never generated.
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  const goToPrevious = () => {
    videoRefs.current[currentIndex]?.pause();
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    videoRefs.current[currentIndex]?.pause();
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  // Swipe. With the arrows gone the dots would otherwise be the only way to
  // move, which is not how anyone uses a photo gallery on a phone — the design
  // showing dots alone assumes the image itself is draggable.
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    // Below the threshold it was a tap, not a swipe — a video slide's
    // play/pause target sits under the same finger.
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    // Suppress the click the browser fires after a touch sequence, so swiping
    // between photos does not also trigger the caller's tap handler (on the
    // detail page, that would open the full-screen gallery on every swipe).
    e.preventDefault();
    if (delta < 0) goToNext();
    else goToPrevious();
  };

  const togglePlayPause = () => {
    const vid = videoRefs.current[currentIndex];
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  };

  const toggleMute = () => {
    // If unmuting while volume is 0, restore to a audible level first
    if (isMuted && volume === 0) setVolume(0.5);
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  return (
    <div
      className={`relative w-full bg-gray-900 overflow-hidden touch-pan-y ${
        fill ? "h-full" : "max-h-[650px] aspect-square"
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="relative z-[1] flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {mediaItems.map((item, index) =>
          item.type === "video" ? (
            <video
              key={index}
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.url}
              muted
              playsInline
              loop
              className={`w-full h-full flex-shrink-0 ${fitClass}`}
              onPlay={() => index === currentIndex && setIsPlaying(true)}
              onPause={() => index === currentIndex && setIsPlaying(false)}
            />
          ) : (
            <img
              key={index}
              src={item.url}
              alt={`Property ${index + 1}`}
              className={`w-full h-full flex-shrink-0 ${fitClass}`}
            />
          )
        )}
      </div>

      {/* Play / Pause overlay — only on active video slide */}
      {currentItem.type === "video" && (
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center group"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </button>
      )}

      {/* Sound controls (volume slider + mute button) — bottom-right on video slides */}
      {currentItem.type === "video" && (
        <div className="absolute bottom-16 right-4 flex items-center gap-2 z-10">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="w-20 h-1 accent-white cursor-pointer rounded-full"
          />
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all flex-shrink-0"
          >
            <SpeakerIcon isMuted={isMuted} volume={volume} />
          </button>
        </div>
      )}

      {/*
        Dots are the only navigation, per the design — no arrows, no counter.

        They are also no longer gated on a maximum count. The old `<= 5` limit
        hid them on longer galleries, which was survivable only because the
        arrows covered for it; with those gone it would have left a six-photo
        listing with no way to move at all.
      */}
      {mediaItems.length > 1 && (
        <div
          style={dotsStyle}
          className="absolute left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 px-6 max-w-full z-10 transition-all duration-300 ease-out"
        >
          {mediaItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                videoRefs.current[currentIndex]?.pause();
                setCurrentIndex(index);
              }}
              aria-label={`Go to image ${index + 1} of ${mediaItems.length}`}
              aria-current={index === currentIndex}
              className={`h-2 rounded-full transition-all flex-shrink-0 ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default PropertyImageCarousel;
