
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useSearchSubmit({ onSearch }) {
  const navigate = useNavigate();

  const submitSearch = useCallback((q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);                                  // recent mein save
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [navigate, onSearch]);

  return { submitSearch };
}
