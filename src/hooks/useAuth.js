
import { useQuery } from "@tanstack/react-query";
import { getTokens } from "../utils/token";

// ─── Check if user is authenticated ──────────────────────────────────────────

const checkAuth = () => {
  const { accessToken } = getTokens();
  const userStr = localStorage.getItem("user");
  
  if (!accessToken || !userStr) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = JSON.parse(userStr);
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
};

// ─── useAuth Hook ─────────────────────────────────────────────────────────────

export default function useAuth() {
  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    
    staleTime: Infinity,              // Auth state rarely changes
    gcTime: Infinity,                 // Keep in cache forever
    refetchOnMount: false,            // Don't refetch on mount
    refetchOnWindowFocus: false,      // Don't refetch on focus
    refetchOnReconnect: false,        // Don't refetch on reconnect
  });

  return {
    isAuthenticated: authQuery.data?.isAuthenticated ?? false,
    user: authQuery.data?.user ?? null,
    isLoading: authQuery.isLoading,
  };
}

// ─── Helper to invalidate auth cache (call after login/logout) ───────────────

export { checkAuth };
