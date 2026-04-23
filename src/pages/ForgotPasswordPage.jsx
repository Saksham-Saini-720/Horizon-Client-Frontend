import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useForgotPassword from "../hooks/auth/useForgotPassword";
import ValidatedInput from "../components/forms/ValidatedInput";
import Spinner from "../components/ui/Spinner";
import AuthPageHeader from "../components/auth/AuthPageHeader";

const MotionCard = motion.div;

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
  return null;
};

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function ForgotPasswordPage() {
  const navigate               = useNavigate();
  const emailRef               = useRef(null);
  const forgotPasswordMutation = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim() ?? "";
    const err   = validateEmail(email);
    if (err) return;
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => setSubmittedEmail(email),
    });
  }, [forgotPasswordMutation]);

  const handleBackToLogin = useCallback(() => navigate("/login"), [navigate]);

  const handleTryAgain = useCallback(() => {
    setSubmittedEmail("");
    forgotPasswordMutation.reset();
    if (emailRef.current) {
      emailRef.current.value = "";
      emailRef.current.focus();
    }
  }, [forgotPasswordMutation]);

  const isSuccess = forgotPasswordMutation.isSuccess && submittedEmail;

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-hidden">

      <AuthPageHeader />

      {/* ── Card — constrained width, slides up on mount ── */}
      <div className="flex justify-center px-5 -mt-7 pb-12 z-20 w-full">
        <MotionCard
          className="bg-white rounded-3xl shadow-2xl w-full px-8 pt-8 pb-8"
          style={{ minWidth: 390 }}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
        >

          {isSuccess ? (
            /* ── Success state ────────────────────────────── */
            <div className="text-center">
              <div className="mb-5 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              <h3 className="text-[24px] font-bold text-primary mb-2">Check Your Email</h3>
              <p className="text-[15px] text-gray-500 mb-5">
                We&apos;ve sent a reset link to<br />
                <strong className="text-primary">{submittedEmail}</strong>
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-[14px] text-amber-800">
                  💡 <strong>Tip:</strong> Check your spam folder if you don&apos;t see the email
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleTryAgain}
                  className="w-full py-3.5 rounded-full border border-gray-200 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Send to Different Email
                </button>
                <button
                  onClick={handleBackToLogin}
                  className="w-full py-3.5 rounded-full text-white text-[15px] font-semibold transition-colors"
                  style={{ backgroundColor: "#C96C38" }}
                >
                  Back to Login
                </button>
              </div>

              <p className="text-[14px] text-center text-gray-400 mt-5">
                Didn&apos;t receive the email?{" "}
                <button
                  onClick={() => forgotPasswordMutation.mutate(submittedEmail)}
                  className="font-semibold hover:underline"
                  style={{ color: "#C96C38" }}
                >
                  Resend
                </button>
              </p>
            </div>

          ) : (
            /* ── Form state ───────────────────────────────── */
            <>
              {/* Alert icon */}
              <div className="mb-5 flex justify-center ">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C96C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
              </div>

              <h2 className="text-[28px] font-bold text-center text-primary mb-1">
                Forgot{" "}
                <span className="italic font-normal" style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}>
                  password?
                </span>
              </h2>
              <p className="text-sm text-gray-400 italic text-center mb-6">
                Enter your email to receive a reset link
              </p>

              {/* Error banner */}
              {forgotPasswordMutation.error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-xl px-4 py-3 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {forgotPasswordMutation.error.response?.data?.message || "Failed to send reset link"}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                    Email Address
                  </p>
                  <ValidatedInput
                    inputRef={emailRef}
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    validator={validateEmail}
                    leftIcon={<MailIcon />}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full text-white font-semibold py-4 rounded-full disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-[15px]"
                  style={{ backgroundColor: "#C96C38" }}
                >
                  {forgotPasswordMutation.isPending && <Spinner size="sm" />}
                  {forgotPasswordMutation.isPending ? "Sending…" : "Send Reset Link →"}
                </button>
              </form>

              <p className="text-sm text-center text-gray-400 mt-5">
                Remember your password?{" "}
                <button
                  onClick={handleBackToLogin}
                  className="font-semibold hover:underline"
                  style={{ color: "#C96C38" }}
                >
                  Sign in
                </button>
              </p>
            </>
          )}

        </MotionCard>
      </div>
    </div>
  );
}
