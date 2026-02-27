
import { memo } from "react";

/**
 * Reusable card container
 * Used in: Auth pages, State components
 */
const Card = memo(({ children, className = "", padding = "p-8" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg ${padding} ${className}`}>
      {children}
    </div>
  );
});

export default Card;
