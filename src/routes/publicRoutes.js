// src/routes/config/publicRoutes.js
import { lazy } from "react";

// ─── Lazy loaded components from pages/ ───────────────────────────────────────

const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
// const PropertyDetailPage = lazy(() => import("../../pages/PropertyDetailPage"));

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
    path: "login",
    element: LoginPage,
    title: "Login",
  },
  {
    path: "register",
    element: RegisterPage,
    title: "Create Account",
  },
  // Uncomment when ready:
  // {
  //   path: "property/:id",
  //   element: PropertyDetailPage,
  //   title: "Property Details",
  // },
];

export default publicRoutes;
