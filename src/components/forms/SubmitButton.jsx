
import { memo } from "react";
import Spinner from "../ui/Spinner";

/**
 * Submit button with loading state
 * Used in: All form pages
 */
const SubmitButton = memo(({
  loading = false,
  label = "Submit",
  loadingLabel = "Loading...",
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full font-semibold py-3.5 rounded-xl disabled:opacity-60 transition-colors 
        flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {loading ? loadingLabel : label}
    </button>
  );
});

export default SubmitButton;
