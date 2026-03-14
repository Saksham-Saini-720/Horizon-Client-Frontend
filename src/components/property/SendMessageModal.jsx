
import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useStartConversation } from '../../hooks/conversations/useStartConversation';
import { validateEnquiryForm, formatPhoneToE164, sanitizeEnquiryData } from '../../utils/enquiryValidation';
import MessageSuccessModal from './MessageSuccessModal';
import MessageNotification from './MessageNotification';

const formatLocation = (location) => {
  if (!location) return '';
  if (typeof location === 'string') return location;
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  return parts.join(', ') || location.address || '';
};

const SendMessageModal = memo(({ isOpen, onClose, agent, property }) => {
  const navigate = useNavigate();
  const { start, isStarting } = useStartConversation();
  const user = useSelector((state) => state.auth?.user);

  // Prefill with logged-in user's info — so lead.email === user.email → enquiries show
  const [formData, setFormData] = useState({
    name:    user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    phone:   user?.phone || '',
    email:   user?.email || '',
    message: '',
  });
  const [errors, setErrors]     = useState({});
  const [showSuccess, setShowSuccess]         = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const quickMessages = [
    'Is this property still available?',
    'Can I schedule a viewing?',
    'What are the payment terms?',
    'Are there any additional costs?',
  ];

  const handleQuickMessage = useCallback((msg) => {
    setFormData(prev => ({ ...prev, message: prev.message ? `${prev.message}\n${msg}` : msg }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();

    const validation = validateEnquiryForm(formData);
    if (!validation.isValid) { setErrors(validation.errors); return; }

    let sanitized = sanitizeEnquiryData(formData);
    if (!sanitized.phone.startsWith('+')) {
      sanitized.phone = formatPhoneToE164(sanitized.phone);
    }

    try {
      // Start conversation — message goes directly to agent
      const response = await start({
        agent,
        property,
        message: sanitized.message || `Hi, I'm ${sanitized.name}. I'm interested in this property.`,
        name:    sanitized.name,
        email:   sanitized.email,
        phone:   sanitized.phone,
      });

      // conversationId comes directly from mutationFn
      const conversationId = response?.conversationId;

      // Show success UI
      setShowSuccess(true);
      setTimeout(() => setShowNotification(true), 400);

      // Navigate to the specific conversation after 2s
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setFormData({ name: '', phone: '', email: '', message: '' });
        setErrors({});

        if (conversationId) {
          // Open the exact conversation with agent
          navigate(`/chat/${conversationId}`);
        } else {
          navigate('/chat');
        }
      }, 2000);

    } catch {
      // error toast handled inside useStartConversation
    }
  }, [formData, agent, property, start, onClose, navigate]);

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <>
        <MessageSuccessModal agent={agent} />
        <MessageNotification show={showNotification} onClose={() => setShowNotification(false)} agent={agent} />
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={onClose} />

      {/* Sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-black text-primary font-playfair">Send Message</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors active:scale-90">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Agent Info */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {agent?.photo ? (
                <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[20px] font-bold font-inter">
                  {agent?.name?.charAt(0) || 'G'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-black text-primary font-playfair mb-0.5">{agent?.name || 'Agent'}</h3>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-[13px] font-semibold text-primary font-inter">{agent?.rating || '4.7'}</span>
                <span className="text-[13px] text-gray-400 font-inter">• {agent?.reviews || '64'} reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {(property?.images?.[0] || property?.img) ? (
                <img src={property?.images?.[0] || property?.img} alt={property?.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-black text-primary font-playfair line-clamp-1 mb-1">{property?.title}</h4>
              <p className="text-[12px] text-gray-500 font-inter mb-1">{formatLocation(property?.location)}</p>
              <p className="text-[14px] font-black text-primary font-playfair">{property?.price}</p>
            </div>
          </div>
        </div>

        {/* Quick Messages */}
        <div className="px-6 pb-4">
          <p className="text-[12px] text-gray-500 font-inter mb-3">Quick messages</p>
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, i) => (
              <button key={i} type="button" onClick={() => handleQuickMessage(msg)}
                className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-700 font-inter hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-95">
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
              <label className="block text-[13px] font-semibold text-gray-700 font-inter mb-2">Your Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Mwamba" required
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} text-[14px] text-gray-700 font-inter placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors`} />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 font-inter mb-2">Phone <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+260977888999" required
                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} text-[14px] text-gray-700 font-inter placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors`} />
              {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-inter mb-2">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.mwamba@email.com" required
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} text-[14px] text-gray-700 font-inter placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors`} />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 font-inter mb-2">
              Message <span className="text-gray-400">(max 500 chars)</span>
            </label>
            <textarea name="message" value={formData.message} onChange={handleChange}
              placeholder="Is this property still available?&#10;Can I schedule a viewing?" rows={5} maxLength={500}
              className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500' : 'border-gray-200'} text-[14px] text-gray-700 font-inter placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none transition-colors`} />
            {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
            <p className="text-[11px] text-gray-400 font-inter mt-1 text-right">{formData.message.length}/500</p>
          </div>

          {/* Send Button */}
          <button type="submit" disabled={isStarting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white text-[16px] font-bold font-inter hover:bg-[#2A3A4A] transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isStarting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send Message
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-gray-400 font-inter">By sending, you agree to our Terms of Service</p>
        </form>
      </div>
    </>
  );
});

SendMessageModal.displayName = 'SendMessageModal';
export default SendMessageModal;
