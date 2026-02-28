
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Import action creators
import { clearAuth, updateUser } from '../../store/slices/authSlice';
import {
  toggleSaved,
  removeSaved,
  clearAllSaved,
  setNote,
  deleteNote,
} from '../../store/slices/savedSlice';
import {
  setSearchQuery,
  setPropertyType,
  setPriceRange,
  setBedrooms,
  resetFilters,
} from '../../store/slices/filtersSlice';
import {
  openFilterModal,
  closeFilterModal,
  openLocationModal,
  closeLocationModal,
  openPriceModal,
  closePriceModal,
  openBedroomsModal,
  closeBedroomsModal,
  closeAllModals,
} from '../../store/slices/uiSlice';

// Import selectors
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
} from '../../store/slices/authSlice';
import {
  selectSavedIds,
  selectIsSaved,
  selectSavedCount,
  selectAllNotes,
  selectPropertyNote,
} from '../../store/slices/savedSlice';
import {
  selectFilters,
  selectSearchQuery,
  selectPropertyType,
  selectActiveFiltersCount,
} from '../../store/slices/filtersSlice';
import {
  selectShowFilterModal,
  selectShowLocationModal,
  selectShowPriceModal,
  selectShowBedroomsModal,
} from '../../store/slices/uiSlice';

// ─── Auth Hooks ────────────────────────────────────────────────────────────────

export function useAuth() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const logout = useCallback(() => {
    dispatch(clearAuth());
    queryClient.clear();
  }, [dispatch, queryClient]);

  const updateProfile = useCallback((data) => {
    dispatch(updateUser(data));
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    logout,
    updateProfile,
  };
}

// ─── Saved Properties Hooks ────────────────────────────────────────────────────

export function useSaved() {
  const dispatch = useDispatch();

  const savedIds = useSelector(selectSavedIds);
  const count = useSelector(selectSavedCount);
  const allNotes = useSelector(selectAllNotes);

  const toggle = useCallback((propertyId) => {
    dispatch(toggleSaved(propertyId));
  }, [dispatch]);

  const remove = useCallback((propertyId) => {
    dispatch(removeSaved(propertyId));
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch(clearAllSaved());
  }, [dispatch]);

  const isSaved = useCallback((propertyId) => {
    return savedIds.includes(propertyId);
  }, [savedIds]);

  // Note actions
  const saveNote = useCallback((propertyId, note) => {
    dispatch(setNote({ propertyId, note }));
  }, [dispatch]);

  const removeNote = useCallback((propertyId) => {
    dispatch(deleteNote(propertyId));
  }, [dispatch]);

  return {
    savedIds,
    count,
    allNotes,
    toggleSaved: toggle,
    removeSaved: remove,
    clearAll,
    isSaved,
    saveNote,
    removeNote,
  };
}

// ─── Filters Hooks ─────────────────────────────────────────────────────────────

export function useFilters() {
  const dispatch = useDispatch();

  const filters = useSelector(selectFilters);
  const searchQuery = useSelector(selectSearchQuery);
  const propertyType = useSelector(selectPropertyType);
  const activeCount = useSelector(selectActiveFiltersCount);

  const setQuery = useCallback((query) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const setType = useCallback((type) => {
    dispatch(setPropertyType(type));
  }, [dispatch]);

  const setPrices = useCallback((range) => {
    dispatch(setPriceRange(range));
  }, [dispatch]);

  const setBeds = useCallback((beds) => {
    dispatch(setBedrooms(beds));
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    filters,
    searchQuery,
    propertyType,
    activeCount,
    setSearchQuery: setQuery,
    setPropertyType: setType,
    setPriceRange: setPrices,
    setBedrooms: setBeds,
    resetFilters: reset,
  };
}

// ─── UI Hooks ──────────────────────────────────────────────────────────────────

export function useUI() {
  const dispatch = useDispatch();

  const modals = useSelector((state) => ({
    filter: selectShowFilterModal(state),
    location: selectShowLocationModal(state),
    price: selectShowPriceModal(state),
    bedrooms: selectShowBedroomsModal(state),
  }));

  const openModal = useCallback((modalName) => {
    const actionMap = {
      filter: openFilterModal,
      location: openLocationModal,
      price: openPriceModal,
      bedrooms: openBedroomsModal,
    };
    const action = actionMap[modalName];
    if (action) dispatch(action());
  }, [dispatch]);

  const closeModal = useCallback((modalName) => {
    const actionMap = {
      filter: closeFilterModal,
      location: closeLocationModal,
      price: closePriceModal,
      bedrooms: closeBedroomsModal,
    };
    const action = actionMap[modalName];
    if (action) dispatch(action());
  }, [dispatch]);

  const closeAll = useCallback(() => {
    dispatch(closeAllModals());
  }, [dispatch]);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals: closeAll,
  };
}
