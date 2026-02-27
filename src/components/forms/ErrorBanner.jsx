
import { memo } from "react";

/**
 * Error banner for forms
 * Used in: Login, Register, ForgotPassword, ResetPassword
 */
const ErrorBanner = memo(({ error }) => {
  if (!error) return null;

  const message = typeof error === "string"
    ? error
    : error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";

  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-xl px-4 py-3 mb-5">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
    </div>
  );
});

export default ErrorBanner;
