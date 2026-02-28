
import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ─────────────────────────────────────────────────────────────

const getInitialState = () => {
  try {
    const saved = localStorage.getItem('savedProperties');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Handle both old format (array) and new format (object)
      if (Array.isArray(parsed)) {
        // Old format: just array of IDs → Migrate to new format
        return {
          propertyIds: parsed,
          notes: {},
        };
      } else {
        // New format: { propertyIds: [...], notes: {...} }
        return {
          propertyIds: parsed.propertyIds || [],
          notes: parsed.notes || {},
        };
      }
    }
  } catch (error) {
    console.error('Error loading saved properties:', error);
  }
  
  // Default state
  return {
    propertyIds: [],
    notes: {},
  };
};

// ─── Saved Slice ───────────────────────────────────────────────────────────────

const savedSlice = createSlice({
  name: 'saved',
  initialState: getInitialState(),
  reducers: {
    // Toggle saved status
    toggleSaved: (state, action) => {
      const propertyId = action.payload;
      
      // Safety check
      if (!Array.isArray(state.propertyIds)) {
        state.propertyIds = [];
      }
      
      const index = state.propertyIds.indexOf(propertyId);
      
      if (index > -1) {
        // Remove from saved
        state.propertyIds.splice(index, 1);
        
        // Also remove note if exists
        if (state.notes && state.notes[propertyId]) {
          delete state.notes[propertyId];
        }
      } else {
        // Add to saved
        state.propertyIds.push(propertyId);
      }
      
      // Sync to localStorage (new format)
      localStorage.setItem('savedProperties', JSON.stringify({
        propertyIds: state.propertyIds,
        notes: state.notes || {},
      }));
    },
    
    // Remove specific property
    removeSaved: (state, action) => {
      const propertyId = action.payload;
      
      // Safety check
      if (!Array.isArray(state.propertyIds)) {
        state.propertyIds = [];
        return;
      }
      
      state.propertyIds = state.propertyIds.filter(id => id !== propertyId);
      
      // Also remove note if exists
      if (state.notes && state.notes[propertyId]) {
        delete state.notes[propertyId];
      }
      
      localStorage.setItem('savedProperties', JSON.stringify({
        propertyIds: state.propertyIds,
        notes: state.notes || {},
      }));
    },
    
    // Clear all saved
    clearAllSaved: (state) => {
      state.propertyIds = [];
      state.notes = {};
      localStorage.removeItem('savedProperties');
    },
    
    // Bulk add (useful for syncing from server)
    addMultipleSaved: (state, action) => {
      const newIds = action.payload;
      
      // Safety check
      if (!Array.isArray(state.propertyIds)) {
        state.propertyIds = [];
      }
      
      state.propertyIds = [...new Set([...state.propertyIds, ...newIds])];
      localStorage.setItem('savedProperties', JSON.stringify({
        propertyIds: state.propertyIds,
        notes: state.notes || {},
      }));
    },

    // ─── NEW: Note Actions ─────────────────────────────────────────────────────

    // Set/update note for a property
    setNote: (state, action) => {
      const { propertyId, note } = action.payload;
      
      // Initialize notes if undefined
      if (!state.notes) {
        state.notes = {};
      }
      
      if (note && note.trim()) {
        state.notes[propertyId] = note.trim();
      } else {
        // If empty, delete the note
        delete state.notes[propertyId];
      }

      // Sync to localStorage
      localStorage.setItem('savedProperties', JSON.stringify({
        propertyIds: state.propertyIds || [],
        notes: state.notes,
      }));
    },

    // Delete note for a property
    deleteNote: (state, action) => {
      const propertyId = action.payload;
      
      if (state.notes && state.notes[propertyId]) {
        delete state.notes[propertyId];

        // Sync to localStorage
        localStorage.setItem('savedProperties', JSON.stringify({
          propertyIds: state.propertyIds || [],
          notes: state.notes,
        }));
      }
    },
  },
});

export const { 
  toggleSaved, 
  removeSaved, 
  clearAllSaved, 
  addMultipleSaved,
  setNote,      // NEW
  deleteNote,   // NEW
} = savedSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

// Original selectors (unchanged)
export const selectSavedIds = (state) => state.saved?.propertyIds || [];
export const selectIsSaved = (propertyId) => (state) => 
  (state.saved?.propertyIds || []).includes(propertyId);
export const selectSavedCount = (state) => state.saved?.propertyIds?.length || 0;

// NEW: Note selectors
export const selectAllNotes = (state) => state.saved?.notes || {};
export const selectPropertyNote = (propertyId) => (state) => 
  state.saved?.notes?.[propertyId] || '';

export default savedSlice.reducer;
