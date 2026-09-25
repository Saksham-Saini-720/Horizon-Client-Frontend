
import { lazy } from "react";

import { REFERRALS_ENABLED } from "../config/features";

// ─── Lazy loaded components from pages/ ───────────────────────────────────────

const SavedPage = lazy(() => import("../pages/SavedPage"));
const ActivityPage = lazy(() => import("../pages/ActivityPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const MapPage = lazy(() => import("../pages/MapPage"));

// Money: the customer's own referrals, refunds and receipts.
const ReferralsPage = lazy(() => import("../pages/ReferralsPage"));
const RefundsPage = lazy(() => import("../pages/RefundsPage"));

// Chat pages
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
  // Reached from the Money section of Profile rather than the bottom nav,
  // which is already full at five tabs.
  //
  // Spread-conditional rather than deleted: the page and its lazy import stay
  // in the tree, and /referrals simply falls through to the 404 route while the
  // programme is hidden. Flipping VITE_REFERRALS_ENABLED brings it back with no
  // code change.
  ...(REFERRALS_ENABLED
    ? [
        {
          path: "referrals",
          element: ReferralsPage,
          title: "Refer a Friend",
        },
      ]
    : []),
  {
    path: "refunds",
    element: RefundsPage,
    title: "Refunds & Receipts",
  },
  // Chat routes
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
