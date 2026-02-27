
import { memo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useVerifyEmail from "../hooks/auth/useVerifyEmail";
import  SuccessState  from "../components/states/SuccessState";
import Card from "../components/ui/Card";
import Icon from "../components/ui/Icon";
import Spinner from "../components/ui/Spinner";


// ─── Verifying State ──────────────────────────────────────────────────────────

const VerifyingState = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#F7F6F2] to-amber-50 flex items-center justify-center px-4">
    <div className="w-full max-w-md text-center">
      
      {/* Animated Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg animate-pulse">
          <Spinner size="lg" color="white" />
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

// ─── Error State ──────────────────────────────────────────────────────────────

const VerificationError = memo(({ onRetry, onGoHome }) => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#F7F6F2] to-amber-50 flex items-center justify-center px-4">
    <Card className="w-full max-w-md">
      <div className="text-center">
        
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <Icon name="close" size={48} className="text-red-500" strokeWidth={2} />
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
    </Card>
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
      navigate("/");
      return;
    }
    verifyMutation.mutate(token);
  }, [token, navigate]);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#F7F6F2] to-amber-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <SuccessState
            title="Email Verified!"
            message="Your email has been successfully verified. You'll be redirected to the home page shortly."
            showRedirectIndicator={true}
          />
        </Card>
      </div>
    );
  }

  if (verifyMutation.isError) {
    return <VerificationError onRetry={handleRetry} onGoHome={handleGoHome} />;
  }

  // Initial state (should not be visible due to useEffect)
  return <VerifyingState />;
});

export default VerifyEmailPage;
