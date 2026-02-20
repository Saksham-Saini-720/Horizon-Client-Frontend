
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import QueryProvider from "./utils/QueryProvider";
import SavedProvider from "./utils/SavedProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <SavedProvider>
          <App />
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
        </SavedProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>
);
