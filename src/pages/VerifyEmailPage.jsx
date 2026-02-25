
import { memo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useVerifyEmail from "../hooks/auth/useVerifyEmail";

// ─── Verifying State ──────────────────────────────────────────────────────────

const VerifyingState = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#F7F6F2] to-amber-50 flex items-center justify-center px-4">
    <div className="w-full max-w-md text-center">
      
      {/* Animated Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg animate-pulse">
          <svg className="w-12 h-12 text-white animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-[26px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-3">
        Verifying Your Email
      </h1>

      {/* Message */}
      <p className="text-[15px] text-gray-600 font-['DM_Sans',sans-serif]">
        Please wait while we verify your email address...
      </p>

    </div>
  </div>
));

// ─── Success State ────────────────────────────────────────────────────────────

const SuccessState = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#F7F6F2] to-amber-50 flex items-center justify-center px-4">
    <div className="w-full max-w-md">
      
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-3">
          Email Verified!
        </h1>

        {/* Message */}
        <p className="text-[15px] text-gray-600 font-['DM_Sans',sans-serif] mb-6">
          Your email has been successfully verified. You'll be redirected to the home page shortly.
        </p>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

      </div>

    </div>
  </div>
));

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = memo(({ onRetry, onGoHome }) => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#F7F6F2] to-amber-50 flex items-center justify-center px-4">
    <div className="w-full max-w-md">
      
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-3">
          Verification Failed
        </h1>

        {/* Message */}
        <p className="text-[15px] text-gray-600 font-['DM_Sans',sans-serif] mb-6">
          We couldn't verify your email. The verification link may have expired or is invalid.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full px-6 py-3.5 rounded-xl text-[15px] font-semibold text-white font-['DM_Sans',sans-serif] hover:opacity-90 active:scale-95 transition-all shadow-lg"
            style={{ background: "linear-gradient(135deg, #F5B731, #E8A020)" }}
          >
            Try Again
          </button>

          <button
            onClick={onGoHome}
            className="w-full px-6 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] hover:bg-gray-50 active:scale-95 transition-all"
          >
            Go to Home
          </button>
        </div>

        {/* Help Text */}
        <p className="text-[13px] text-gray-500 mt-6 font-['DM_Sans',sans-serif]">
          Need help?{" "}
          <a href="/support" className="text-amber-600 font-semibold hover:underline">
            Contact Support
          </a>
        </p>

      </div>

    </div>
  </div>
));

// ─── Main Component ───────────────────────────────────────────────────────────

const VerifyEmailPage = memo(() => {
  const { token } = useParams();
  const navigate = useNavigate();
  const verifyMutation = useVerifyEmail();

  // Auto-verify on mount
  useEffect(() => {
    if (!token) {
      // No token in URL - redirect to home
      navigate("/");
      return;
    }

    // Call verification API
    verifyMutation.mutate(token);
  }, [token, navigate]); // Only run once on mount

  const handleRetry = () => {
    if (token) {
      verifyMutation.mutate(token);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Show appropriate state
  if (verifyMutation.isPending) {
    return <VerifyingState />;
  }

  if (verifyMutation.isSuccess) {
    return <SuccessState />;
  }

  if (verifyMutation.isError) {
    return <ErrorState onRetry={handleRetry} onGoHome={handleGoHome} />;
  }

  // Initial state (should not be visible due to useEffect)
  return <VerifyingState />;
});

export default VerifyEmailPage;
