
import { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/utils/useRedux";
import useResendVerification from "../hooks/auth/useResendVerification";

const EmailVerificationPage = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const resendMutation = useResendVerification();
  
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer after resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = useCallback(() => {
    if (!canResend || resendMutation.isPending) return;
    
    resendMutation.mutate(undefined, {
      onSuccess: () => {
        setCountdown(60); // 60 second cooldown
        setCanResend(false);
      },
    });
  }, [canResend, resendMutation]);

  const handleGoToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#F7F6F2] to-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          
          {/* Email Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[26px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-3">
            Check Your Email
          </h1>

          {/* Message */}
          <p className="text-[15px] text-gray-600 font-['DM_Sans',sans-serif] leading-relaxed mb-6">
            We've sent a verification email to{" "}
            <span className="font-semibold text-[#1C2A3A]">
              {user?.email || "your email address"}
            </span>
            . Click the link in the email to verify your account.
          </p>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-[13px] text-amber-800 font-['DM_Sans',sans-serif] leading-relaxed">
              💡 <strong>Tip:</strong> Can't find the email? Check your spam or junk folder.
            </p>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={!canResend || resendMutation.isPending || countdown > 0}
            className="w-full px-6 py-3.5 rounded-xl text-[15px] font-semibold font-['DM_Sans',sans-serif] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mb-3"
            style={{ 
              background: canResend && countdown === 0 && !resendMutation.isPending
                ? "linear-gradient(135deg, #F5B731, #E8A020)" 
                : "#E5E7EB",
              color: canResend && countdown === 0 && !resendMutation.isPending
                ? "white"
                : "#9CA3AF"
            }}
          >
            {resendMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend Verification Email"
            )}
          </button>

          {/* Back to Login */}
          <button
            onClick={handleGoToLogin}
            className="w-full px-6 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] hover:bg-gray-50 active:scale-95 transition-all"
          >
            Back to Login
          </button>

        </div>

        {/* Footer Note */}
        <p className="text-center text-[13px] text-gray-500 mt-6 font-['DM_Sans',sans-serif]">
          Already verified?{" "}
          <button
            onClick={handleGoToLogin}
            className="text-amber-600 font-semibold hover:text-amber-700 hover:underline"
          >
            Log in here
          </button>
        </p>

      </div>
    </div>
  );
});

export default EmailVerificationPage;
