
import { memo, useState, useEffect, useCallback, useRef } from 'react';

const searchNominatim = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'HorizonProperties/1.0' }
  });
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};

const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'HorizonProperties/1.0' }
  });
  if (!res.ok) throw new Error('Reverse geocode failed');
  return res.json();
};

const formatResult = (item) => {
  const addr = item.address || {};
  const name = addr.city || addr.town || addr.village || addr.county || item.display_name.split(',')[0];
  const country = addr.country || '';
  const state = addr.state || '';
  return {
    name,
    country,
    state,
    displayName: [name, state, country].filter(Boolean).join(', '),
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  };
};

const LocationPickerModal = memo(({ isOpen, onClose, onSelectLocation }) => {
  const [searchQuery, setSearchQuery]       = useState('');
  const [searchResults, setSearchResults]   = useState([]);
  const [isSearching, setIsSearching]       = useState(false);
  const [searchError, setSearchError]       = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError]   = useState('');
  const searchTimer                         = useRef(null);

  const [recentLocations, setRecentLocations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recentLocations') || '[]'); }
    catch { return []; }
  });

  // Popular Zambia cities — shown when no search
  const popularCities = [
    { name: 'Lusaka',   country: 'Zambia', displayName: 'Lusaka, Zambia',   lat: -15.4167, lng: 28.2833 },
    { name: 'Kitwe',    country: 'Zambia', displayName: 'Kitwe, Zambia',    lat: -12.8024, lng: 28.2136 },
    { name: 'Ndola',    country: 'Zambia', displayName: 'Ndola, Zambia',    lat: -12.9587, lng: 28.6366 },
    { name: 'Kabwe',    country: 'Zambia', displayName: 'Kabwe, Zambia',    lat: -14.4469, lng: 28.4464 },
    { name: 'Chingola', country: 'Zambia', displayName: 'Chingola, Zambia', lat: -12.5289, lng: 27.8631 },
    { name: 'Mufulira', country: 'Zambia', displayName: 'Mufulira, Zambia', lat: -12.5497, lng: 28.2405 },
  ];

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setSearchError(''); return; }

    clearTimeout(searchTimer.current);
    setIsSearching(true);
    setSearchError('');

    searchTimer.current = setTimeout(async () => {
      try {
        const results = await searchNominatim(searchQuery);
        setSearchResults(results.map(formatResult));
      } catch {
        setSearchError('Search failed. Check your connection.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  
  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser.');
      return;
    }
    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lng } = position.coords;
          const data = await reverseGeocode(lat, lng);
          const addr = data.address || {};
          const cityName = addr.city || addr.town || addr.village || addr.county || 'Current Location';
          const country  = addr.country || '';

          const location = {
            name:        cityName,
            country,
            displayName: [cityName, addr.state, country].filter(Boolean).join(', '),
            lat,
            lng,
          };
          handleLocationSelect(location);
        } catch {
          // Fallback — use raw coords with generic name
          handleLocationSelect({
            name: 'Current Location',
            country: '',
            displayName: 'Current Location',
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (err) => {
        setIsGettingLocation(false);
        setLocationError(
          err.code === 1 ? 'Location permission denied. Please enable it in browser settings.'
          : 'Could not get your location. Try again.'
        );
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleLocationSelect = useCallback((location) => {
    const newRecent = [
      location,
      ...recentLocations.filter(l => l.name !== location.name)
    ].slice(0, 5);
    setRecentLocations(newRecent);
    localStorage.setItem('recentLocations', JSON.stringify(newRecent));
    onSelectLocation(location);
    onClose();
  }, [recentLocations, onSelectLocation, onClose]);

  const handleClearRecent = useCallback(() => {
    setRecentLocations([]);
    localStorage.removeItem('recentLocations');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">Select Location</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search any city worldwide..."
              className="flex-1 bg-transparent text-[15px] text-[#1C2A3A] placeholder-gray-400 outline-none font-['DM_Sans',sans-serif]"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Current Location */}
          <div className="px-6 py-4 border-b border-gray-100">
            <button
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 transition-colors disabled:opacity-50"
            >
              {isGettingLocation ? (
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"/>
              ) : (
                <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
                </svg>
              )}
              <div className="flex-1 text-left">
                <p className="text-[15px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                  {isGettingLocation ? 'Getting your location...' : 'Use Current Location'}
                </p>
                <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">Find properties near you</p>
              </div>
            </button>
            {locationError && (
              <p className="text-[12px] text-red-500 mt-2 px-1 font-['DM_Sans',sans-serif]">{locationError}</p>
            )}
          </div>

          {/* Search Results */}
          {searchQuery ? (
            <div className="px-6 py-3">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2 font-['DM_Sans',sans-serif]">
                Search Results
              </p>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"/>
                </div>
              ) : searchError ? (
                <p className="text-center text-[14px] text-red-400 py-6 font-['DM_Sans',sans-serif]">{searchError}</p>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((loc, i) => (
                    <button key={i} onClick={() => handleLocationSelect(loc)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] truncate">{loc.name}</p>
                        <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] truncate">{loc.displayName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[14px] text-gray-400 py-8 font-['DM_Sans',sans-serif]">No locations found</p>
              )}
            </div>
          ) : (
            <>
              {/* Recent Locations */}
              {recentLocations.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider font-['DM_Sans',sans-serif]">Recent</p>
                    <button onClick={handleClearRecent} className="text-[12px] font-semibold text-amber-500 hover:text-amber-600 font-['DM_Sans',sans-serif]">
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentLocations.map((loc, i) => (
                      <button key={i} onClick={() => handleLocationSelect(loc)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] truncate">{loc.name}</p>
                          {loc.country && <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">{loc.country}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Cities */}
              <div className="px-6 py-4">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2 font-['DM_Sans',sans-serif]">
                  Popular Cities
                </p>
                <div className="space-y-1">
                  {popularCities.map((city, i) => (
                    <button key={i} onClick={() => handleLocationSelect(city)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div className="flex-1">
                        <p className="text-[15px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">{city.name}</p>
                        <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">{city.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

LocationPickerModal.displayName = 'LocationPickerModal';
export default LocationPickerModal;
