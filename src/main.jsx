// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
// import { AuthProvider } from "../useAuth";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
    {/* <AuthProvider> */}
      <App />
    {/* </AuthProvider> */}
      <Toaster position="top-right" />
    </ErrorBoundary>
  </StrictMode>
);