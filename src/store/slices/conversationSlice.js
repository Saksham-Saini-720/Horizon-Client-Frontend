// src/store/slices/conversationSlice.js - ALREADY GOOD ✅
import { createSlice } from '@reduxjs/toolkit';

/**
 * Conversation Slice
 * - Stores unread count (synced from server)
 * - Stores optimistic messages (before server confirms)
 * - Stores active conversation ID
 */

const initialState = {
  unreadCount: 0,
  activeConversationId: null,
  // Optimistic messages keyed by conversationId
  // { [conversationId]: [{ id, content, createdAt, isOptimistic: true }] }
  optimisticMessages: {},
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    // Set unread count from server
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload ?? 0;
    },

    // Decrement unread when user opens a conversation
    decrementUnread: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },

    // Reset unread to 0
    clearUnread: (state) => {
      state.unreadCount = 0;
    },

    // Set active conversation (used for tracking)
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },

    // Add optimistic message (instant UI update before API response)
    addOptimisticMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.optimisticMessages[conversationId]) {
        state.optimisticMessages[conversationId] = [];
      }
      state.optimisticMessages[conversationId].push(message);
    },

    // Remove optimistic message (replace with real one from server)
    removeOptimisticMessage: (state, action) => {
      const { conversationId, tempId } = action.payload;
      if (state.optimisticMessages[conversationId]) {
        state.optimisticMessages[conversationId] = state.optimisticMessages[
          conversationId
        ].filter((m) => m.tempId !== tempId);
      }
    },

    // Clear optimistic messages for a conversation
    clearOptimisticMessages: (state, action) => {
      const conversationId = action.payload;
      delete state.optimisticMessages[conversationId];
    },
  },
});

export const {
  setUnreadCount,
  decrementUnread,
  clearUnread,
  setActiveConversation,
  addOptimisticMessage,
  removeOptimisticMessage,
  clearOptimisticMessages,
} = conversationSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────────────────────

export const selectUnreadCount = (state) => state.conversation?.unreadCount ?? 0;
export const selectActiveConversationId = (state) => state.conversation?.activeConversationId;
export const selectOptimisticMessages = (conversationId) => (state) =>
  state.conversation?.optimisticMessages?.[conversationId] ?? [];

export default conversationSlice.reducer;
