import { memo, useState, useEffect } from 'react';
import Footer from '../../layouts/Footer';

const MAX_PRICE = 10_000_000;

const PROPERTY_TYPES   = ['Any', 'House', 'Loft', 'Apartment', 'Villa', 'Commercial', 'Land', 'Condo', 'Townhouse'];
const LISTING_TYPES    = ['For sale', 'For rent'];
const BEDROOM_OPTIONS  = ['1', '2', '3', '4', '5+'];
const BATHROOM_OPTIONS = ['1', '2', '3', '4+'];

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
  if (val >= 1_000_000) return `ZMW ${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1000)      return `ZMW ${Math.round(val / 1000)}k`;
  return `ZMW ${val}`;
};

const buildState = (cf) => ({
  type:      cf.type      || null,
  purpose:   cf.purpose   || null,
  minPrice:  cf.minPrice  ? Number(cf.minPrice) : 0,
  maxPrice:  cf.maxPrice  ? Number(cf.maxPrice) : MAX_PRICE,
  bedrooms:  cf.bedrooms  || null,
  bathrooms: cf.bathrooms || null,
  amenities: Array.isArray(cf.amenities) ? [...cf.amenities] : [],
});

/* ── iOS Toggle ── */
const Toggle = memo(({ isOn, onToggle }) => (
  <button
    onClick={onToggle}
    className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none overflow-hidden"
    style={{ width: 51, height: 31, padding: 0, background: isOn ? '#C96C38' : '#d1d5db' }}
  >
    <span
      className="absolute top-[3px] w-[25px] h-[25px] bg-white rounded-full transition-all duration-200"
      style={{ left: isOn ? '23px' : '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.30)' }}
    />
  </button>
));
Toggle.displayName = 'Toggle';

/* ── Pill ── */
const Pill = memo(({ label, active, onClick, circle }) => (
  <button
    onClick={onClick}
    className={`font-semibold font-myriad transition-all duration-150 active:scale-95 flex items-center justify-center ${
      circle ? 'w-12 h-12 rounded-full text-[13px]' : 'px-4 py-2 rounded-full text-[14px]'
    }`}
    style={{
      background: active ? '#C96C38' : '#ffffff',
      color:      active ? '#ffffff' : '#374151',
      border:     active ? '1.5px solid #C96C38' : '1.5px solid #d1d5db',
    }}
  >
    {label}
  </button>
));
Pill.displayName = 'Pill';

const SectionLabel = ({ children }) => (
  <span
    className="text-[11px] font-semibold tracking-[0.11em] font-myriad block mb-3"
    style={{ color: '#9ca3af' }}
  >
    {children}
  </span>
);

/* ══════════════════════════════════════════════════════ */
const FullFiltersModal = memo(({ isOpen, onClose, onApply, currentFilters = {} }) => {
  const [filters, setFilters] = useState(() => buildState(currentFilters));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (isOpen) setFilters(buildState(currentFilters)); }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      type:      filters.type,   // null = user picked "Any" (clears preference); string = specific type
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
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(201,108,56,0.45);
        }
        .filter-range::-moz-range-thumb {
          pointer-events: all; width: 16px; height: 16px; border-radius: 50%;
          background: #C96C38; cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(201,108,56,0.45);
        }
      `}</style>

      {/* ── Full-screen wrapper — z-30 so footer (z-40) sits on top ── */}
      <div className="fixed inset-0 z-30 flex flex-col bg-white">

        {/* ── Header ── */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ background: 'linear-gradient(160deg, #141852 0%, #1e2870 60%, #2D368E 100%)' }}
        >
          {/* decorative rings top-right */}
          <svg className="absolute top-0 right-0 pointer-events-none" width="150" height="140" viewBox="0 0 150 140" style={{ opacity: 0.10 }}>
            <circle cx="130" cy="10" r="75"  fill="none" stroke="white" strokeWidth="0.8" />
            <circle cx="130" cy="10" r="105" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="130" cy="10" r="135" fill="none" stroke="white" strokeWidth="0.3" />
          </svg>
          {/* purple glow */}
          <div className="absolute pointer-events-none" style={{
            top: '-20px', right: '-20px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
            filter: 'blur(24px)',
          }} />

          <div className="relative px-5 pt-12 pb-10 flex items-center gap-4">
            {/* Back button — squircle shape */}
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center transition-opacity active:opacity-70"
              style={{
                width: 36, height: 36,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div>
              {/* "FILTERS" label — orange, matches screenshot */}
              <p
                className="text-[12px] font-bold font-myriad tracking-[0.18em] mb-1"
                style={{ color: '#C96C38' }}
              >
                FILTERS
              </p>

              {/* Title */}
              <h1 className="text-[25px] font-medium font-display text-white leading-tight">
                Refine your{' '}
                <em style={{ fontStyle: 'italic', color: '#C96C38' }}>search</em>
              </h1>
            </div>
          </div>
        </div>

        {/* ── White content card — overlaps header like login page ── */}
        <div
          className="flex-1 overflow-hidden flex flex-col bg-white -mt-7 shadow-2xl relative z-10 mx-5"
          style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        >

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">

            {/* Pull handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div style={{ width: 36, height: 4, borderRadius: 2, background: '#e5e7eb' }} />
            </div>

            <div className="px-5 pt-1">

              {/* PROPERTY TYPE */}
              <div className="py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>PROPERTY TYPE</SectionLabel>
                  <button
                    onClick={() => set({ type: null })}
                    className="text-[12px] font-bold font-myriad tracking-[0.06em] -mt-3 active:opacity-60 transition-opacity"
                    style={{ color: '#C96C38' }}
                  >
                    RESET
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((t) => {
                    const val    = t === 'Any' ? null : t.toLowerCase();
                    const active = t === 'Any' ? filters.type === null : filters.type === val;
                    return <Pill key={t} label={t} active={active} onClick={() => set({ type: val })} />;
                  })}
                </div>
              </div>

              {/* LISTING */}
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
                <div
                  className="rounded-2xl px-4 py-4"
                  style={{ background: '#f5f2eb' }}
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-semibold tracking-[0.12em] font-myriad mb-0.5" style={{ color: '#9ca3af' }}>MIN</div>
                      <div className="text-[22px] font-medium font-display" style={{ color: '#171C26' }}>
                        {filters.minPrice === 0 ? 'Any' : formatPrice(filters.minPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-semibold tracking-[0.12em] font-myriad mb-0.5" style={{ color: '#9ca3af' }}>MAX</div>
                      <div className="text-[22px] font-medium font-display" style={{ color: '#171C26' }}>
                        {filters.maxPrice >= MAX_PRICE ? 'Any' : formatPrice(filters.maxPrice)}
                      </div>
                    </div>
                  </div>
                  {/* Dual range slider */}
                  <div className="relative flex items-center mt-4" style={{ height: '28px' }}>
                    <div className="absolute left-0 right-0 h-[5px] rounded-full" style={{ background: '#ddd9d0' }} />
                    <div
                      className="absolute h-[5px] rounded-full"
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
              <div className="py-5 pb-6">
                <SectionLabel>AMENITIES</SectionLabel>
                {AMENITIES.map((amenity, idx) => {
                  const key    = amenity.toLowerCase();
                  const isOn   = filters.amenities.includes(key);
                  const isLast = idx === AMENITIES.length - 1;
                  return (
                    <div
                      key={amenity}
                      className={`flex items-center justify-between py-[14px] ${!isLast ? 'border-b border-gray-100' : ''}`}
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

          {/* ── Footer inside card ── */}
          <div
            className="flex-shrink-0 px-4 pt-3 pb-24 flex gap-3"
            style={{ borderTop: '1px solid #f0f0f0' }}
          >
            <button
              onClick={handleClear}
              className="px-5 py-[14px] rounded-2xl text-[14px] font-semibold font-myriad transition-all active:scale-[0.97]"
              style={{
                background: 'white',
                color: '#374151',
                border: '1.5px solid #d1d5db',
              }}
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-[14px] rounded-full text-white text-[15px] font-semibold font-myriad transition-all active:scale-[0.97] flex items-center justify-center gap-2"
              style={{
                background: '#C96C38',
                boxShadow: '0 4px 14px rgba(201,108,56,0.40)',
              }}
            >
              Show Results
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

        </div>
        {/* ── /floating card ── */}

      </div>

      <Footer />
    </>
  );
});

FullFiltersModal.displayName = 'FullFiltersModal';
export default FullFiltersModal;
