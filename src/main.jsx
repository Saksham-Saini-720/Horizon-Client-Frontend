
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "./components/ErrorBoundary";
import { store, persistor } from "./store/index";
import App from "./App";
import "./index.css";

// ─── TanStack Query Client ─────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      gcTime: 1000 * 60 * 10,     // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Loading Component (for PersistGate) ──────────────────────────────────────

const PersistLoading = () => (
  <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
  </div>
);

// ─── Root Render ──────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      {/* Redux Store */}
      <Provider store={store}>
        {/* Redux Persist - waits for rehydration */}
        <PersistGate loading={<PersistLoading />} persistor={persistor}>
          {/* TanStack Query - for server state */}
          <QueryClientProvider client={queryClient}>
            
            <App />
            
            {/* Toast Notifications */}
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1C2A3A',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  fontFamily: 'DM Sans, sans-serif',
                },
              }}
            />
            
            {/* DevTools (only in development) */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
