
import { memo, useState, useEffect, useCallback } from 'react';

/**
 * LocationPickerModal
 * Modal for selecting location - shows current location, search, and recent locations
 */
const LocationPickerModal = memo(({ isOpen, onClose, onSelectLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Recent locations from localStorage
  const [recentLocations, setRecentLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('recentLocations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Popular cities in Zambia
  const popularCities = [
    { name: 'Lusaka', country: 'Zambia', lat: -15.4167, lng: 28.2833 },
    { name: 'Kitwe', country: 'Zambia', lat: -12.8024, lng: 28.2136 },
    { name: 'Ndola', country: 'Zambia', lat: -12.9587, lng: 28.6366 },
    { name: 'Kabwe', country: 'Zambia', lat: -14.4469, lng: 28.4464 },
    { name: 'Chingola', country: 'Zambia', lat: -12.5289, lng: 27.8631 },
    { name: 'Mufulira', country: 'Zambia', lat: -12.5497, lng: 28.2405 },
  ];

  // Simulated location search (replace with real geocoding API)
  const searchLocations = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filter popular cities based on search
    const results = popularCities.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setIsSearching(false);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocations]);

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          name: 'Current Location',
          country: 'Zambia',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        handleLocationSelect(location);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not get your location. Please enable location services.');
        setIsGettingLocation(false);
      }
    );
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    // Save to recent locations
    const newRecent = [
      location,
      ...recentLocations.filter(loc => loc.name !== location.name)
    ].slice(0, 5); // Keep only 5 recent

    setRecentLocations(newRecent);
    localStorage.setItem('recentLocations', JSON.stringify(newRecent));

    // Notify parent
    onSelectLocation(location);
    onClose();
  };

  // Clear recent locations
  const handleClearRecent = () => {
    setRecentLocations([]);
    localStorage.removeItem('recentLocations');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bold/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[20px] font-semibold text-primary font-myriad">
            Select Location
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or area..."
              className="flex-1 bg-transparent text-[15px] text-primary placeholder-gray-400 outline-none font-[inter]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Current Location Button */}
          <div className="px-6 py-4 border-b border-gray-100">
            <button
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 transition-colors disabled:opacity-50"
            >
              {isGettingLocation ? (
                <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              )}
              <div className="flex-1 text-left">
                <p className="text-[15px] font-semibold text-primary font-myriad">
                  Use Current Location
                </p>
                <p className="text-[12px] text-gray-500 font-myriad">
                  Find properties near you
                </p>
              </div>
            </button>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="px-6 py-2">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Search Results
              </p>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((location, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div className="flex-1">
                        <p className="text-[15px] font-semibold text-primary font-myriad">
                          {location.name}
                        </p>
                        <p className="text-[12px] text-gray-500 font-myriad">
                          {location.country}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[15px] text-gray-400 font-myriad">
                    No locations found
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent Locations */}
          {!searchQuery && recentLocations.length > 0 && (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                  Recent Locations
                </p>
                <button
                  onClick={handleClearRecent}
                  className="text-[12px] font-semibold text-secondary hover:text-secondary"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1">
                {recentLocations.map((location, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                  >
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold text-primary font-myriad">
                        {location.name}
                      </p>
                      {location.country && (
                        <p className="text-[12px] text-gray-500 font-myriad">
                          {location.country}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Cities */}
          {!searchQuery && (
            <div className="px-6 py-4">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Popular Cities
              </p>
              <div className="space-y-1">
                {popularCities.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLocationSelect(city)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                  >
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold text-primary font-myriad">
                        {city.name}
                      </p>
                      <p className="text-[12px] text-gray-500 font-myriad">
                        {city.country}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LocationPickerModal.displayName = 'LocationPickerModal';

export default LocationPickerModal;
