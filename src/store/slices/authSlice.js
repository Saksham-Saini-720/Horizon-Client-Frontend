
import { createSlice } from '@reduxjs/toolkit';
import { getTokens, setTokens as saveTokens, clearTokens } from '../../utils/token';

// ─── Simple Token Validation (No JWT Checking) ────────────────────────────────

const validateToken = (token) => {
  // Simple check - just verify token exists and is not empty
  return !!(token && token.trim().length > 0);
};

// ─── Initial State ─────────────────────────────────────────────────────────────

const getInitialState = () => {
  try {
    console.log('🔄 Initializing auth state...');
    
    // Get tokens from your utility
    const { accessToken, refreshToken } = getTokens();
    
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    
    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    
    // Simple validation - just check if data exists
    if (accessToken && validateToken(accessToken) && user && user.email) {
      return {
        user,
        isAuthenticated: true,
      };
    } else {      
      // Don't clear tokens here - they might be valid
      // Just return logged out state
      return {
        user: null,
        isAuthenticated: false,
      };
    }
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false,
    };
  }
};

// ─── Auth Slice ────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // Login/Register success
    setAuth: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      
      state.user = user;
      state.isAuthenticated = true;
      
      // Sync to localStorage
      saveTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Logout
    clearAuth: (state) => {
      
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      clearTokens();
      localStorage.removeItem('user');
    },
    
    // Update user profile
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },

    // Sync auth state with localStorage
    syncAuthState: (state) => {
      try {
        
        const { accessToken } = getTokens();
        const userStr = localStorage.getItem('user');
        let user = null;
        
        if (userStr) {
          try {
            user = JSON.parse(userStr);
          } catch (e) {
            localStorage.removeItem('user');
          }
        }
        
        // Check if valid
        if (!accessToken || !validateToken(accessToken) || !user || !user.email) {
          
          // Token missing/invalid - force logout
          state.user = null;
          state.isAuthenticated = false;
          
          clearTokens();
          localStorage.removeItem('user');
        } else {
          
          // Valid - sync state
          state.user = user;
          state.isAuthenticated = true;
        }
      } catch (error) {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    
    // EMERGENCY: Force login from localStorage (for debugging)
    forceLoginFromStorage: (state) => {
      try {
        
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const { accessToken } = getTokens();
          
          if (user && accessToken) {
            state.user = user;
            state.isAuthenticated = true;
          }
        }
      } catch (error) {
        console.error('Error in forceLoginFromStorage:', error);
      }
    },
  },
});

export const { 
  setAuth, 
  clearAuth, 
  updateUser, 
  syncAuthState,
  forceLoginFromStorage  // NEW - for emergency use
} = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
