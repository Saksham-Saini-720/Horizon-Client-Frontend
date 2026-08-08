
import { memo } from "react";

/**
 * Amenities as icon + label rows, not chips.
 *
 * A chip is a filter control — something you select and deselect to narrow a
 * search. These are static facts about one property, so borrowing that shape
 * implies an interaction that does not exist. The pattern listing sites settle
 * on is an icon on a consistent grid with the label beside it, which also scans
 * far faster than a ragged wrap of pills.
 *
 * Icons are drawn on a shared 24x24 viewBox at a single stroke weight, so they
 * sit on one optical grid instead of each having its own size and density.
 */

const ICONS = {
  pool: <><path d="M2 16c1.5 0 2-1 3.5-1s2 1 3.5 1 2-1 3.5-1 2 1 3.5 1 2-1 3.5-1" /><path d="M2 20c1.5 0 2-1 3.5-1s2 1 3.5 1 2-1 3.5-1 2 1 3.5 1 2-1 3.5-1" /><path d="M8 14V5a2 2 0 1 1 4 0M16 14V5a2 2 0 1 1 4 0" /></>,
  gym: <><path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12" /></>,
  parking: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 17V8h3.5a2.5 2.5 0 0 1 0 5H9" /></>,
  security: <><path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6z" /><path d="M9.5 12l1.8 1.8 3.4-3.6" /></>,
  elevator: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M12 3v18M9 9l-1.5-2L6 9M15 15l1.5 2 1.5-2" /></>,
  garden: <><path d="M12 21V11" /><path d="M12 11c0-3 2-5 5-5 0 3-2 5-5 5z" /><path d="M12 13c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M8 21h8" /></>,
  balcony: <><path d="M3 10h18M4 10V6h16v4" /><path d="M5 10v11M19 10v11M9 14v7M15 14v7M5 14h14" /></>,
  petfriendly: <><ellipse cx="6" cy="10" rx="1.8" ry="2.4" /><ellipse cx="10.5" cy="7" rx="1.8" ry="2.6" /><ellipse cx="15.5" cy="7" rx="1.8" ry="2.6" /><ellipse cx="19" cy="10.5" rx="1.8" ry="2.4" /><path d="M12.5 13c-2.6 0-4.8 1.9-4.8 4.1 0 1.6 1.3 2.6 3 2.6h3.6c1.7 0 3-1 3-2.6 0-2.2-2.2-4.1-4.8-4.1z" /></>,
  furnished: <><path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M3 11h18v6H3zM5 17v3M19 17v3" /></>,
  airconditioning: <><rect x="3" y="4" width="18" height="9" rx="2" /><path d="M7 17v.01M12 17v.01M17 17v.01M7 20v.01M12 20v.01M17 20v.01" /></>,
  heating: <><path d="M12 3s4 4 4 7a4 4 0 0 1-8 0c0-3 4-7 4-7z" /><path d="M12 21v-3" /></>,
  fireplace: <><path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" /><path d="M9 21v-4a3 3 0 0 1 6 0v4" /></>,
  laundry: <><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 6.5h.01M11 6.5h.01" /></>,
  dishwasher: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 8h16" /><path d="M9 12c1.5 1 1.5 3 0 4M15 12c1.5 1 1.5 3 0 4" /></>,
  hardwoodfloors: <><path d="M3 6h8M13 6h8M3 12h5M10 12h11M3 18h11M16 18h5" /></>,
  internet: <><path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0" /><path d="M2 9.5a15 15 0 0 1 20 0" /><path d="M12 19h.01" /></>,
  cabletv: <><rect x="2" y="7" width="20" height="13" rx="2" /><path d="M8 3l4 4 4-4" /></>,
};

// Everything not in ICONS still gets a mark, so the column stays aligned.
const FALLBACK = <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.2l2.4 2.4 4.6-4.8" /></>;

const iconFor = (amenity) =>
  ICONS[String(amenity).toLowerCase().replace(/[\s_-]/g, "")] ?? FALLBACK;

// Data arrives lowercase and machine-shaped ("petFriendly", "air_conditioning").
const labelFor = (amenity) =>
  String(amenity)
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

const Amenity = memo(({ amenity }) => (
  <div className="flex items-center gap-3 min-w-0">
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
      className="w-[22px] h-[22px] flex-shrink-0 text-primary-light"
      aria-hidden="true"
    >
      {iconFor(amenity)}
    </svg>
    <span className="text-[14px] text-gray-700 font-myriad truncate">
      {labelFor(amenity)}
    </span>
  </div>
));

Amenity.displayName = "Amenity";

const PropertyAmenities = memo(({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="mx-5 mb-4 rounded-2xl bg-white p-5 shadow-card-sm">
      {/* Heading with orange underline accent */}
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-secondary font-display">
          Amenities
        </h2>
        <div className="mt-1.5 w-8 h-0.5 rounded-full bg-primary-light" />
      </div>

      {/* Two columns: short labels read as a scannable list rather than a
          ragged wrap, and the icons form a single vertical alignment line. */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
        {amenities.map((amenity, index) => (
          <Amenity key={index} amenity={amenity} />
        ))}
      </div>
    </div>
  );
});

PropertyAmenities.displayName = 'PropertyAmenities';
export default PropertyAmenities;
