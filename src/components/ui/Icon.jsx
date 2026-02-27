
import { memo } from "react";

/**
 * Common SVG icons
 * Used in: Multiple pages
 */
const icons = {
  search: (
    <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"/>
  ),
  home: (
    <>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </>
  ),
  success: (
    <>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </>
  ),
  checkmark: (
    <polyline points="20 6 9 17 4 12"/>
  ),
  close: (
    <>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </>
  ),
  arrowRight: (
    <path d="M5 12h14M12 5l7 7-7 7"/>
  ),
  arrowLeft: (
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  ),
  spinner: (
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </>
  ),
};

const Icon = memo(({ name, size = 20, className = "", strokeWidth = 2 }) => {
  const iconPath = icons[name];
  
  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {iconPath}
    </svg>
  );
});

export default Icon;
