
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useRedux";

// ─── ProtectedRoute (HOC) ─────────────────────────────────────────────────────

/**
 * Higher-Order Component to protect routes
 * Uses Redux for auth state
 * Redirects to /login if not authenticated
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // No loading state needed - Redux is synchronous
  
  // Redirect to login if not authenticated, save current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render nested protected routes via Outlet
  return <Outlet />;
}
