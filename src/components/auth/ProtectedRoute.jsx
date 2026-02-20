
import { Navigate, useLocation, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// ─── Loading Screen ───────────────────────────────────────────────────────────

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="mt-4 text-[14px] text-gray-500 font-['DM_Sans',sans-serif]">
        Loading...
      </p>
    </div>
  </div>
);

// ─── ProtectedRoute (HOC) ─────────────────────────────────────────────────────

/**
 * Higher-Order Component to protect routes
 * Uses <Outlet /> to render nested protected routes
 * Redirects to /login if not authenticated, preserving the intended destination
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated, save current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render nested protected routes via Outlet
  return <Outlet />;
}
