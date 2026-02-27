
import { createSlice } from '@reduxjs/toolkit';
import { getTokens, setTokens as saveTokens, clearTokens } from '../../utils/token';

// ─── Initial State ─────────────────────────────────────────────────────────────

const getInitialState = () => {
  try {
    // Get tokens
    const { accessToken } = getTokens();
    
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    let user = null;
    
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem('user'); // Clear bad data
      }
    }
    
    // Development mode: Auto-add mock user if none exists
    if (import.meta.env.DEV) {
      if (!user || !user.email) {
        // console.log('🔧 Development mode: Loading mock user data');
        user = MOCK_USER;
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
        
        // Also set a mock token if missing
        if (!accessToken) {
          // console.log('🔧 Development mode: Setting mock tokens');
          saveTokens('mock-access-token', 'mock-refresh-token');
        }
      }
    }
    
    const isAuthenticated = !!(accessToken && user && user.email);
    
    // console.log('🔐 Auth State Initialized:', { 
    //   hasToken: !!accessToken, 
    //   hasUser: !!user, 
    //   userEmail: user?.email,
    //   isAuthenticated 
    // });
    
    return {
      user,
      isAuthenticated,
    };
  } catch (error) {
    // console.error('❌ Error initializing auth state:', error);
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
      
      // console.log('✅ setAuth called with:', { user, accessToken });
      
      state.user = user;
      state.isAuthenticated = true;
      
      // Sync to localStorage
      saveTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Logout
    clearAuth: (state) => {
      // console.log('🚪 Logging out - clearing auth state');
      
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      clearTokens();
      localStorage.removeItem('user');
    },
    
    // Update user profile
    updateUser: (state, action) => {
      if (state.user) {
        // console.log('📝 Updating user:', action.payload);
        
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
