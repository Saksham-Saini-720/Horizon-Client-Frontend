
import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  searchQuery: '',
  propertyType: 'all', // 'all' | 'buy' | 'rent'
  priceRange: { min: 0, max: 10000000 },
  bedrooms: null, // null | 1 | 2 | 3 | 4 | 5+
  bathrooms: null,
  location: '',
  sortBy: 'newest', // 'newest' | 'price-low' | 'price-high' | 'popular'
};

// ─── Filters Slice ─────────────────────────────────────────────────────────────

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Set property type (buy/rent)
    setPropertyType: (state, action) => {
      state.propertyType = action.payload;
    },
    
    // Set price range
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    
    // Set bedrooms filter
    setBedrooms: (state, action) => {
      state.bedrooms = action.payload;
    },
    
    // Set bathrooms filter
    setBathrooms: (state, action) => {
      state.bathrooms = action.payload;
    },
    
    // Set location filter
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    
    // Set sort order
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    // Reset all filters
    resetFilters: (state) => {
      return initialState;
    },
    
    // Set multiple filters at once
    setMultipleFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setSearchQuery,
  setPropertyType,
  setPriceRange,
  setBedrooms,
  setBathrooms,
  setLocation,
  setSortBy,
  resetFilters,
  setMultipleFilters,
} = filtersSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectFilters = (state) => state.filters;
export const selectSearchQuery = (state) => state.filters.searchQuery;
export const selectPropertyType = (state) => state.filters.propertyType;
export const selectPriceRange = (state) => state.filters.priceRange;
export const selectBedrooms = (state) => state.filters.bedrooms;
export const selectSortBy = (state) => state.filters.sortBy;

// Computed selector - active filters count
export const selectActiveFiltersCount = (state) => {
  let count = 0;
  if (state.filters.propertyType !== 'all') count++;
  if (state.filters.bedrooms !== null) count++;
  if (state.filters.bathrooms !== null) count++;
  if (state.filters.location !== '') count++;
  if (state.filters.priceRange.min > 0 || state.filters.priceRange.max < 10000000) count++;
  return count;
};

export default filtersSlice.reducer;
