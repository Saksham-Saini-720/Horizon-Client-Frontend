
import { memo } from "react";

/**
 * Success state component
 * Used in: ForgotPassword, ResetPassword, VerifyEmail pages
 */
const SuccessState = memo(({ 
  title = "Success!",
  message,
  showRedirectIndicator = false,
  children
}) => {
  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in-50 duration-300">
          <svg 
            className="w-8 h-8 text-green-500" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          >
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[22px] font-bold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className="text-[15px] text-gray-600 mb-6">
          {message}
        </p>
      )}

      {/* Loading Indicator (for auto-redirect) */}
      {showRedirectIndicator && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <p className="text-[14px] text-gray-500">Redirecting</p>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      {/* Custom content (buttons, etc.) */}
      {children}
    </div>
  );
});

export default SuccessState;
