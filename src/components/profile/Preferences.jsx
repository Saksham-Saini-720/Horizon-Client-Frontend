
import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useUpdatePreferences, useUpdateNotifications } from '../../hooks/profile/useUpdateProfile';
import { useDebounce } from '../../hooks/utils/useDebounce';

const ALL_LOCATIONS = [
  'Kabulonga', 'Roma', 'Ibex Hill', 'Woodlands', 'Longacres',
  'Makeni', 'CBD', 'Sunningdale', 'Chelston', 'Avondale',
  'Rhodespark', 'Northmead', 'Chilenje', 'Lilayi', 'Leopards Hill',
  'Mass Media', 'Kalundu', 'Meanwood', 'Kafue Road', 'East Park',
];

// ── LocationSearch ──────────────────────────────────────────────────────────
const LocationSearch = memo(({ locations, onAdd }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.trim()
    ? ALL_LOCATIONS.filter(l => l.toLowerCase().includes(query.toLowerCase()) && !locations.includes(l))
    : ALL_LOCATIONS.filter(l => !locations.includes(l)).slice(0, 8);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-secondary transition-colors">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search areas..."
          className="flex-1 bg-transparent text-[15px] text-primary placeholder-gray-400 outline-none font-inter"
        />
        {query.length > 0 && (
          <button onClick={() => setQuery('')}>
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {filtered.map(loc => (
            <button key={loc} onClick={() => { onAdd(loc); setQuery(''); }}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-amber-50 hover:text-amber-700 active:bg-amber-100 text-[15px] font-medium text-gray-700 font-inter transition-colors">
              + {loc}
            </button>
          ))}
        </div>
      ) : query.trim() ? (
        <p className="text-[15px] text-gray-400 font-inter mt-3">No areas found for "{query}"</p>
      ) : null}
    </div>
  );
});
LocationSearch.displayName = 'LocationSearch';

// ── Toggle Switch ───────────────────────────────────────────────────────────
const Toggle = memo(({ value, onChange, disabled }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-secondary' : 'bg-gray-200'} disabled:opacity-50`}
  >
    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-0'}`}/>
  </button>
));
Toggle.displayName = 'Toggle';

// ── Saving indicator ────────────────────────────────────────────────────────
const SavingDot = ({ isPending }) => isPending ? (
  <div className="w-4 h-4 border-2 border-gray-300 border-t-secondary rounded-full animate-spin ml-auto"/>
) : null;

// ── Main Preferences ────────────────────────────────────────────────────────
const Preferences = memo(({ profile }) => {
  const updatePreferences  = useUpdatePreferences();
  const updateNotifications = useUpdateNotifications();

  // ── Local state ──
  const [contactPrefs, setContactPrefs] = useState({
    inApp: profile?.notifications?.inApp ?? true,
    email: profile?.notifications?.email ?? true,
    push:  profile?.notifications?.push  ?? false,
  });
  const [interestedIn, setInterestedIn] = useState(profile?.preferences?.interestedIn || []);
  const [locations,    setLocations]    = useState(profile?.preferences?.locations    || []);
  const [showSearch,   setShowSearch]   = useState(false);

  // Sync when profile loads
  useEffect(() => {
    if (!profile) return;
    setContactPrefs({
      inApp: profile.notifications?.inApp ?? true,
      email: profile.notifications?.email ?? true,
      push:  profile.notifications?.push  ?? false,
    });
    if (profile.preferences?.interestedIn) setInterestedIn(profile.preferences.interestedIn);
    if (profile.preferences?.locations)    setLocations(profile.preferences.locations);
  }, [profile?._id]);

  // ── Debounced auto-save for interestedIn ──
  const debouncedInterests = useDebounce(interestedIn, 1500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on first render — don't save stale initial value
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!profile) return;

    updatePreferences.mutate({
      propertyTypes: debouncedInterests,
      locations,
      budget:     profile.preferences?.budget,
      amenities:  profile.preferences?.amenities || [],
      purpose:    profile.preferences?.purpose   || 'both',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInterests]);  // Only trigger on debounced value change

  // ── Handlers ──
  const toggleContactPref = useCallback((key) => {
    setContactPrefs(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      updateNotifications.mutate(updated);
      return updated;
    });
  }, [updateNotifications]);

  const toggleInterest = useCallback((type) => {
    setInterestedIn(prev =>
      prev.includes(type) ? prev.filter(i => i !== type) : [...prev, type]
    );
  }, []);

  // Save immediately when location added/removed
  const saveLocations = useCallback((newLocations) => {
    updatePreferences.mutate({
      propertyTypes: interestedIn,
      locations:     newLocations,
      budget:        profile?.preferences?.budget,
      amenities:     profile?.preferences?.amenities || [],
      purpose:       profile?.preferences?.purpose   || 'both',
    });
  }, [interestedIn, profile, updatePreferences]);

  const addLocation = useCallback((loc) => {
    setLocations(prev => {
      if (prev.includes(loc)) return prev;
      const updated = [...prev, loc];
      saveLocations(updated);
      return updated;
    });
  }, [saveLocations]);

  const removeLocation = useCallback((loc) => {
    setLocations(prev => {
      const updated = prev.filter(l => l !== loc);
      saveLocations(updated);
      return updated;
    });
  }, [saveLocations]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[16px] font-semibold text-primary font-inter">Preferences</h2>
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l-4.2 4.2m13.2-5.2h-6m-6 0H1m13.2 5.2l-4.2-4.2m0-6L5.8 1.8"/>
        </svg>
      </div>

      <div className="space-y-4">

        {/* ── Contact Preferences ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-5">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"/>
            </svg>
            <h3 className="text-[15px] font-semibold text-primary font-inter">Notifications</h3>
            <SavingDot isPending={updateNotifications.isPending}/>
          </div>

          <div className="space-y-5">
            {[
              { key: 'inApp', label: 'In-App Notifications', desc: 'Get notified inside the app' },
              { key: 'email', label: 'Email Notifications',  desc: 'Receive updates via email' },
              { key: 'push',  label: 'Push Notifications',   desc: 'Browser push alerts' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-primary font-inter">{label}</p>
                  <p className="text-[12px] text-gray-400 font-inter">{desc}</p>
                </div>
                <Toggle
                  value={contactPrefs[key]}
                  onChange={() => toggleContactPref(key)}
                  disabled={updateNotifications.isPending}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Interested In ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <h3 className="text-[15px] font-semibold text-primary font-inter">Property Types</h3>
            <SavingDot isPending={updatePreferences.isPending}/>
          </div>

          <div className="flex flex-wrap gap-2">
            {['residential', 'commercial', 'land'].map(type => (
              <button
                key={type}
                onClick={() => toggleInterest(type)}
                disabled={updatePreferences.isPending}
                className={`px-5 py-2 rounded-full text-[15px] font-semibold font-inter transition-all capitalize ${
                  interestedIn.includes(type)
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 font-inter mt-3">
            Auto-saves after 1.5 seconds
          </p>
        </div>

        {/* ── Locations ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <h3 className="text-[15px] font-semibold text-primary font-inter">Preferred Areas</h3>
              <SavingDot isPending={updatePreferences.isPending}/>
            </div>
            <button
              onClick={() => setShowSearch(p => !p)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                showSearch ? 'bg-secondary text-white rotate-45' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>

          {locations.length === 0 && !showSearch ? (
            <p className="text-[15px] text-gray-400 font-inter">
              No areas added — tap + to add
            </p>
          ) : (
            locations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {locations.map(loc => (
                  <div key={loc} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-800 text-[15px] font-medium font-inter">
                    {loc}
                    <button
                      onClick={() => removeLocation(loc)}
                      disabled={updatePreferences.isPending}
                      className="w-4 h-4 rounded-full hover:bg-amber-200 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {showSearch && (
            <LocationSearch locations={locations} onAdd={addLocation}/>
          )}
        </div>

      </div>
    </div>
  );
});

Preferences.displayName = 'Preferences';
export default Preferences;
