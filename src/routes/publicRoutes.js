
import { lazy } from "react";


// ─── Lazy loaded components from pages/ ───────────────────────────────────────

const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const EmailVerificationPage = lazy(() => import("../pages/EmailVerificationPage"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage"));
// const SavedPage = lazy(() => import("../pages/SavedPage"));
const PropertyDetailPage = lazy(() => import("../pages/PropertyDetailPage"));

// ─── Public Routes ─────────────────────────────────────────────────────────────

const publicRoutes = [
  {
    path: "",  // Index route - renders at "/"
    element: ExplorePage,
    title: "Explore Properties",
  },
  {
    path: "search",
    element: SearchPage,
    title: "Search Results",
  },
  {
    path: "verify-email",
    element: EmailVerificationPage,
    title: "Verify Email",
  },
  {
    path: "verify/:token",
    element: VerifyEmailPage,
    title: "Verify Email",
  },
  // {
  //   path: "saved",
  //   element: SavedPage,
  //   title: "Saved Properties",
  // },
  {
    path: "login",
    element: LoginPage,
    title: "Login",
  },
  {
    path: "register",
    element: RegisterPage,
    title: "Create Account",
  },

  {
    path: "property/:id",
    element: PropertyDetailPage,
    title: "Property Details",
  },
];

export default publicRoutes;
