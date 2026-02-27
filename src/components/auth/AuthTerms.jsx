
import { memo } from "react";

/**
 * Terms and privacy policy text
 * Used in: Login, Register pages
 */
const AuthTerms = memo(() => {
  return (
    <p className="text-xs text-center text-gray-400 mt-5">
      By continuing, you agree to our{" "}
      <a href="/terms" className="text-amber-600 hover:underline">
        Terms
      </a>{" "}
      and{" "}
      <a href="/privacy" className="text-amber-600 hover:underline">
        Privacy Policy
      </a>
    </p>
  );
});

export default AuthTerms;
