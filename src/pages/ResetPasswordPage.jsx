import { useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useResetPassword from "../hooks/auth/useResetPassword";
import PasswordInput from "../components/forms/PasswordInput";
import Spinner from "../components/ui/Spinner";
import AuthPageHeader from "../components/auth/AuthPageHeader";

const MotionCard = motion.div;

const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
};

const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

export default function ResetPasswordPage() {
  const { token }              = useParams();
  const navigate               = useNavigate();
  const passwordRef            = useRef(null);
  const confirmPasswordRef     = useRef(null);
  const resetPasswordMutation  = useResetPassword();

  useEffect(() => {
    if (!token) navigate("/forgot-password");
  }, [token, navigate]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    resetPasswordMutation.reset();
    const password        = passwordRef.current?.value ?? "";
    const confirmPassword = confirmPasswordRef.current?.value ?? "";

    const passwordErr        = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);
    if (passwordErr || confirmPasswordErr) return;

    resetPasswordMutation.mutate({ token, newPassword: password, portal: "client" });
  }, [token, resetPasswordMutation]);

  const handleBackToLogin    = useCallback(() => navigate("/login"),           [navigate]);
  const handleRequestNewLink = useCallback(() => navigate("/forgot-password"), [navigate]);

  const isSuccess      = resetPasswordMutation.isSuccess && !resetPasswordMutation.isError;
  const isInvalidToken = resetPasswordMutation.isError && resetPasswordMutation.error?.response?.status === 401;

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-hidden">

      <AuthPageHeader />

      {/* ── Card — constrained width, slides up on mount ── */}
      <div className="flex justify-center px-5 -mt-7 pb-12 w-full z-20">
        <MotionCard
          className="bg-white rounded-3xl shadow-2xl w-full px-8 pt-8 pb-8"
          style={{ minWidth: 390 }}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
        >

          {isSuccess ? (
            /* ── Success state ───────────────────────────── */
            <div className="text-center">
              <div className="mb-5 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              <h3 className="text-[26px] font-bold text-primary mb-2">Password Changed!</h3>
              <p className="text-[15px] text-gray-500 mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>

              <button
                onClick={handleBackToLogin}
                className="w-full py-4 rounded-full text-white text-[15px] font-semibold transition-colors"
                style={{ backgroundColor: "#C96C38" }}
              >
                Go to Login →
              </button>
            </div>

          ) : isInvalidToken ? (
            /* ── Invalid token state ─────────────────────── */
            <div className="text-center">
              <div className="mb-5 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              </div>

              <h3 className="text-[24px] font-bold text-primary mb-2">Invalid or Expired Link</h3>
              <p className="text-[15px] text-gray-500 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>

              <button
                onClick={handleRequestNewLink}
                className="w-full py-4 rounded-full text-white text-[15px] font-semibold transition-colors"
                style={{ backgroundColor: "#C96C38" }}
              >
                Request New Link →
              </button>
            </div>

          ) : (
            /* ── Form state ──────────────────────────────── */
            <>
              {/* Lock icon */}
              <div className="mb-5 flex justify-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C96C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>

              <h2 className="text-[28px] font-bold text-center text-primary mb-1">
                Reset your{" "}
                <span className="italic font-normal" style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}>
                  password
                </span>
              </h2>
              <p className="text-sm text-gray-400 italic text-center mb-6">
                Enter your new password below
              </p>

              {/* Error banner — non-401 errors */}
              {resetPasswordMutation.error && !isInvalidToken && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-xl px-4 py-3 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {resetPasswordMutation.error.response?.data?.message || "Failed to reset password"}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* New Password */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                    New Password
                  </p>
                  <PasswordInput
                    inputRef={passwordRef}
                    name="password"
                    placeholder="••••••••"
                    required
                    validator={validatePassword}
                    showStrength={true}
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                    Confirm Password
                  </p>
                  <PasswordInput
                    inputRef={confirmPasswordRef}
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    validator={(value) => validateConfirmPassword(passwordRef.current?.value ?? "", value)}
                  />
                </div>

                {/* Password requirements */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6">
                  <p className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Password must contain
                  </p>
                  <ul className="text-[12px] text-gray-500 space-y-0.5">
                    <li>• At least 8 characters</li>
                    <li>• Mix of uppercase &amp; lowercase (recommended)</li>
                    <li>• At least one number (recommended)</li>
                    <li>• At least one special character (recommended)</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full text-white font-semibold py-4 rounded-full disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-[15px]"
                  style={{ backgroundColor: "#C96C38" }}
                >
                  {resetPasswordMutation.isPending && <Spinner size="sm" />}
                  {resetPasswordMutation.isPending ? "Resetting…" : "Reset Password →"}
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
