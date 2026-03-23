
import { memo } from "react";

const ErrorBanner = memo(({ error }) => {
  if (!error) return null;

  const responseData = error?.response?.data?.error || error;

  const mainMessage = 
    responseData?.message || 
    responseData?.error?.message ||
    (typeof responseData === "string" ? responseData : null);

  const details =
    responseData?.details ||
    responseData?.error?.details ||
    [];

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
      {mainMessage && <div className="flex items-start gap-2.5">
        <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span className="text-red-600 text-[14px] font-semibold">{mainMessage}</span>
      </div>}

      {Array.isArray(details) && details.length > 0 && (
        <ul className="mt-2 ml-6 space-y-1">
          {details.map((d, i) => (
            <li key={i} className="text-red-500 text-[13px] list-disc">
              {d.message || d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

ErrorBanner.displayName = 'ErrorBanner';
export default ErrorBanner;
