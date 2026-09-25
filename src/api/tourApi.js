
import axiosInstance from './axiosInstance';

/**
 * Submit Tour Request
 * POST /api/v1/tours/property/:id
 * AUTHENTICATED, email-verified, rate-limited.
 *
 * (This used to say PUBLIC. The route has required a signed-in, verified user
 * for some time — see tour.routes.js.)
 */
export const submitTourRequest = async (propertyId, data) => {
  try {
    const response = await axiosInstance.post(
      `/tours/property/${propertyId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.response?.data?.message || 'Failed to submit tour request');
  }
};

/**
 * Check a promo code before booking with it.
 * POST /api/v1/promo-codes/check
 * AUTHENTICATED, email-verified, rate-limited.
 *
 * Always resolves — an unusable code comes back as `{ valid: false, reason,
 * message }` rather than as a thrown error, because a typo is an ordinary state
 * of a field someone is still typing into, not a failed request. The booking
 * endpoint is the authority and will still refuse a code that ran out between
 * this check and the submit; this exists so that refusal is rare and the
 * ordinary case gets an inline tick instead of a toast three taps later.
 *
 * `visitType` is required: applicability depends on it, and answering without
 * it would be a promise the booking then breaks.
 */
export const checkPromoCode = async ({ code, visitType }) => {
  try {
    const response = await axiosInstance.post('/promo-codes/check', {
      code,
      visitType,
    });
    return response.data?.data ?? { valid: false, reason: 'not_found', message: null };
  } catch (error) {
    // A network or auth failure is not the customer's typo. Surface it as its
    // own state so the field does not accuse them of a bad code.
    throw new Error(
      error.response?.data?.error?.message ||
        error.response?.data?.message ||
        'Could not check that code right now'
    );
  }
};

/**
 * Get User's Tours
 * GET /api/v1/tours
 * AUTHENTICATED
 */
export const getUserTours = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/tours', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tours');
  }
};

/**
 * Get Tour by ID
 * GET /api/v1/tours/:id
 * AUTHENTICATED
 */
export const getTourById = async (tourId) => {
  try {
    const response = await axiosInstance.get(`/tours/${tourId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tour');
  }
};

/**
 * Cancel Tour Request (Client)
 * PATCH /api/v1/tours/:id/cancel
 * AUTHENTICATED
 */
export const cancelTourRequest = async (tourId, reason) => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.error;
    const message = errData?.details?.[0]?.message || errData?.message || 'Failed to cancel tour';
    throw new Error(message);
  }
};

/**
 * Reschedule Tour (Client)
 * PATCH /api/v1/tours/:id/reschedule
 * AUTHENTICATED
 */
export const rescheduleTourRequest = async (tourId, preferredDate, preferredTime) => {
  try {
    const response = await axiosInstance.patch(`/tours/${tourId}/reschedule`, {
      preferredDate,
      preferredTime,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reschedule tour');
  }
};




