
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Simply render the nested routes
  // Each page (SavedPage, InquiriesPage, ProfilePage) will handle auth check
  return <Outlet />;
}
