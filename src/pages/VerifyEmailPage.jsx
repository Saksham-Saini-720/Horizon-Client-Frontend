import { memo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useVerifyEmail from "../hooks/auth/useVerifyEmail";
import Spinner from "../components/ui/Spinner";
import AuthPageHeader from "../components/auth/AuthPageHeader";

const MotionCard = motion.div;

const VerifyEmailPage = memo(() => {
  const { token }      = useParams();
  const navigate       = useNavigate();
  const verifyMutation        = useVerifyEmail();
  const { mutate: verifyOnce } = verifyMutation;

  // verifyOnce (mutate) is a stable reference in TanStack Query, so including it in deps is safe
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    verifyOnce({ token, portal: "client" });
  }, [token, navigate, verifyOnce]);

  const handleRetry  = () => { if (token) verifyMutation.mutate(token); };
  const handleGoHome = () => navigate("/");

  const isPending = verifyMutation.isPending || (!verifyMutation.isSuccess && !verifyMutation.isError);
  const isSuccess = verifyMutation.isSuccess;
  const isError   = verifyMutation.isError;

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-hidden">

      <AuthPageHeader />

      {/* ── Card — constrained width, slides up on mount ── */}
      <div className="flex justify-center px-5 -mt-7 pb-12 w-full z-20">
        <MotionCard
          className="bg-white rounded-3xl shadow-2xl w-full px-8 pt-8 pb-8 text-center"
          style={{ minWidth: 390 }}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
        >

          {isPending && (
            /* ── Verifying state ─────────────────────────── */
            <>
              <div className="mb-5 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center animate-pulse">
                  <Spinner size="md" color="#C96C38" />
                </div>
              </div>

              <h2 className="text-[28px] font-bold text-center text-primary mb-1">
                Verifying your{" "}
                <span className="italic font-normal" style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}>
                  email
                </span>
              </h2>
              <p className="text-sm text-gray-400 italic text-center">
                Please wait while we verify your email address…
              </p>
            </>
          )}

          {isSuccess && (
            /* ── Success state ───────────────────────────── */
            <>
              <div className="mb-5 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              <h2 className="text-[28px] font-bold text-center text-primary mb-1">
                Email{" "}
                <span className="italic font-normal" style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}>
                  Verified!
                </span>
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
                Your email has been successfully verified. You&apos;ll be redirected to the home page shortly.
              </p>

              {/* Redirect indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <p className="text-[14px] text-gray-400">Redirecting</p>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0s" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>

              <button
                onClick={handleGoHome}
                className="w-full py-4 rounded-full text-white text-[15px] font-semibold transition-colors"
                style={{ backgroundColor: "#C96C38" }}
              >
                Go to Home →
              </button>
            </>
          )}

          {isError && (
            /* ── Error state ─────────────────────────────── */
            <>
              <div className="mb-5 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              </div>

              <h2 className="text-[28px] font-bold text-center text-primary mb-1">
                Verification{" "}
                <span className="italic font-normal" style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}>
                  Failed
                </span>
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                We couldn&apos;t verify your email. The link may have expired or is invalid.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRetry}
                  className="w-full py-4 rounded-full text-white text-[15px] font-semibold transition-colors"
                  style={{ backgroundColor: "#C96C38" }}
                >
                  Try Again →
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full py-3.5 rounded-full border border-gray-200 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Go to Home
                </button>
              </div>

              <p className="text-sm text-center text-gray-400 mt-5">
                Need help?{" "}
                <a
                  href="/support"
                  className="font-semibold hover:underline"
                  style={{ color: "#C96C38" }}
                >
                  Contact Support
                </a>
              </p>
            </>
          )}

        </MotionCard>
      </div>
    </div>
  );
});

export default VerifyEmailPage;
