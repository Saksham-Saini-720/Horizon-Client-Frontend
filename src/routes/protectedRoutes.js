
import { lazy } from "react";

// ─── Lazy loaded components from pages/ ───────────────────────────────────────

const SavedPage = lazy(() => import("../pages/SavedPage"));
const ActivityPage = lazy(() => import("../pages/ActivityPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const MapPage = lazy(() => import("../pages/MapPage"));

// ✅ Chat pages
const ChatPage = lazy(() => import("../pages/ChatPage"));
const ConversationPage = lazy(() => import("../pages/ConversationPage"));

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
  {
    path: "profile",
    element: ProfilePage,
    title: "Profile",
  },
  // ✅ Chat routes
  {
    path: "chat",
    element: ChatPage,
    title: "Messages",
  },
  {
    path: "chat/:id",
    element: ConversationPage,
    title: "Conversation",
  },
];

export default protectedRoutes;
