
import { createSlice } from '@reduxjs/toolkit';
import { getTokens, setTokens as saveTokens, clearTokens } from '../../utils/token';

// ─── Initial State ─────────────────────────────────────────────────────────────

const getInitialState = () => {
  const { accessToken } = getTokens();
  const userStr = localStorage.getItem('user');
  
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      user,
      isAuthenticated: !!accessToken && !!user,
    };
  } catch {
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
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
