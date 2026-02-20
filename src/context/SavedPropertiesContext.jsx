
import { createContext, useState, useEffect, useCallback, useMemo } from "react";

const SavedPropertiesContext = createContext(null);

const STORAGE_KEY = "savedProperties";

// ─── Load from localStorage ───────────────────────────────────────────────────

const loadSaved = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SavedPropertiesProvider({ children }) {
  // Saved property IDs only — lightweight
  const [savedIds, setSavedIds] = useState(loadSaved);

  // Sync to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const toggleSaved = useCallback((propertyId) => {
    setSavedIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)  // Remove
        : [...prev, propertyId]                    // Add
    );
  }, []);

  const isSaved = useCallback((propertyId) => {
    return savedIds.includes(propertyId);
  }, [savedIds]);

  const removeSaved = useCallback((propertyId) => {
    setSavedIds((prev) => prev.filter((id) => id !== propertyId));
  }, []);

  const clearAll = useCallback(() => {
    setSavedIds([]);
  }, []);

  // Memoize context value — prevent unnecessary re-renders
  const value = useMemo(() => ({
    savedIds,
    toggleSaved,
    isSaved,
    removeSaved,
    clearAll,
    count: savedIds.length,
  }), [savedIds, toggleSaved, isSaved, removeSaved, clearAll]);

  return (
    <SavedPropertiesContext.Provider value={value}>
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export default SavedPropertiesContext;
