// src/utils/logout.js
import { clearTokens } from "./token";

/**
 * Logout user - clear tokens, user data, and auth cache
 * @param {QueryClient} queryClient - TanStack Query client instance
 */
export function logout(queryClient) {
  // Clear tokens
  clearTokens();
  
  // Clear user from localStorage
  localStorage.removeItem("user");
  
  // Invalidate auth query - forces ProtectedRoute to redirect
  queryClient.invalidateQueries({ queryKey: ["auth"] });
  
  // Optional: Clear all queries
  // queryClient.clear();
}
