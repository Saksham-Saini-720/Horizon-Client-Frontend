// src/hooks/useRecentSearches.js
import { useState, useCallback } from "react";

const STORAGE_KEY = "recentSearches";
const MAX_RECENT  = 5;

// localStorage se safely read karo
const loadFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveToStorage = (searches) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
};

// ─────────────────────────────────────────────────────────────────────────────

export default function useRecentSearches() {
  const [searches, setSearches] = useState(loadFromStorage);

  const add = useCallback((query) => {
    setSearches((prev) => {
      // Duplicate remove, naya top pe, max 5
      const updated = [query, ...prev.filter((s) => s !== query)].slice(0, MAX_RECENT);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((query) => {
    setSearches((prev) => {
      const updated = prev.filter((s) => s !== query);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { searches, add, remove, clearAll };
}
