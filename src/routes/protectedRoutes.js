
import { lazy } from "react";

// ─── Lazy loaded components from pages/ ───────────────────────────────────────

const SavedPage = lazy(() => import("../pages/SavedPage"));
const ActivityPage = lazy(() => import("../pages/ActivityPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const MapPage = lazy(() => import("../pages/MapPage"));

// Money: the customer's own referrals, refunds and receipts.
const ReferralsPage = lazy(() => import("../pages/ReferralsPage"));
const RefundsPage = lazy(() => import("../pages/RefundsPage"));
const PromoPage = lazy(() => import("../pages/PromoPage"));

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
  // which is already full at five tabs. Always routed: the page sends the
  // visitor home while the programme is switched off in Settings → Business.
  {
    path: "referrals",
    element: ReferralsPage,
    title: "Refer a Friend",
  },
  {
    path: "refunds",
    element: RefundsPage,
    title: "Refunds & Receipts",
  },
  // Always routable: the page decides what to
  // render from whether a campaign is running, so a link shared during one
  // still lands somewhere sensible after it ends.
  {
    path: "promo",
    element: PromoPage,
    title: "Current Offer",
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
