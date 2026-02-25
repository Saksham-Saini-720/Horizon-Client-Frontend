
import { memo } from "react";

const LogoutModal = memo(({ isOpen, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
          <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2 text-center">
          Log Out
        </h3>
        
        <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] text-center mb-6">
          Are you sure you want to log out? You'll need to log in again to access your account.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-[#1C2A3A] font-['DM_Sans',sans-serif] hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-[15px] font-semibold font-['DM_Sans',sans-serif] hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/30 disabled:opacity-50"
          >
            {isLoading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default LogoutModal;
