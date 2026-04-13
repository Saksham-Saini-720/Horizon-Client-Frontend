import { memo, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const AgentCard = memo(({ agent, property }) => {
  const [copied, setCopied] = useState(false);

  const handleCall = useCallback(() => {
    if (agent?.phone) {
      window.location.href = `tel:${agent.phone}`;
    } else {
      toast.error('Phone number not available');
    }
  }, [agent]);

  const handleWhatsApp = useCallback(() => {
    if (agent?.phone) {
      const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(
        `Hi, I'm interested in ${property?.title || 'the property'} at ${property?.location || ''}`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    } else {
      toast.error('WhatsApp not available');
    }
  }, [agent, property]);

  const handleCopyPhone = useCallback(async () => {
    if (agent?.phone) {
      try {
        await navigator.clipboard.writeText(agent.phone);
        setCopied(true);
        toast.success('Phone number copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy phone number');
      }
    }
  }, [agent]);

  if (!agent) return null;

  return (
    <div className="mx-4 mt-3 mb-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">

      {/* Dark header strip */}
      <div className="bg-secondary px-4 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-white tracking-widest uppercase font-myriad">
          Listed by
        </span>
        {/* <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 fill-[#f5c518]" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[12px] font-semibold text-[#f5c518] font-myriad">
            {agent?.rating || '4.9'}
          </span>
          <span className="text-[11px] text-white/40 font-myriad">
            ({agent?.reviews || '127'} reviews)
          </span>
        </div> */}
      </div>

      {/* Agent info row */}
      <div className="px-4 pt-4 pb-3.5 flex items-center gap-3.5 border-b border-gray-100">

        {/* Avatar with online dot */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            {agent.avatar ? (
              <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-[22px] font-semibold font-myriad">
                {agent.name?.[0] || 'A'}
              </span>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* Name + title + badges */}
        <div className="flex-1">
          <p className="text-[16px] font-semibold text-primary font-myriad mb-0.5">
            {agent.name}
          </p>
          <p className="text-[12px] text-gray-500 font-myriad mb-2">
            {agent.title || 'Property Agent'}
          </p>
          <div className="flex items-center gap-1.5">
            {agent.experience && (
              <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium font-myriad">
                {agent.experience} exp
              </span>
            )}
            <span className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium font-myriad">
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 flex items-center gap-2.5">

        {/* Call */}
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-white rounded-xl text-[14px] font-semibold font-myriad transition-all active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-[14px] font-semibold font-myriad transition-all active:scale-95 hover:bg-green-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>

        {/* Copy phone — icon only */}
        <button
          onClick={handleCopyPhone}
          className="w-11 h-11 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl transition-all active:scale-95 hover:bg-gray-100 flex-shrink-0"
          title="Copy phone number"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>

      {/* Availability footer */}
      <div className="px-4 pb-3.5 text-center">
        <p className="text-[11px] text-gray-400 font-myriad">
          {agent?.availability || 'Mon–Fri 8:00 AM – 6:00 PM  •  Sat 9:00 AM – 1:00 PM'}
        </p>
      </div>

    </div>
  );
});

AgentCard.displayName = 'AgentCard';
export default AgentCard;