
import { createSlice } from '@reduxjs/toolkit';

/**
 * Activity Slice
 * Manages inquiries, tours, and messages
 */

const initialState = {
  inquiries: [],
  tours: [],
  messages: [],
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    // Add inquiry (from message)
    addInquiry: (state, action) => {
      const inquiry = {
        id: Date.now(),
        property: action.payload.property,
        message: action.payload.message,
        agent: action.payload.agent,
        status: 'submitted',
        timestamp: 'just now',
        createdAt: Date.now(),
      };
      state.inquiries.unshift(inquiry); // Add at beginning
    },

    // Update inquiry status
    updateInquiryStatus: (state, action) => {
      const inquiry = state.inquiries.find(i => i.id === action.payload.id);
      if (inquiry) {
        inquiry.status = action.payload.status;
      }
    },

    // Add tour request
    addTourRequest: (state, action) => {
      const tour = {
        id: Date.now(),
        property: action.payload.property,
        status: 'pending',
        visitType: action.payload.visitType,
        date: null,
        time: null,
        agent: action.payload.agent,
        proposedTimes: action.payload.selectedTimes,
        createdAt: Date.now(),
      };
      state.tours.unshift(tour); // Add at beginning
    },

    // Confirm tour
    confirmTour: (state, action) => {
      const tour = state.tours.find(t => t.id === action.payload.id);
      if (tour) {
        tour.status = 'confirmed';
        tour.date = action.payload.date;
        tour.time = action.payload.time;
      }
    },

    // Add message thread
    addMessage: (state, action) => {
      const message = {
        id: Date.now(),
        agent: action.payload.agent,
        property: action.payload.property,
        lastMessage: action.payload.message,
        isFromAgent: false,
        timestamp: 'just now',
        createdAt: Date.now(),
      };
      state.messages.unshift(message); // Add at beginning
    },

    // Update message thread
    updateMessage: (state, action) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.lastMessage = action.payload.lastMessage;
        message.isFromAgent = action.payload.isFromAgent;
        message.timestamp = 'just now';
      }
    },

    // Clear all activity
    clearActivity: (state) => {
      state.inquiries = [];
      state.tours = [];
      state.messages = [];
    },
  },
});

export const {
  addInquiry,
  updateInquiryStatus,
  addTourRequest,
  confirmTour,
  addMessage,
  updateMessage,
  clearActivity,
} = activitySlice.actions;

export default activitySlice.reducer;

// Selectors
export const selectAllInquiries = (state) => state.activity.inquiries;
export const selectAllTours = (state) => state.activity.tours;
export const selectAllMessages = (state) => state.activity.messages;
export const selectInquiriesCount = (state) => state.activity.inquiries.length;
export const selectToursCount = (state) => state.activity.tours.length;
export const selectMessagesCount = (state) => state.activity.messages.length;
