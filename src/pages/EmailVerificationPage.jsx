import { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/utils/useRedux";
import useResendVerification from "../hooks/auth/useResendVerification";
import { useDispatch } from "react-redux";
import { clearAuth } from "../store/slices/authSlice";
import Spinner from "../components/ui/Spinner";
import AuthPageHeader from "../components/auth/AuthPageHeader";

const MotionCard = motion.div;

const EmailVerificationPage = memo(() => {
  const navigate       = useNavigate();
  const { user }       = useAuth();
  const dispatch       = useDispatch();
  const resendMutation = useResendVerification();

  const [countdown, setCountdown] = useState(0);
  const [canResend,  setCanResend]  = useState(true);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      // eslint-disable-next-line
      setCanResend(true);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [countdown, canResend]);

  const handleResend = useCallback(() => {
    if (!canResend || resendMutation.isPending) return;
    resendMutation.mutate(undefined, {
      onSuccess: () => {
        setCountdown(60);
        setCanResend(false);
      },
    });
  }, [canResend, resendMutation]);

  const handleGoToLogin = useCallback(() => {
    dispatch(clearAuth());
    navigate("/login");
  }, [dispatch, navigate]);

  const resendActive = canResend && countdown === 0 && !resendMutation.isPending;

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
          {/* Envelope icon */}
          <div className="mb-5 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#C96C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-[28px] font-bold text-center text-primary mb-1">
            Check your{" "}
            <span className="italic font-normal" style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}>
              email
            </span>
          </h2>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-primary">
              {user?.email || "your email address"}
            </span>
            . Click the link to verify your account.
          </p>

          {/* Tip box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-[14px] text-amber-800 leading-relaxed">
              💡 <strong>Tip:</strong> Can&apos;t find the email? Check your spam or junk folder.
            </p>
          </div>

          {/* Resend button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={!resendActive}
            className="w-full py-4 rounded-full text-[15px] font-semibold transition-colors disabled:cursor-not-allowed mb-3 flex items-center justify-center gap-2"
            style={{
              backgroundColor: resendActive ? "#C96C38" : "#E5E7EB",
              color:           resendActive ? "#ffffff" : "#9CA3AF",
            }}
          >
            {resendMutation.isPending ? (
              <><Spinner size="sm" /> Sending…</>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend Verification Email"
            )}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={handleGoToLogin}
            className="w-full py-3.5 rounded-full border border-gray-200 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Login
          </button>

          <p className="text-sm text-center text-gray-400 mt-5">
            Already verified?{" "}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="font-semibold hover:underline"
              style={{ color: "#C96C38" }}
            >
              Log in here
            </button>
          </p>
        </MotionCard>
      </div>
    </div>
  );
});

export default EmailVerificationPage;
