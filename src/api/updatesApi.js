
import axiosInstance from './axiosInstance';

// ─── News & Updates ───────────────────────────────────────────────────────────
//
// Public endpoints. The service only ever matches published articles, so a draft
// or an archived piece comes back as a 404 here rather than as a 403 — asking
// for one is indistinguishable from asking for a slug that never existed.

/**
 * Published updates, newest first.
 * GET /api/v1/updates
 * PUBLIC
 */
export const getUpdates = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/updates', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch updates');
  }
};

/**
 * One published update by its slug.
 * GET /api/v1/updates/:slug
 * PUBLIC
 */
export const getUpdateBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/updates/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch update');
  }
};
