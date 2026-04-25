import { memo, useState, useEffect } from 'react';

const MAX_PRICE = 10_000_000;

const PROPERTY_TYPES   = ['Any', 'House', 'Loft', 'Apartment', 'Villa', 'Commercial', 'Land', 'Condo', 'Townhouse'];
const LISTING_TYPES    = ['For sale', 'For rent'];
const BEDROOM_OPTIONS  = ['1', '2', '3', '4', '5+'];
const BATHROOM_OPTIONS = ['1', '2', '3', '4+'];

// Display label → API purpose value
const LISTING_TO_PURPOSE = {
  'For sale': 'sale',
  'For rent': 'rent',
};

const AMENITY_LABELS = {
  Pool:             'Swimming pool',
  Gym:              'Gym & fitness',
  Parking:          'Garage parking',
  Security:         'Security system',
  Elevator:         'Elevator access',
  Garden:           'Garden & yard',
  Balcony:          'Balcony or terrace',
  PetFriendly:      'Pet friendly',
  Furnished:        'Furnished',
  AirConditioning:  'Air conditioning',
  Heating:          'Central heating',
  Fireplace:        'Fireplace',
  Laundry:          'In-unit laundry',
  Dishwasher:       'Dishwasher',
  HardwoodFloors:   'Hardwood floors',
  Internet:         'High-speed internet',
  CableTV:          'Cable TV',
  Unfurnished:      'Unfurnished',
  'Semi-furnished': 'Semi-furnished',
};

const AMENITIES = Object.keys(AMENITY_LABELS);

const formatPrice = (val) => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1000)      return `$${Math.round(val / 1000)}k`;
  return `$${val}`;
};

const buildState = (cf) => ({
  type:      cf.type      || null,
  purpose:   cf.purpose   || null,           // ← maps to Listing section
  minPrice:  cf.minPrice  ? Number(cf.minPrice) : 0,
  maxPrice:  cf.maxPrice  ? Number(cf.maxPrice) : MAX_PRICE,
  bedrooms:  cf.bedrooms  || null,
  bathrooms: cf.bathrooms || null,
  amenities: Array.isArray(cf.amenities) ? [...cf.amenities] : [],
});

/* ── iOS toggle ── */
const Toggle = memo(({ isOn, onToggle }) => (
  <button
    onClick={onToggle}
    className="relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none"
    style={{ background: isOn ? '#C96C38' : '#d1d5db' }}
  >
    <span
      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
      style={{ transform: isOn ? 'translateX(24px)' : 'translateX(2px)' }}
    />
  </button>
));
Toggle.displayName = 'Toggle';

/* ── Pill ── */
const Pill = memo(({ label, active, onClick, circle }) => (
  <button
    onClick={onClick}
    className={`font-semibold font-myriad transition-all active:scale-95 flex items-center justify-center ${
      circle ? 'w-12 h-12 rounded-full text-[13px]' : 'px-4 py-2 rounded-full text-[14px]'
    }`}
    style={{
      background: active ? '#C96C38' : 'white',
      color:      active ? 'white'   : '#374151',
      border:     `1.5px solid ${active ? '#C96C38' : '#d1d5db'}`,
    }}
  >
    {label}
  </button>
));
Pill.displayName = 'Pill';

const SectionLabel = ({ children }) => (
  <span className="text-[11px] font-semibold tracking-[0.11em] font-myriad block mb-3" style={{ color: '#9ca3af' }}>
    {children}
  </span>
);

/* ══════════════════════════════════════════════════════ */
const FullFiltersModal = memo(({ isOpen, onClose, onApply, currentFilters = {} }) => {
  const [filters, setFilters] = useState(() => buildState(currentFilters));

  // Re-sync from parent every time the modal opens so it always reflects applied state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (isOpen) setFilters(buildState(currentFilters)); }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      type:      filters.type                  || undefined,
      purpose:   filters.purpose               || undefined,
      minPrice:  filters.minPrice  > 0         ? filters.minPrice  : undefined,
      maxPrice:  filters.maxPrice  < MAX_PRICE ? filters.maxPrice  : undefined,
      bedrooms:  filters.bedrooms              || undefined,
      bathrooms: filters.bathrooms             || undefined,
      amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    });
    onClose();
  };

  const handleClear = () => setFilters({
    type: null, purpose: null,
    minPrice: 0, maxPrice: MAX_PRICE,
    bedrooms: null, bathrooms: null, amenities: [],
  });

  const toggleAmenity = (key) =>
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter(a => a !== key)
        : [...prev.amenities, key],
    }));

  const set = (patch) => setFilters(prev => ({ ...prev, ...patch }));

  const minPct = (filters.minPrice / MAX_PRICE) * 100;
  const maxPct = (filters.maxPrice / MAX_PRICE) * 100;

  return (
    <>
      <style>{`
        .filter-range {
          -webkit-appearance: none; appearance: none;
          background: transparent; pointer-events: none;
          position: absolute; left: 0; right: 0; width: 100%; height: 6px; margin: 0;
        }
        .filter-range::-webkit-slider-thumb {
          -webkit-appearance: none; pointer-events: all;
          width: 22px; height: 22px; border-radius: 50%;
          background: #C96C38; cursor: pointer;
          border: 3px solid white; box-shadow: 0 2px 8px rgba(201,108,56,0.45);
        }
        .filter-range::-moz-range-thumb {
          pointer-events: all; width: 16px; height: 16px; border-radius: 50%;
          background: #C96C38; cursor: pointer;
          border: 3px solid white; box-shadow: 0 2px 8px rgba(201,108,56,0.45);
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex flex-col">

        {/* ── Dark header ── */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #141852 0%, #2D368E 100%)' }}
        >
          <svg className="absolute top-0 right-0 pointer-events-none" width="140" height="130" viewBox="0 0 140 130" style={{ opacity: 0.11 }}>
            <circle cx="120" cy="10" r="70"  fill="none" stroke="white" strokeWidth="0.8" />
            <circle cx="120" cy="10" r="95"  fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="120" cy="10" r="120" fill="none" stroke="white" strokeWidth="0.3" />
          </svg>
          <div className="absolute pointer-events-none" style={{ top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)', filter: 'blur(20px)' }} />

          <div className="relative px-5 pt-6 pb-7">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center mb-5 transition-opacity active:opacity-70"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <p className="text-[11px] font-semibold font-myriad tracking-[0.14em] mb-1" style={{ color: 'rgba(196,210,255,0.55)' }}>FILTERS</p>
            <h1 className="text-[28px] font-bold font-myriad text-white leading-snug">
              Refine your <em style={{ color: '#C96C38', fontStyle: 'italic' }}>search</em>
            </h1>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto bg-white" style={{ borderRadius: '22px 22px 0 0', marginTop: '-16px' }}>
          <div className="px-6 pt-4">

            {/* PROPERTY TYPE */}
            <div className="py-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>PROPERTY TYPE</SectionLabel>
                <button
                  onClick={() => set({ type: null })}
                  className="text-[12px] font-bold font-myriad tracking-[0.06em] -mt-3 active:opacity-60"
                  style={{ color: '#C96C38' }}
                >
                  RESET
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t) => {
                  const val    = t === 'Any' ? null : t.toLowerCase();
                  const active = t === 'Any' ? filters.type === null : filters.type === val;
                  return (
                    <Pill key={t} label={t} active={active} onClick={() => set({ type: val })} />
                  );
                })}
              </div>
            </div>

            {/* LISTING → purpose */}
            <div className="py-5 border-b border-gray-100">
              <SectionLabel>LISTING</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {LISTING_TYPES.map((t) => {
                  const purposeVal = LISTING_TO_PURPOSE[t];
                  const active     = filters.purpose === purposeVal;
                  return (
                    <Pill
                      key={t}
                      label={t}
                      active={active}
                      onClick={() => set({ purpose: active ? null : purposeVal })}
                    />
                  );
                })}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div className="py-5 border-b border-gray-100">
              <SectionLabel>PRICE RANGE</SectionLabel>
              <div className="rounded-2xl px-4 py-4" style={{ background: '#f7f5f0' }}>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-semibold tracking-[0.12em] font-myriad mb-0.5" style={{ color: '#9ca3af' }}>MIN</div>
                    <div className="text-[22px] font-bold font-myriad" style={{ color: '#171C26' }}>
                      {filters.minPrice === 0 ? 'Any' : formatPrice(filters.minPrice)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold tracking-[0.12em] font-myriad mb-0.5" style={{ color: '#9ca3af' }}>MAX</div>
                    <div className="text-[22px] font-bold font-myriad" style={{ color: '#171C26' }}>
                      {filters.maxPrice >= MAX_PRICE ? 'Any' : formatPrice(filters.maxPrice)}
                    </div>
                  </div>
                </div>

                {/* Dual range slider */}
                <div className="relative flex items-center mt-4" style={{ height: '28px' }}>
                  <div className="absolute left-0 right-0 h-1.5 rounded-full" style={{ background: '#e5e7eb' }} />
                  <div
                    className="absolute h-1.5 rounded-full"
                    style={{ left: `${minPct}%`, width: `${maxPct - minPct}%`, background: '#C96C38' }}
                  />
                  <input
                    type="range" min={0} max={MAX_PRICE} step={50000}
                    value={filters.minPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val < filters.maxPrice - 50000) set({ minPrice: val });
                    }}
                    className="filter-range"
                    style={{ zIndex: filters.minPrice > MAX_PRICE * 0.9 ? 5 : 3 }}
                  />
                  <input
                    type="range" min={0} max={MAX_PRICE} step={50000}
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > filters.minPrice + 50000) set({ maxPrice: val });
                    }}
                    className="filter-range"
                    style={{ zIndex: 4 }}
                  />
                </div>
              </div>
            </div>

            {/* BEDROOMS */}
            <div className="py-5 border-b border-gray-100">
              <SectionLabel>BEDROOMS</SectionLabel>
              <div className="flex flex-wrap gap-2">
                <Pill label="Any" active={filters.bedrooms === null} onClick={() => set({ bedrooms: null })} circle />
                {BEDROOM_OPTIONS.map((bed) => (
                  <Pill
                    key={bed}
                    label={bed === '5+' ? '5+' : `${bed}+`}
                    active={filters.bedrooms === bed}
                    onClick={() => set({ bedrooms: filters.bedrooms === bed ? null : bed })}
                    circle
                  />
                ))}
              </div>
            </div>

            {/* BATHROOMS */}
            <div className="py-5 border-b border-gray-100">
              <SectionLabel>BATHROOMS</SectionLabel>
              <div className="flex flex-wrap gap-2">
                <Pill label="Any" active={filters.bathrooms === null} onClick={() => set({ bathrooms: null })} circle />
                {BATHROOM_OPTIONS.map((bath) => (
                  <Pill
                    key={bath}
                    label={bath.includes('+') ? bath : `${bath}+`}
                    active={filters.bathrooms === bath}
                    onClick={() => set({ bathrooms: filters.bathrooms === bath ? null : bath })}
                    circle
                  />
                ))}
              </div>
            </div>

            {/* AMENITIES */}
            <div className="py-5 pb-10">
              <SectionLabel>AMENITIES</SectionLabel>
              {AMENITIES.map((amenity, idx) => {
                const key    = amenity.toLowerCase();
                const isOn   = filters.amenities.includes(key);
                const isLast = idx === AMENITIES.length - 1;
                return (
                  <div
                    key={amenity}
                    className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
                  >
                    <span className="text-[16px] font-myriad italic" style={{ color: '#374151' }}>
                      {AMENITY_LABELS[amenity]}
                    </span>
                    <Toggle isOn={isOn} onToggle={() => toggleAmenity(key)} />
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 bg-white px-5 pt-3 pb-8 flex gap-3" style={{ borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={handleClear}
            className="px-5 py-4 rounded-2xl text-[14px] font-semibold font-myriad transition-all active:scale-[0.98]"
            style={{ background: 'white', color: '#374151', border: '1.5px solid #d1d5db' }}
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-4 rounded-full text-white text-[16px] font-semibold font-myriad transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: '#C96C38' }}
          >
            Show Results
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
});

FullFiltersModal.displayName = 'FullFiltersModal';
export default FullFiltersModal;
