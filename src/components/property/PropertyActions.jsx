
import { memo, useCallback } from "react";
import toast from "react-hot-toast";

const ActionButton = memo(({ icon, label, onClick, primary = false, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex max-w-40 items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-[15px] font-['DM_Sans',sans-serif] transition-all active:scale-95 ${
      primary
        ? "bg-[#1C2A3A] text-white shadow-lg hover:bg-[#2A3A4A]"
        : variant === "yellow"
        ? "bg-white text-[#1C2A3A] border border-gray-200 hover:bg-amber-400 hover:border-amber-400 hover:text-white"
        : "bg-white text-[#1C2A3A] border border-gray-200 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
));

const PropertyActions = memo(({ agent }) => {
  const handleCall = useCallback(() => {
    if (agent?.phone) {
      window.location.href = `tel:${agent.phone}`;
    } else {
      toast.error("Phone number not available");
    }
  }, [agent]);

  const handleMessage = useCallback(() => {
    if (agent?.email) {
      window.location.href = `mailto:${agent.email}`;
    } else {
      toast.error("Email not available");
    }
  }, [agent]);

  const handleTour = useCallback(() => {
    toast.success("Tour request sent! Agent will contact you soon.");
  }, []);

  return (
    <div className="fixed bottom-0 justify-center left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 z-100  shadow-lg">
      {/* Call */}
      <ActionButton
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        }
        label="Call"
        onClick={handleCall}
        variant="yellow"
      />

      {/* Message */}
      <ActionButton
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        }
        label="Message"
        onClick={handleMessage}
        variant="yellow"
      />

      {/* Tour */}
      <ActionButton
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        }
        label="Tour"
        onClick={handleTour}
        primary
      />
    </div>
  );
});

export default PropertyActions;
