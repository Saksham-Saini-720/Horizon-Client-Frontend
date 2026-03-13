
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';

// Slices
import authReducer from './slices/authSlice';
import savedReducer from './slices/savedSlice';
import filtersReducer from './slices/filtersSlice';
import uiReducer from './slices/uiSlice';
import activityReducer from './slices/activitySlice';
import conversationReducer from './slices/conversationSlice'; // NEW

const rootReducer = combineReducers({
  auth: authReducer,
  saved: savedReducer,
  filters: filtersReducer,
  ui: uiReducer,
  activity: activityReducer,
  conversation: conversationReducer, //  NEW
});

// ─── Persist Config ─────────────────────────────────

const resolvedStorage = storage.default ?? storage;

const persistConfig = {
  key: 'root',
  version: 1,
  storage: resolvedStorage,
  // conversation NOT in whitelist - unreadCount fetched fresh from server
  // Only persisting UI-critical state
  whitelist: ['auth', 'saved', 'filters', 'activity'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ─── Store ──────────────────────────────────────────

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export default store;
