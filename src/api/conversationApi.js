// src/api/conversationApi.js
import axiosInstance from './axiosInstance';

/**
 * Start a new conversation
 * POST /api/v1/conversations
 * Backend returns: { conversation, thread }
 */
export const startConversation = async ({ propertyId, subject, initialMessage }) => {
  try {
    const response = await axiosInstance.post('/conversations', {
      propertyId,
      subject,
      initialMessage,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to start conversation');
  }
};

/**
 * Get all conversations (paginated)
 * GET /api/v1/conversations
 */
export const getConversations = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/conversations', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
  }
};

/**
 * Get unread count
 * GET /api/v1/conversations/unread
 */
export const getUnreadCount = async () => {
  try {
    const response = await axiosInstance.get('/conversations/unread');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch unread count');
  }
};

/**
 * Get conversation by ID (with messages)
 * GET /api/v1/conversations/:id
 */
export const getConversationById = async (id, params = {}) => {
  try {
    const response = await axiosInstance.get(`/conversations/${id}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch conversation');
  }
};

/**
 * Send a message in a thread
 * POST /api/v1/conversations/:conversationId/threads/:threadId/messages
 */
export const sendMessage = async (conversationId, threadId, content) => {
  try {
    const response = await axiosInstance.post(
      `/conversations/${conversationId}/threads/${threadId}/messages`,
      { content }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

/**
 * Get messages for a thread
 * GET /api/v1/conversations/:conversationId/threads/:threadId/messages
 */
export const getThreadMessages = async (conversationId, threadId, params = {}) => {
  try {
    const response = await axiosInstance.get(
      `/conversations/${conversationId}/threads/${threadId}/messages`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

/**
 * Get threads for a conversation
 * GET /api/v1/conversations/:conversationId/threads
 */
export const getThreads = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/conversations/${conversationId}/threads`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch threads');
  }
};

/**
 * Mark conversation as read
 * PATCH /api/v1/conversations/:id/read
 */
export const markConversationAsRead = async (conversationId) => {
  try {
    const response = await axiosInstance.patch(`/conversations/${conversationId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark as read');
  }
};

/**
 * Close a conversation
 * PATCH /api/v1/conversations/:id/close
 */
export const closeConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.patch(`/conversations/${conversationId}/close`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to close conversation');
  }
};

/**
 * Archive a conversation
 * PATCH /api/v1/conversations/:id/archive
 */
export const archiveConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.patch(`/conversations/${conversationId}/archive`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to archive conversation');
  }
};
