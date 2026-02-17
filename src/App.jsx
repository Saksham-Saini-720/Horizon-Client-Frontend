import { lazy, Suspense } from "react";
// import PageLoader from "./components/ui/PageLoader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./components/guards/ProtectedRoute";

// All pages lazy loaded
const HomePage = lazy(() => import("./routes/public/HomePage"));
const SearchPage = lazy(() => import("./routes/public/SearchPage"));
// const PropertyDetailPage = lazy(() => import("./routes/public/PropertyDetailPage"));
const LoginPage = lazy(() => import("./routes/public/LoginPage"));
const RegisterPage = lazy(() => import("./routes/public/RegisterPage"));
const SavedPropertiesPage = lazy(() => import("./routes/protected/SavedPropertiesPage"));
const InquiriesPage = lazy(() => import("./routes/protected/InquiriesPage"));
const ToursPage = lazy(() => import("./routes/protected/ToursPage"));
// const MessagesPage = lazy(() => import("./routes/protected/MessagesPage"));
// const MessageThreadPage = lazy(() => import("./routes/protected/MessageThreadPage"));
const ProfilePage = lazy(() => import("./routes/protected/ProfilePage"));

export default function App() {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<PageLoader />}>   ← wraps all routes */}
        <Routes>
          <Route path="/" element={<HomePage />} >
            <Route path="/search" element={<SearchPage />} />
            {/* <Route path="/property/:id" element={<PropertyDetailPage />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/saved" element={<SavedPropertiesPage />} />
              <Route path="/inquiries" element={<InquiriesPage />} />
              <Route path="/tours" element={<ToursPage />} />
              {/* <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:threadId" element={<MessageThreadPage />} /> */}
              <Route path="/profile" element={<ProfilePage />} />
            {/* </Route> */}

            {/* <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} /> */}
          </Route>
        </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
}