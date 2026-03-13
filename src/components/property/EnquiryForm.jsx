
import { memo, useState, useCallback } from 'react';
import { useSubmitEnquiry } from '../../hooks/enquiries/useSubmitEnquiry';
import { validateEnquiryForm, formatPhoneToE164, sanitizeEnquiryData } from '../../utils/enquiryValidation';

/**
 * EnquiryForm Component
 * Property enquiry form with validation
 * Slides from bottom on mobile, modal on desktop
 */
const EnquiryForm = memo(({ isOpen, onClose, property, agent }) => {
  const submitMutation = useSubmitEnquiry();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  // Quick message suggestions
  const quickMessages = [
    'I am interested in this property. Please contact me.',
    'Can I schedule a viewing?',
    'What are the payment terms?',
    'Is this property still available?'
  ];

  // Handle quick message click
  const handleQuickMessage = useCallback((msg) => {
    setFormData(prev => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${msg}` : msg
    }));
  }, []);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle submit
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateEnquiryForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Sanitize data
    const sanitizedData = sanitizeEnquiryData(formData);

    // Format phone to E.164 if needed
    if (!sanitizedData.phone.startsWith('+')) {
      sanitizedData.phone = formatPhoneToE164(sanitizedData.phone);
    }

    // Submit enquiry
    submitMutation.mutate({
      propertyId: property.id,
      data: sanitizedData,
      property: {
        id: property.id,
        title: property.title,
        img: property.images?.[0] || property.img,
        location: property.location,
        price: property.price,
      },
      agent: agent,
    }, {
      onSuccess: () => {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setErrors({});
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    });
  }, [formData, property, agent, submitMutation, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              Enquire About Property
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors active:scale-90"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Property Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            {/* Property Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {property?.img || property?.images?.[0] ? (
                <img
                  src={property?.img || property?.images?.[0]}
                  alt={property?.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
            </div>

            {/* Property Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] line-clamp-1 mb-1">
                {property?.title}
              </h4>
              <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] mb-1">
                {property?.location}
              </p>
              <p className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                {property?.price}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Messages */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] mb-3">
            Quick messages
          </p>
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickMessage(msg)}
                className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-700 font-['DM_Sans',sans-serif] hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-95"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sarah Ahmad"
              required
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors`}
            />
            {errors.name && (
              <p className="text-[12px] text-red-500 font-['DM_Sans',sans-serif] mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah.ahmad@email.com"
              required
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors`}
            />
            {errors.email && (
              <p className="text-[12px] text-red-500 font-['DM_Sans',sans-serif] mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+260977888999"
              required
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              } text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors`}
            />
            {errors.phone && (
              <p className="text-[12px] text-red-500 font-['DM_Sans',sans-serif] mt-1">
                {errors.phone}
              </p>
            )}
            <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif] mt-1">
              Format: +[country code][number] (e.g., +260977888999)
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
              Message <span className="text-gray-400">(Optional, max 500 chars)</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="I am interested in this property. Please provide more details..."
              rows={4}
              maxLength={500}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.message ? 'border-red-500' : 'border-gray-200'
              } text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none transition-colors`}
            />
            {errors.message && (
              <p className="text-[12px] text-red-500 font-['DM_Sans',sans-serif] mt-1">
                {errors.message}
              </p>
            )}
            <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif] mt-1 text-right">
              {formData.message.length}/500
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#1C2A3A] text-white text-[16px] font-bold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Submit Enquiry
              </>
            )}
          </button>

          {/* Terms */}
          <p className="text-[11px] text-center text-gray-400 font-['DM_Sans',sans-serif]">
            By submitting, you agree to our Terms of Service
          </p>
        </form>
      </div>
    </>
  );
});

EnquiryForm.displayName = 'EnquiryForm';

export default EnquiryForm;
