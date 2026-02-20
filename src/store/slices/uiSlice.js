
import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  // Modals
  showFilterModal: false,
  showLocationModal: false,
  showPriceModal: false,
  showBedroomsModal: false,
  
  // Sidebars
  showMobileMenu: false,
  showNotifications: false,
  
  // Loading states
  isPageLoading: false,
  
  // Toasts/Notifications (stack)
  notifications: [],
};

// ─── UI Slice ──────────────────────────────────────────────────────────────────

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ── Modals ──────────────────────────────────────────────────────────────
    
    openFilterModal: (state) => {
      state.showFilterModal = true;
    },
    
    closeFilterModal: (state) => {
      state.showFilterModal = false;
    },
    
    openLocationModal: (state) => {
      state.showLocationModal = true;
    },
    
    closeLocationModal: (state) => {
      state.showLocationModal = false;
    },
    
    openPriceModal: (state) => {
      state.showPriceModal = true;
    },
    
    closePriceModal: (state) => {
      state.showPriceModal = false;
    },
    
    openBedroomsModal: (state) => {
      state.showBedroomsModal = true;
    },
    
    closeBedroomsModal: (state) => {
      state.showBedroomsModal = false;
    },
    
    // Close all modals
    closeAllModals: (state) => {
      state.showFilterModal = false;
      state.showLocationModal = false;
      state.showPriceModal = false;
      state.showBedroomsModal = false;
    },
    
    // ── Sidebars ────────────────────────────────────────────────────────────
    
    toggleMobileMenu: (state) => {
      state.showMobileMenu = !state.showMobileMenu;
    },
    
    closeMobileMenu: (state) => {
      state.showMobileMenu = false;
    },
    
    toggleNotifications: (state) => {
      state.showNotifications = !state.showNotifications;
    },
    
    // ── Loading ─────────────────────────────────────────────────────────────
    
    setPageLoading: (state, action) => {
      state.isPageLoading = action.payload;
    },
    
    // ── Notifications ───────────────────────────────────────────────────────
    
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info', // 'success' | 'error' | 'warning' | 'info'
        message: '',
        duration: 4000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  // Modals
  openFilterModal,
  closeFilterModal,
  openLocationModal,
  closeLocationModal,
  openPriceModal,
  closePriceModal,
  openBedroomsModal,
  closeBedroomsModal,
  closeAllModals,
  
  // Sidebars
  toggleMobileMenu,
  closeMobileMenu,
  toggleNotifications,
  
  // Loading
  setPageLoading,
  
  // Notifications
  addNotification,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectShowFilterModal = (state) => state.ui.showFilterModal;
export const selectShowLocationModal = (state) => state.ui.showLocationModal;
export const selectShowPriceModal = (state) => state.ui.showPriceModal;
export const selectShowBedroomsModal = (state) => state.ui.showBedroomsModal;
export const selectShowMobileMenu = (state) => state.ui.showMobileMenu;
export const selectIsPageLoading = (state) => state.ui.isPageLoading;
export const selectNotifications = (state) => state.ui.notifications;

export default uiSlice.reducer;
