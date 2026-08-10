import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./SplashScreen";

// The admin app holds its splash for 5s, which suits a dashboard that boots
// slowly. This is shorter: a first-time visitor sees the splash and then the
// three onboarding slides back to back, and 5s in front of that is a long wait
// before anything can be tapped.
const SPLASH_MS = 2600;

/**
 * Cold-boot splash gate. Mirrors OnboardingGate: the app renders underneath
 * immediately and the overlay sits on top until it times out.
 */
export default function SplashGate({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {children}
      {/* Siblings, not a wrapper: the app mounts underneath straight away so
          data fetching and store rehydration happen during the splash rather
          than after it. */}
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>
    </>
  );
}
