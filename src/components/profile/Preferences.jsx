
import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useUpdatePreferences, useUpdateNotifications } from '../../hooks/profile/useUpdateProfile';
import { useDebounce } from '../../hooks/utils/useDebounce';

// ─── Zambia location suggestions ─────────────────────────────────────────────

const ALL_LOCATIONS = [
  'Kabulonga', 'Roma', 'Ibex Hill', 'Woodlands', 'Longacres',
  'Makeni', 'CBD', 'Sunningdale', 'Chelston', 'Avondale',
  'Rhodespark', 'Northmead', 'Chilenje', 'Lilayi', 'Leopards Hill',
  'Mass Media', 'Kalundu', 'Meanwood', 'Kafue Road', 'East Park',
];

// ─── LocationSearch sub-component ────────────────────────────────────────────

const LocationSearch = memo(({ locations, onAdd, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? ALL_LOCATIONS.filter(
        (l) =>
          l.toLowerCase().includes(query.toLowerCase()) &&
          !locations.includes(l)
      )
    : ALL_LOCATIONS.filter((l) => !locations.includes(l)).slice(0, 8);

  const handleAdd = useCallback((loc) => {
    onAdd(loc);
    setQuery('');
    inputRef.current?.focus();
  }, [onAdd]);

  return (
    <div className="mt-3">
      {/* Search input */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-amber-400 transition-colors">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search areas..."
          className="flex-1 bg-transparent text-[14px] text-[#1C2A3A] placeholder-gray-400 outline-none font-['DM_Sans',sans-serif]"
        />
        {query.length > 0 && (
          <button onClick={() => setQuery('')} className="p-0.5">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filtered.map((loc) => (
            <button
              key={loc}
              onClick={() => handleAdd(loc)}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-[13px] font-medium text-gray-700 font-['DM_Sans',sans-serif] transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && query.trim() && (
        <p className="text-[13px] text-gray-400 font-['DM_Sans',sans-serif] mt-3">
          No areas found for "{query}"
        </p>
      )}
    </div>
  );
});

LocationSearch.displayName = 'LocationSearch';

// ─── Main Preferences Component ──────────────────────────────────────────────

const Preferences = memo(({ profile }) => {
  const updatePreferences = useUpdatePreferences();
  const updateNotifications = useUpdateNotifications();

  const [contactPrefs, setContactPrefs] = useState({
    inApp: profile?.notifications?.inApp ?? true,
    email: profile?.notifications?.email ?? true,
    push: profile?.notifications?.push ?? false,
  });

  const [interestedIn, setInterestedIn] = useState(
    profile?.preferences?.interestedIn || []
  );

  const [locations, setLocations] = useState(
    profile?.preferences?.locations || []
  );

  const [showSearch, setShowSearch] = useState(false);

  const debouncedInterests = useDebounce(interestedIn, 1500);

  // Sync from profile prop
  useEffect(() => {
    if (!profile) return;
    setContactPrefs({
      inApp: profile.notifications?.inApp ?? true,
      email: profile.notifications?.email ?? true,
      push: profile.notifications?.push ?? false,
    });
    if (profile.preferences?.interestedIn) setInterestedIn(profile.preferences.interestedIn);
    if (profile.preferences?.locations) setLocations(profile.preferences.locations);
  }, [profile?._id]);

  // Auto-save interests
  useEffect(() => {
    if (!profile || debouncedInterests.length === 0) return;
    const current = profile.preferences?.interestedIn || [];
    if (JSON.stringify([...current].sort()) !== JSON.stringify([...debouncedInterests].sort())) {
      updatePreferences.mutate({
        propertyTypes: debouncedInterests,
        locations,
        budget: profile.preferences?.budget,
        amenities: profile.preferences?.amenities || [],
        purpose: profile.preferences?.purpose || 'both',
      });
    }
  }, [debouncedInterests]);

  // Locations are saved immediately in addLocation/removeLocation callbacks

  const toggleContactPref = useCallback((pref) => {
    const newPrefs = (prev) => ({ ...prev, [pref]: !prev[pref] });
    setContactPrefs((prev) => {
      const updated = newPrefs(prev);
      updateNotifications.mutate(updated);
      return updated;
    });
  }, [updateNotifications]);

  const toggleInterest = useCallback((interest) => {
    setInterestedIn((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }, []);

  const addLocation = useCallback((loc) => {
    setLocations((prev) => {
      if (prev.includes(loc)) return prev;
      const updated = [...prev, loc];
      // Save immediately — no debounce for discrete add action
      updatePreferences.mutate({
        propertyTypes: interestedIn,
        locations: updated,
        budget: profile?.preferences?.budget,
        amenities: profile?.preferences?.amenities || [],
        purpose: profile?.preferences?.purpose || 'both',
      });
      return updated;
    });
  }, [interestedIn, profile, updatePreferences]);

  const removeLocation = useCallback((loc) => {
    setLocations((prev) => {
      const updated = prev.filter((l) => l !== loc);
      // Save immediately — no debounce for discrete remove action
      updatePreferences.mutate({
        propertyTypes: interestedIn,
        locations: updated,
        budget: profile?.preferences?.budget,
        amenities: profile?.preferences?.amenities || [],
        purpose: profile?.preferences?.purpose || 'both',
      });
      return updated;
    });
  }, [interestedIn, profile, updatePreferences]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">Preferences</h2>
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l-4.2 4.2m13.2-5.2h-6m-6 0H1m13.2 5.2l-4.2-4.2m0-6L5.8 1.8" />
        </svg>
      </div>

      <div className="border-t border-gray-100">

        {/* Contact Preferences */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl px-6 py-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">Contact Preferences</h3>
          </div>

          <div className="space-y-6">
            {[
              { key: 'inApp', label: 'In-App' },
              { key: 'email', label: 'Email' },
              { key: 'push', label: 'Push' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[14px] text-gray-700 font-['DM_Sans',sans-serif]">{label}</span>
                <button
                  onClick={() => toggleContactPref(key)}
                  disabled={updateNotifications.isPending}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    contactPrefs[key] ? 'bg-[#1C2A3A]' : 'bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    contactPrefs[key] ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interested In */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">Interested In</h3>
            {updatePreferences.isPending && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1C2A3A] rounded-full animate-spin ml-auto" />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {['residential', 'commercial', 'land'].map((type) => (
              <button
                key={type}
                onClick={() => toggleInterest(type)}
                disabled={updatePreferences.isPending}
                className={`px-6 py-2.5 rounded-full text-[14px] font-semibold font-['DM_Sans',sans-serif] transition-all capitalize ${
                  interestedIn.includes(type)
                    ? 'bg-[#1C2A3A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl px-6 py-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">Locations</h3>
              {updatePreferences.isPending && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1C2A3A] rounded-full animate-spin" />
              )}
            </div>

            {/* + button */}
            <button
              onClick={() => setShowSearch((p) => !p)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                showSearch
                  ? 'bg-[#1C2A3A] text-white rotate-45'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          {/* Added locations chips */}
          {locations.length === 0 && !showSearch ? (
            <p className="text-[13px] text-gray-400 font-['DM_Sans',sans-serif]">No locations added</p>
          ) : (
            locations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {locations.map((loc) => (
                  <div
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-[13px] font-medium font-['DM_Sans',sans-serif]"
                  >
                    {loc}
                    <button
                      onClick={() => removeLocation(loc)}
                      disabled={updatePreferences.isPending}
                      className="w-4 h-4 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Search bar + suggestions */}
          {showSearch && (
            <LocationSearch
              locations={locations}
              onAdd={addLocation}
              onClose={() => setShowSearch(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
});

Preferences.displayName = 'Preferences';

export default Preferences;
