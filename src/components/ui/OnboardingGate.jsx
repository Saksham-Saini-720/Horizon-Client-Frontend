import { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

export default function OnboardingGate({ children }) {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem("onboardingComplete") !== "true";
    } catch {
      return true;
    }
  });

  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem("onboardingComplete", "true");
    } catch {
      // ignore storage errors
    }
    setShowOnboarding(false);
  };

  return (
    <>
      {/* App mounts underneath so Redux / queries warm up immediately */}
      <div style={{ visibility: showOnboarding ? "hidden" : "visible" }}>
        {children}
      </div>

      {/* Onboarding overlay — sits on top until dismissed */}
      <AnimatePresence>
        {showOnboarding && (
          <Motion.div
            key="onboarding"
            style={{ position: "fixed", inset: 0, zIndex: 9999 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <LoadingScreen onComplete={handleOnboardingComplete} />
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
