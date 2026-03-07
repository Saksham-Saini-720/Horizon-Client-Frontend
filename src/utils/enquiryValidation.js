// src/utils/enquiryValidation.js

/**
 * Validate Enquiry Form Data
 * According to API spec:
 * - name: 2-100 chars, letters/hyphens/apostrophes
 * - email: valid email format
 * - phone: E.164 format (+[country code][number])
 * - message: max 500 chars (optional)
 */

export const validateEnquiryForm = (data) => {
  const errors = {};

  // Validate name (required, 2-100 chars)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters';
  } else if (!/^[a-zA-Z\s\-']+$/.test(data.name.trim())) {
    errors.name = 'Name can only contain letters, hyphens, and apostrophes';
  }

  // Validate email (required, valid format)
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Validate phone (required, E.164 format)
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'Phone number is required';
  } else {
    // E.164 format: +[country code][number]
    // Example: +260977888999, +14155552671
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(data.phone.trim())) {
      errors.phone = 'Phone must be in E.164 format (e.g., +260977888999)';
    }
  }

  // Validate message (optional, max 500 chars)
  if (data.message && data.message.trim().length > 500) {
    errors.message = 'Message must not exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format phone number to E.164
 * Converts: 0977888999 → +260977888999
 */
export const formatPhoneToE164 = (phone, countryCode = '+260') => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, remove it and add country code
  if (cleaned.startsWith('0')) {
    return `${countryCode}${cleaned.substring(1)}`;
  }
  
  // If already has country code
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Add country code
  return `${countryCode}${cleaned}`;
};

/**
 * Sanitize form data before submission
 */
export const sanitizeEnquiryData = (data) => {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    message: data.message?.trim() || '',
  };
};
