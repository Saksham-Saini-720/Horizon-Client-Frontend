
import { lazy } from "react";

// ─── Lazy loaded components from pages/ ───────────────────────────────────────

const SavedPage = lazy(() => import("../pages/SavedPage"));
const InquiriesPage = lazy(() => import("../pages/InquiriesPage"));
// const ToursPage = lazy(() => import("../../pages/ToursPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
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
    element: InquiriesPage,
    title: "My Inquiries",
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
