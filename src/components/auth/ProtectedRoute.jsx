
// import { Navigate, useLocation, Outlet } from "react-router-dom";
// import { useAuth } from "../../hooks/useRedux";

// // ─── ProtectedRoute (HOC) ─────────────────────────────────────────────────────

// /**
//  * Higher-Order Component to protect routes
//  * Uses Redux for auth state
//  * Redirects to /login if not authenticated
//  */
// export default function ProtectedRoute() {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();

//   // No loading state needed - Redux is synchronous
  
//   // Redirect to login if not authenticated, save current location
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Render nested protected routes via Outlet
//   return <Outlet />;
// }



import { Outlet } from "react-router-dom";

/**
 * ProtectedRoute - Allows pages to render their own empty states
 * Pages check isAuthenticated themselves and show "Log In" button
 * No automatic redirect - better UX
 */
export default function ProtectedRoute() {
  // Simply render the nested routes
  // Each page (SavedPage, InquiriesPage, ProfilePage) will handle auth check
  return <Outlet />;
}
