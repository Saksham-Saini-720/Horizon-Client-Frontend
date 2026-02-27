
import { memo } from "react";

/**
 * Divider with "or continue with" text
 * Used in: Login, Register pages
 */
const AuthDivider = memo(({ text = "or continue with" }) => {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400">{text}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
});

export default AuthDivider;
