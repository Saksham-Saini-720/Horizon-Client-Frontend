import { memo, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const AgentCardSkeleton = () => (
  <div className="mx-5 mt-2 mb-4 rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4 animate-pulse">
    <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-44" />
      </div>
      <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
    </div>
  </div>
);

// ─── No Agent State ───────────────────────────────────────────────────────────

const NoAgentAssigned = memo(() => (
  <div className="mx-5 mt-2 mb-4 rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4">
    <p className="text-[10px] text-gray-400 font-myriad tracking-widest uppercase mb-3">
      Listing Agent
    </p>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-[15px] font-semibold text-primary font-myriad">
          Agent Not Assigned
        </p>
        <p className="text-[12px] text-gray-400 font-myriad mt-0.5">
          Send an enquiry and we'll get back to you
        </p>
      </div>
    </div>
  </div>
));

NoAgentAssigned.displayName = 'NoAgentAssigned';

// ─── Main AgentCard ───────────────────────────────────────────────────────────

const AgentCard = memo(({ agent, property, isLoading }) => {
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
      const cleanPhone = agent.phone.replace(/[^\d+]/g, '');
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

  if (isLoading) return <AgentCardSkeleton />;
  if (!agent || !agent.phone) return <NoAgentAssigned />;

  // Build initials from name (up to 2 chars)
  const initials = (agent.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // const displayRating = agent?.rating || '4.9';
  // const displayReviews = agent?.reviews || '212';
  const areaLabel = agent?.office?.name || 'Horizon Bay Area';

  return (
    <div className="mx-5 mt-2 mb-4 rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4">

      {/* "LISTING AGENT" label */}
      <p className="text-[10px] text-gray-400 font-myriad tracking-widest uppercase mb-3">
        Listing Agent
      </p>

      {/* Agent row: avatar · name/meta · phone button */}
      <div className="flex items-center gap-3">

        {/* Avatar — orange circle with initials, or photo */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-light flex items-center justify-center flex-shrink-0">
          {agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-[17px] font-bold font-myriad leading-none">
              {initials}
            </span>
          )}
        </div>

        {/* Name + area · rating */}
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-bold text-primary font-myriad truncate">
            {agent.name || 'Property Agent'}
          </p>
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            <span className="text-[12px] text-gray-400 font-myriad">
              {areaLabel}
            </span>
            <span className="text-[12px] text-gray-300 font-myriad">·</span>
            {/* <span className="text-[12px] text-gray-500 font-myriad font-semibold">
              {displayRating} ★
            </span> */}
            {/* <span className="text-[12px] text-gray-400 font-myriad">
              ({displayReviews})
            </span> */}
          </div>
        </div>

        {/* Phone button — dark navy circle */}
        <button
          onClick={handleCall}
          disabled={!agent.phone}
          className="w-11 h-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 transition-all disabled:opacity-40"
          title="Call agent"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
      </div>

      {/* Secondary actions: WhatsApp + copy phone */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={handleWhatsApp}
          disabled={!agent.phone}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-700 text-[13px] font-semibold font-myriad transition-all active:scale-95 disabled:opacity-40"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>

        <button
          onClick={handleCopyPhone}
          disabled={!agent.phone}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 text-gray-600 text-[13px] font-semibold font-myriad transition-all active:scale-95 disabled:opacity-40"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Number
            </>
          )}
        </button>
      </div>

    </div>
  );
});

AgentCard.displayName = 'AgentCard';
export default AgentCard;
