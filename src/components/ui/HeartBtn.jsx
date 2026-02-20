
import { useCallback, memo } from "react";
import useSavedProperties from "../../hooks/useSavedProperties";


const HeartBtn = memo(({ size = "sm", propertyId }) => {
  const { isSaved, toggleSaved } = useSavedProperties();
  const saved = isSaved(propertyId);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleSaved(propertyId);
  }, [propertyId, toggleSaved]);

  const sizeClass = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={`${sizeClass} rounded-full bg-white shadow-md flex items-center justify-center transition-all active:scale-90 hover:shadow-lg`}
    >
      <svg
        className={`w-4 h-4 transition-all duration-300 ${
          saved
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 hover:text-red-400"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
});

export default HeartBtn;
