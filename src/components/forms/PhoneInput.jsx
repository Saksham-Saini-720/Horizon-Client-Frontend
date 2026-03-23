// src/components/forms/PhoneInput.jsx
import { useState, useRef, useEffect, useCallback, memo } from "react";

const COUNTRIES = [
  { code: "ZM", name: "Zambia",       dial: "+260", flag: "🇿🇲" },
  { code: "IN", name: "India",        dial: "+91",  flag: "🇮🇳" },
  { code: "US", name: "USA",          dial: "+1",   flag: "🇺🇸" },
  { code: "GB", name: "UK",           dial: "+44",  flag: "🇬🇧" },
  { code: "ZA", name: "South Africa", dial: "+27",  flag: "🇿🇦" },
  { code: "KE", name: "Kenya",        dial: "+254", flag: "🇰🇪" },
  { code: "NG", name: "Nigeria",      dial: "+234", flag: "🇳🇬" },
  { code: "GH", name: "Ghana",        dial: "+233", flag: "🇬🇭" },
  { code: "TZ", name: "Tanzania",     dial: "+255", flag: "🇹🇿" },
  { code: "UG", name: "Uganda",       dial: "+256", flag: "🇺🇬" },
  { code: "RW", name: "Rwanda",       dial: "+250", flag: "🇷🇼" },
  { code: "AE", name: "UAE",          dial: "+971", flag: "🇦🇪" },
  { code: "AU", name: "Australia",    dial: "+61",  flag: "🇦🇺" },
  { code: "CA", name: "Canada",       dial: "+1",   flag: "🇨🇦" },
  { code: "DE", name: "Germany",      dial: "+49",  flag: "🇩🇪" },
];

const PhoneInput = memo(({ inputRef, label, required, className = "", onChange }) => {
  const [selected, setSelected]   = useState(COUNTRIES[0]); // Zambia default
  const [number, setNumber]       = useState("");
  const [open, setOpen]           = useState(false);
  const [search, setSearch]       = useState("");
  const [error, setError]         = useState("");
  const dropdownRef               = useRef(null);
  const searchRef                 = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search)
      )
    : COUNTRIES;

  const validate = useCallback((val) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "Phone number is required";
    if (digits.length < 6) return "Phone number too short";
    if (digits.length > 12) return "Phone number too long";
    return "";
  }, []);

  const handleNumberChange = useCallback((e) => {
    // Only allow digits, spaces, dashes
    const val = e.target.value.replace(/[^\d\s-]/g, "");
    setNumber(val);
    setError("");

    // Combine dial code + number for parent
    const full = `${selected.dial}${val.replace(/\D/g, "")}`;
    if (inputRef) inputRef.current = { value: full }; // expose as ref-compatible
    onChange?.(full);
  }, [selected, inputRef, onChange]);

  const handleSelect = useCallback((country) => {
    setSelected(country);
    setOpen(false);
    setSearch("");
    // Update combined value
    const full = `${country.dial}${number.replace(/\D/g, "")}`;
    if (inputRef) inputRef.current = { value: full };
    onChange?.(full);
  }, [number, inputRef, onChange]);

  const handleBlur = useCallback(() => {
    setError(validate(number));
  }, [number, validate]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-[16px] font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className={`flex rounded-xl border overflow-visible transition-colors ${
        error ? "border-red-300" : "border-gray-200 focus-within:border-gray-800"
      }`}>

        {/* Country selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen(p => !p)}
            className="flex items-center gap-1.5 px-3 py-3.5 bg-gray-50 border-r border-gray-200 hover:bg-gray-100 transition-colors rounded-l-xl h-full"
          >
            <span className="text-[18px]">{selected.flag}</span>
            <span className="text-[14px] font-semibold text-gray-700">{selected.dial}</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search country..."
                    className="flex-1 bg-transparent text-[13px] text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* List */}
              <div className="max-h-52 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-[13px] text-gray-400 py-4">No countries found</p>
                ) : filtered.map(c => (
                  <button
                    key={c.code + c.dial}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                      selected.code === c.code && selected.dial === c.dial ? 'bg-amber-50' : ''
                    }`}
                  >
                    <span className="text-[18px]">{c.flag}</span>
                    <span className="flex-1 text-[14px] text-gray-700">{c.name}</span>
                    <span className="text-[13px] font-semibold text-gray-400">{c.dial}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <input
          type="tel"
          value={number}
          onChange={handleNumberChange}
          onBlur={handleBlur}
          placeholder="97X XXX XXX"
          className="flex-1 px-4 py-3.5 text-[16px] text-gray-800 placeholder-gray-400 outline-none rounded-r-xl bg-white"
        />
      </div>

      {error && (
        <p className="text-[13px] text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';
export default PhoneInput;
