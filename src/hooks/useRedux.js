
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

// ─── Auth Hooks ────────────────────────────────────────────────────────────────

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const logout = useCallback(() => {
    dispatch({ type: 'auth/clearAuth' });
  }, [dispatch]);
  
  return {
    user,
    isAuthenticated,
    logout,
  };
}

// ─── Saved Properties Hooks ────────────────────────────────────────────────────

export function useSaved() {
  const dispatch = useDispatch();
  const savedIds = useSelector((state) => state.saved.propertyIds);
  const count = useSelector((state) => state.saved.propertyIds.length);
  
  const toggleSaved = useCallback((propertyId) => {
    dispatch({ type: 'saved/toggleSaved', payload: propertyId });
  }, [dispatch]);
  
  const removeSaved = useCallback((propertyId) => {
    dispatch({ type: 'saved/removeSaved', payload: propertyId });
  }, [dispatch]);
  
  const clearAll = useCallback(() => {
    dispatch({ type: 'saved/clearAllSaved' });
  }, [dispatch]);
  
  const isSaved = useCallback((propertyId) => {
    return savedIds.includes(propertyId);
  }, [savedIds]);
  
  return {
    savedIds,
    count,
    toggleSaved,
    removeSaved,
    clearAll,
    isSaved,
  };
}

// ─── Filters Hooks ─────────────────────────────────────────────────────────────

export function useFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const activeCount = useSelector((state) => {
    let count = 0;
    if (state.filters.propertyType !== 'all') count++;
    if (state.filters.bedrooms !== null) count++;
    if (state.filters.bathrooms !== null) count++;
    if (state.filters.location !== '') count++;
    if (state.filters.priceRange.min > 0 || state.filters.priceRange.max < 10000000) count++;
    return count;
  });
  
  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'filters/setSearchQuery', payload: query });
  }, [dispatch]);
  
  const setPropertyType = useCallback((type) => {
    dispatch({ type: 'filters/setPropertyType', payload: type });
  }, [dispatch]);
  
  const setPriceRange = useCallback((range) => {
    dispatch({ type: 'filters/setPriceRange', payload: range });
  }, [dispatch]);
  
  const setBedrooms = useCallback((beds) => {
    dispatch({ type: 'filters/setBedrooms', payload: beds });
  }, [dispatch]);
  
  const resetFilters = useCallback(() => {
    dispatch({ type: 'filters/resetFilters' });
  }, [dispatch]);
  
  return {
    filters,
    activeCount,
    setSearchQuery,
    setPropertyType,
    setPriceRange,
    setBedrooms,
    resetFilters,
  };
}

// ─── UI Hooks ──────────────────────────────────────────────────────────────────

export function useUI() {
  const dispatch = useDispatch();
  
  const modals = useSelector((state) => ({
    filter: state.ui.showFilterModal,
    location: state.ui.showLocationModal,
    price: state.ui.showPriceModal,
    bedrooms: state.ui.showBedroomsModal,
  }));
  
  const openModal = useCallback((modalName) => {
    const actionMap = {
      filter: 'ui/openFilterModal',
      location: 'ui/openLocationModal',
      price: 'ui/openPriceModal',
      bedrooms: 'ui/openBedroomsModal',
    };
    dispatch({ type: actionMap[modalName] });
  }, [dispatch]);
  
  const closeModal = useCallback((modalName) => {
    const actionMap = {
      filter: 'ui/closeFilterModal',
      location: 'ui/closeLocationModal',
      price: 'ui/closePriceModal',
      bedrooms: 'ui/closeBedroomsModal',
    };
    dispatch({ type: actionMap[modalName] });
  }, [dispatch]);
  
  const closeAllModals = useCallback(() => {
    dispatch({ type: 'ui/closeAllModals' });
  }, [dispatch]);
  
  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
}
