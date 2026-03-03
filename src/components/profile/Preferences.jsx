
import { memo, useState } from 'react';

/**
 * Preferences Component
 * User preferences and settings
 */
const Preferences = memo(() => {
  // Preferences state
  const [contactPrefs, setContactPrefs] = useState({
    inApp: true,
    email: true,
    push: false
  });

  const [interestedIn, setInterestedIn] = useState(['residential', 'rentals']);
  const [locations, setLocations] = useState(['Kabulonga', 'Roma', 'Woodlands']);

  // Toggle contact preference
  const toggleContactPref = (pref) => {
    setContactPrefs(prev => ({ ...prev, [pref]: !prev[pref] }));
  };

  // Toggle interest
  const toggleInterest = (interest) => {
    setInterestedIn(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Remove location
  const removeLocation = (location) => {
    setLocations(prev => prev.filter(l => l !== location));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
          Preferences
        </h2>
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l-4.2 4.2m13.2-5.2h-6m-6 0H1m13.2 5.2l-4.2-4.2m0-6L5.8 1.8" />
        </svg>
      </div>
      <div className="border-t border-gray-100 ">

      {/* Contact Preferences */}
      <div className="mb-6 bg-white rounded-2xl shadow-xl px-6 py-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
            Contact Preferences
          </h3>
        </div>

        <div className="space-y-6 ">
          {/* In-App */}
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-gray-700 font-['DM_Sans',sans-serif]">
              In-App
            </span>
            <button
              onClick={() => toggleContactPref('inApp')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                contactPrefs.inApp ? 'bg-[#1C2A3A]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  contactPrefs.inApp ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-gray-700 font-['DM_Sans',sans-serif]">
              Email
            </span>
            <button
              onClick={() => toggleContactPref('email')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                contactPrefs.email ? 'bg-[#1C2A3A]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  contactPrefs.email ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Push */}
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-gray-700 font-['DM_Sans',sans-serif]">
              Push
            </span>
            <button
              onClick={() => toggleContactPref('push')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                contactPrefs.push ? 'bg-[#1C2A3A]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  contactPrefs.push ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Interested In */}
      <div className="mb-6  bg-white rounded-2xl shadow-xl px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
            Interested In
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {['residential', 'commercial', 'rentals'].map((type) => (
            <button
              key={type}
              onClick={() => toggleInterest(type)}
              className={`px-6 py-2.5 rounded-full text-[14px] font-semibold font-['DM_Sans',sans-serif] transition-all capitalize ${
                interestedIn.includes(type)
                  ? 'bg-[#1C2A3A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div className="mb-6  bg-white rounded-2xl shadow-xl px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              Locations
            </h3>
          </div>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <div
              key={location}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-[13px] font-medium font-['DM_Sans',sans-serif]"
            >
              {location}
              <button
                onClick={() => removeLocation(location)}
                className="w-4 h-4 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
});

Preferences.displayName = 'Preferences';

export default Preferences;
