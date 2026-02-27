
import { memo } from "react";
import Spinner from "./Spinner";

/**
 * Reusable button with variants
 * Used in: Multiple pages
 */
const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon,
  ...props
}) => {
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    amber: "bg-amber-500 text-white hover:bg-amber-600",
  };

  const sizes = {
    sm: "px-3 py-2 text-[13px]",
    md: "px-4 py-3 text-[15px]",
    lg: "px-6 py-3.5 text-[16px]",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`font-semibold rounded-xl disabled:opacity-60 transition-all active:scale-95
        flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {icon && !loading && icon}
      {children}
    </button>
  );
});

export default Button;
