
import { lazy } from "react";

// ─── Lazy loaded components from pages/ ───────────────────────────────────────

const SavedPage = lazy(() => import("../pages/SavedPage"));
const ActivityPage = lazy(() => import("../pages/ActivityPage"));
// const ToursPage = lazy(() => import("../../pages/ToursPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const MapPage = lazy(() => import("../pages/MapPage"));
// const MessagesPage = lazy(() => import("../../pages/MessagesPage"));
// const MessageThreadPage = lazy(() => import("../../pages/MessageThreadPage"));

// ─── Protected Routes ──────────────────────────────────────────────────────────

const protectedRoutes = [
  {
    path: "saved",
    element: SavedPage,
    title: "Saved Properties",
  },
  {
    path: "inquiries",
    element: ActivityPage,
    title: "My Inquiries",
  },
  {
    path: "map",
    element: MapPage,
    title: "Map View",
  },
  // {
  //   path: "tours",
  //   element: ToursPage,
  //   title: "My Tours",
  // },
  {
    path: "profile",
    element: ProfilePage,
    title: "Profile",
  },
  // {
  //   path: "messages",
  //   element: MessagesPage,
  //   title: "Messages",
  // },
  // {
  //   path: "messages/:threadId",
  //   element: MessageThreadPage,
  //   title: "Message Thread",
  // },
];

export default protectedRoutes;
