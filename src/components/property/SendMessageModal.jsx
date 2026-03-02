// src/components/property/SendMessageModal.jsx
import { memo, useState, useCallback } from 'react';
import MessageSuccessModal from './MessageSuccessModal';
import MessageNotification from './MessageNotification';

/**
 * SendMessageModal Component
 * Complete message form - slides from bottom
 */
const SendMessageModal = memo(({ isOpen, onClose, agent, property }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Quick message chips
  const quickMessages = [
    'Is this property still available?',
    'Can I schedule a viewing?',
    'What are the payment terms?',
    'Are there any additional costs?'
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
  }, []);

  // Handle send
  const handleSend = useCallback((e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.message) {
      return;
    }

    // Show success modal
    setShowSuccess(true);
    
    // Show notification after a small delay
    setTimeout(() => {
      setShowNotification(true);
    }, 400);

    // Close modals after 2.5 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    }, 2500);
  }, [formData, onClose]);

  // if (!isOpen) return null;

  // Show success modal
  if (showSuccess) {
    return (
      <>
        <MessageSuccessModal agent={agent} />
        <MessageNotification
          show={showNotification}
          onClose={() => setShowNotification(false)}
          agent={agent}
        />
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
      className={`
        fixed inset-0 bg-black/50 backdrop-blur-sm z-40
        transition-opacity duration-200
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
    />

      {/* Modal - Full width, slides from bottom */}
      <div
        className={`
            fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 
            max-h-[90vh] overflow-y-auto
            transform transition-transform duration-300 ease-out
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              Send Message
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

          {/* Agent Info */}
          <div className="flex items-center gap-3">
            {/* Agent Photo */}
            <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {agent?.photo ? (
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[20px] font-bold font-['DM_Sans',sans-serif]">
                  {agent?.name?.charAt(0) || 'G'}
                </div>
              )}
            </div>

            {/* Agent Details */}
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-0.5">
                {agent?.name || 'Grace Tembo'}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-amber-400 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-[13px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                  {agent?.rating || '4.7'}
                </span>
                <span className="text-[13px] text-gray-400 font-['DM_Sans',sans-serif]">
                  • {agent?.reviews || '64'} reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            {/* Property Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {property?.img ? (
                <img
                  src={property.img}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
            </div>

            {/* Property Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] line-clamp-1 mb-1">
                {property?.title || 'Elegant Townhouse in Woodlands'}
              </h4>
              <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] mb-1">
                {property?.location || 'Woodlands, Lusaka'}
              </p>
              <p className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                {property?.price || '$275,000'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Messages */}
        <div className="px-6 pb-4">
          <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif] mb-3">
            Quick messages
          </p>
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleQuickMessage(msg)}
                className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-700 font-['DM_Sans',sans-serif] hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-95"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="px-6 pb-6 space-y-4">
          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+260...."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Is this property still available?...."
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none transition-colors"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#1C2A3A] text-white text-[16px] font-bold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] transition-all active:scale-[0.98] shadow-lg"
          >
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
            Send Message
          </button>

          {/* Terms */}
          <p className="text-[11px] text-center text-gray-400 font-['DM_Sans',sans-serif]">
            By sending, you agree to our Terms of Service
          </p>
        </form>
      </div>
    </>
  );
});

SendMessageModal.displayName = 'SendMessageModal';

export default SendMessageModal;
