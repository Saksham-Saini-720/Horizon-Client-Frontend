import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import OnboardingGate from "./components/ui/OnboardingGate";
import { store, persistor } from "./store/index";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

// ─── TanStack Query Client ─────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Root Render ──────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* No artificial delay — just waits for store rehydration */}
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <OnboardingGate>
            <App />
          </OnboardingGate>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1C2A3A",
                color: "#fff",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "14px",
                fontFamily: "DM Sans, sans-serif",
              },
            }}
          />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
