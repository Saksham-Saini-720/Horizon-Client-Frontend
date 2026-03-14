
import { memo, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * ContactAgentModal Component
 * Slides up from bottom, full width (touches all edges except top)
 */
const ContactAgentModal = memo(({ isOpen, onClose, agent, property }) => {
  // if (!isOpen) return null;

  // Handle call
  const handleCall = useCallback(() => {
    if (agent?.phone) {
      window.location.href = `tel:${agent.phone}`;
      onClose();
    } else {
      toast.error('Phone number not available');
    }
  }, [agent, onClose]);

  // Handle WhatsApp
  const handleWhatsApp = useCallback(() => {
    if (agent?.phone) {
      const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(
        `Hi, I'm interested in ${property?.title || 'the property'} at ${property?.location || ''}`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
      onClose();
    } else {
      toast.error('WhatsApp not available');
    }
  }, [agent, property, onClose]);

  // Handle copy phone
  const handleCopyPhone = useCallback(async () => {
    if (agent?.phone) {
      try {
        await navigator.clipboard.writeText(agent.phone);
        toast.success('Phone number copied!');
      } catch (error) {
        toast.error('Failed to copy phone number');
      }
    }
  }, [agent]);

  return (
    <>
      {/* Backdrop */}
      <div
          className={`
            fixed inset-0 bg-black/50 backdrop-blur-sm z-40
            transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={onClose}
        />

      {/* Modal - Slides from bottom, full width */}
      
      <div
        className={`
              fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 
              max-h-[85vh] overflow-y-auto
              transform transition-transform duration-300 ease-out
              ${isOpen ? 'translate-y-0' : 'translate-y-full'}
            `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-black text-primary font-playfair">
              Contact Agent
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
          <div className="flex items-center gap-4">
            {/* Agent Photo */}
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {agent?.photo ? (
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[22px] font-black font-playfair">
                  {agent?.name?.charAt(0) || 'S'}
                </div>
              )}
            </div>

            {/* Agent Details */}
            <div className="flex-1">
              <h3 className="text-[18px] font-black text-primary font-playfair mb-0.5">
                {agent?.name || 'Sarah Mulenga'}
              </h3>
              <p className="text-[14px] text-gray-500 font-inter mb-1.5">
                {agent?.title || 'Property Agent'}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-amber-400 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-[13px] font-semibold text-primary font-inter">
                  {agent?.rating || '4.9'}
                </span>
                <span className="text-[13px] text-gray-400 font-inter">
                  ({agent?.reviews || '127'} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-[12px] text-gray-500 font-inter mb-3">
            Regarding
          </p>
          <div className="flex items-center gap-3">
            {/* Property Image */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
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
              <h4 className="text-[14px] font-black text-primary font-playfair line-clamp-1 mb-1">
                {property?.title || 'Modern Executive Villa in Kabulonga'}
              </h4>
              <p className="text-[12px] text-gray-500 font-inter truncate">
                {property?.location || 'Kabulonga, Lusaka'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-6 space-y-3">
          {/* Call Now */}
          <button
            onClick={handleCall}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-primary text-white hover:bg-primary-light transition-all active:scale-[0.98] shadow-lg"
          >
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[16px] font-bold font-inter mb-0.5">
                Call Now
              </p>
              <p className="text-[13px] text-white/80 font-inter">
                {agent?.phone || '+260 977 123 456'}
              </p>
            </div>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-green-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[16px] font-bold text-primary font-inter mb-0.5">
                WhatsApp
              </p>
              <p className="text-[13px] text-gray-500 font-inter">
                Send a message via WhatsApp
              </p>
            </div>
          </button>

          {/* Copy Phone Number - White by default, Yellow on hover */}
          <button
            onClick={handleCopyPhone}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white border border-gray-200 text-primary hover:bg-amber-400 hover:border-amber-400 transition-all active:scale-[0.98] shadow-sm"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span className="text-[15px] font-bold font-inter">
              Copy phone number
            </span>
          </button>
        </div>

        {/* Availability */}
        <div className="px-6 pb-6">
          <p className="text-[12px] text-center text-gray-400 font-inter">
            {agent?.availability || 'Available Mon-Fri 8:00 AM – 6:00 PM • Sat 9:00 AM – 1:00 PM'}
          </p>
        </div>
      </div>
    </>
  );
});

ContactAgentModal.displayName = 'ContactAgentModal';

export default ContactAgentModal;
