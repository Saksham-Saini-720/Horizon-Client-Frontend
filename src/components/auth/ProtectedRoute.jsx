
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { needsEmailVerification } from "../../utils/roles";

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // Simple check - if not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /*
    Verification is enforced here, not only on the login screen.
    LoginPage redirects an unverified user to /verify-email, but that is a
    one-time check at sign-in: once past it, every bottom-nav link went through
    this guard, which asked only "are you logged in?" — so Saved, Inquiries,
    Inbox, Map and Profile were all reachable without a verified email.

    Safe to redirect from here because /verify-email is a PUBLIC route, so it is
    not wrapped by this component and cannot bounce back into it. Browsing stays
    open on purpose: Explore, Search and property pages are public, so an
    unverified user can still look around — they just cannot reach the
    account-bound areas. Actions are separately gated in PropertyActions.
  */
  if (needsEmailVerification(user)) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
}
