
import { memo, useState } from 'react';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Commercial', 'Land', 'Condo', 'Townhouse'];
const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5+'];
const BATHROOM_OPTIONS = ['1', '2', '3', '4+'];
const AMENITIES = ['Pool', 'Gym', 'Parking', 'Security', 'Elevator', 'Garden', "Balcony", "PetFriendly",          "Furnished","AirConditioning", "Heating", "Fireplace", "Laundry", "Dishwasher", "HardwoodFloors", "Internet", "CableTV", "Unfurnished", "Semi-furnished",];

const FullFiltersModal = memo(({ isOpen, onClose, onApply, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    type: currentFilters.type || null,
    minPrice: currentFilters.minPrice || '',
    maxPrice: currentFilters.maxPrice || '',
    bedrooms: currentFilters.bedrooms || null,
    bathrooms: currentFilters.bathrooms || null,
    amenities: currentFilters.amenities || [],
  });

  if (!isOpen) return null;

  const handleApply = () => {
    const cleanedFilters = {
      type: filters.type || undefined,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
      bedrooms: filters.bedrooms || undefined,
      bathrooms: filters.bathrooms || undefined,
      amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    };
    onApply(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      type: null,
      minPrice: '',
      maxPrice: '',
      bedrooms: null,
      bathrooms: null,
      amenities: [],
    });
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bold/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-semibold text-primary font-myriad">
              All Filters
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors active:scale-90"
            >
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Property Type */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="text-[15px] font-semibold text-primary mb-3 font-myriad">
              Property Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, type: prev.type === type.toLowerCase() ? null : type.toLowerCase() }))}
                  className={`
                    px-4 py-2 rounded-lg border text-[15px] font-semibold font-myriad transition-all active:scale-95
                    ${filters.type === type.toLowerCase()
                      ? 'border-secondary bg-amber-50 text-primary'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="text-[15px] font-semibold text-primary mb-3 font-myriad">
              Price Range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-2 font-myriad">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="e.g. 100000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] font-myriad focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-2 font-myriad">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="e.g. 500000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] font-myriad focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="text-[15px] font-semibold text-primary mb-3 font-myriad">
              Bedrooms
            </h3>
            <div className="flex gap-2">
              {BEDROOM_OPTIONS.map((bed) => (
                <button
                  key={bed}
                  onClick={() => setFilters(prev => ({ ...prev, bedrooms: prev.bedrooms === bed ? null : bed }))}
                  className={`
                    flex-1 py-3 rounded-xl border text-[15px] font-semibold font-myriad transition-all active:scale-95
                    ${filters.bedrooms === bed
                      ? 'border-secondary bg-amber-50 text-primary'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {bed}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="text-[15px] font-semibold text-primary mb-3 font-myriad">
              Bathrooms
            </h3>
            <div className="flex gap-2">
              {BATHROOM_OPTIONS.map((bath) => (
                <button
                  key={bath}
                  onClick={() => setFilters(prev => ({ ...prev, bathrooms: prev.bathrooms === bath ? null : bath }))}
                  className={`
                    flex-1 py-3 rounded-xl border text-[15px] font-semibold font-myriad transition-all active:scale-95
                    ${filters.bathrooms === bath
                      ? 'border-secondary bg-amber-50 text-primary'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {bath}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="py-4">
            <h3 className="text-[15px] font-semibold text-primary mb-3 font-myriad">
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity.toLowerCase())}
                  className={`
                    px-4 py-2 rounded-lg border text-[15px] font-semibold font-myriad transition-all active:scale-95
                    ${filters.amenities.includes(amenity.toLowerCase())
                      ? 'border-secondary bg-amber-50 text-primary'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 bg-white px-6 pb-6 pt-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-primary text-[16px] font-semibold font-myriad hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-4 rounded-2xl bg-primary text-white text-[16px] font-semibold font-myriad hover:bg-primary-light transition-all active:scale-[0.98] shadow-lg"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
});

FullFiltersModal.displayName = 'FullFiltersModal';

export default FullFiltersModal;
