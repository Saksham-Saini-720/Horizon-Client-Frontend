
import { memo } from "react";

/**
 * Loading spinner
 * Used in: All pages with loading states
 */
const Spinner = memo(({ size = "md", color = "currentColor" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <svg 
      className={`${sizes[size]} animate-spin`} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color} 
      strokeWidth="2.5"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
});

export default Spinner;
