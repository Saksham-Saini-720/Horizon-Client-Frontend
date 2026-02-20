
import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ─────────────────────────────────────────────────────────────

const getInitialState = () => {
  try {
    const saved = localStorage.getItem('savedProperties');
    return {
      propertyIds: saved ? JSON.parse(saved) : [],
    };
  } catch {
    return {
      propertyIds: [],
    };
  }
};

// ─── Saved Slice ───────────────────────────────────────────────────────────────

const savedSlice = createSlice({
  name: 'saved',
  initialState: getInitialState(),
  reducers: {
    // Toggle saved status
    toggleSaved: (state, action) => {
      const propertyId = action.payload;
      const index = state.propertyIds.indexOf(propertyId);
      
      if (index > -1) {
        // Remove
        state.propertyIds.splice(index, 1);
      } else {
        // Add
        state.propertyIds.push(propertyId);
      }
      
      // Sync to localStorage
      localStorage.setItem('savedProperties', JSON.stringify(state.propertyIds));
    },
    
    // Remove specific property
    removeSaved: (state, action) => {
      const propertyId = action.payload;
      state.propertyIds = state.propertyIds.filter(id => id !== propertyId);
      localStorage.setItem('savedProperties', JSON.stringify(state.propertyIds));
    },
    
    // Clear all saved
    clearAllSaved: (state) => {
      state.propertyIds = [];
      localStorage.removeItem('savedProperties');
    },
    
    // Bulk add (useful for syncing from server)
    addMultipleSaved: (state, action) => {
      const newIds = action.payload;
      state.propertyIds = [...new Set([...state.propertyIds, ...newIds])];
      localStorage.setItem('savedProperties', JSON.stringify(state.propertyIds));
    },
  },
});

export const { 
  toggleSaved, 
  removeSaved, 
  clearAllSaved, 
  addMultipleSaved 
} = savedSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectSavedIds = (state) => state.saved.propertyIds;
export const selectIsSaved = (propertyId) => (state) => 
  state.saved.propertyIds.includes(propertyId);
export const selectSavedCount = (state) => state.saved.propertyIds.length;

export default savedSlice.reducer;
