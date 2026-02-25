
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Route configs
import publicRoutes from "./routes/publicRoutes";
import protectedRoutes from "./routes/protectedRoutes";

// HomePage is the base layout (from pages/ folder)
const HomePage = lazy(() => import("./pages/HomePage"));

// ─── Suspense Fallback ─────────────────────────────────────────────────────────

const PageLoader = () => (
  <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="mt-4 text-[14px] text-gray-500 font-['DM_Sans',sans-serif]">
        Loading...
      </p>
    </div>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          
          {/* Base layout - HomePage wraps everything */}
          <Route path="/" element={<HomePage />}>
            
            {/* ── Public Routes (auto-generated from config) ── */}
            {publicRoutes.map(({ path, element: Component, title }) => (
              <Route 
                key={path || "index"} 
                index={path === ""}  // ← Index route for "/"
                path={path || undefined}
                element={<Component />} 
              />
            ))}

            {/* ── Protected Routes (wrapped in auth HOC) ── */}
            <Route element={<ProtectedRoute />}>
              {protectedRoutes.map(({ path, element: Component }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={<Component />} 
                />
              ))}
            </Route>

            {/* ── 404 Not Found ── */}
            <Route 
              path="404" 
              element={
                <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center px-4 text-center pb-28">
                  <h1 className="text-[48px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
                    404
                  </h1>
                  <p className="text-[18px] text-gray-500 font-['DM_Sans',sans-serif] mb-6">
                    Page not found
                  </p>
                  <a 
                    href="/" 
                    className="px-6 py-3 rounded-xl text-[15px] font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                    style={{ background: "linear-gradient(135deg, #F5B731, #E8A020)" }}
                  >
                    Go Home
                  </a>
                </div>
              } 
            />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/404" replace />} />

          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
