
import { useRef, useCallback } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const MotionCard = motion.div;
import { FaApple } from "react-icons/fa";
import { useEmailLoginMutation } from "../hooks/auth/useLoginMutations";
import ValidatedInput from "../components/forms/ValidatedInput";
import ErrorBanner from "../components/forms/ErrorBanner";
import Spinner from "../components/ui/Spinner";
import AuthPageHeader from "../components/auth/AuthPageHeader";

const VALIDATORS = {
  email: (v) => !v.trim() ? "Email is required"
    : !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email address"
    : null,
  password: (v) => !v ? "Password is required"
    : v.length < 8 ? "Password must be at least 8 characters"
    : null,
};

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function LoginPage() {
  const navigate    = useNavigate();
  const emailRef    = useRef(null);
  const passwordRef = useRef(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user            = useSelector((state) => state.auth.user);

  const emailLoginMutation = useEmailLoginMutation();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const email    = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    const emailErr = VALIDATORS.email(email);
    const passErr  = VALIDATORS.password(password);

    if (emailErr || passErr) {
      [emailRef, passwordRef].forEach((ref) => {
        ref.current?.focus();
        ref.current?.blur();
      });
      return;
    }

    emailLoginMutation.mutate({ email, password });
  }, [emailLoginMutation]);

  if (isAuthenticated && user?.emailVerification === true) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && user?.emailVerification === false) {
    return <Navigate to="/verify-email" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface w-full overflow-hidden">

      <AuthPageHeader />

      {/* ── Card — slides up from below on mount ── */}
      <div className="flex justify-center px-5 -mt-7 pb-12 mb-6 w-full z-20">
        <MotionCard
          className="bg-white rounded-3xl shadow-2xl w-full px-8 pt-8 pb-8"
          style={{ minWidth: "320px" }}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
        >
          <h2 className="text-[28px] font-bold text-center text-primary mb-1">
            Welcome{" "}
            <span
              className="italic font-normal"
              style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}
            >
              back
            </span>
          </h2>
          <p className="text-sm text-gray-400 italic text-center mb-6">
            Sign in to continue your search
          </p>

          <ErrorBanner error={emailLoginMutation.error} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                Email Address
              </p>
              <ValidatedInput
                inputRef={emailRef}
                name="email"
                type="email"
                placeholder="enter your email"
                required
                validator={VALIDATORS.email}
                leftIcon={<MailIcon />}
              />
            </div>

            <div className="mb-2">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                Password
              </p>
              <ValidatedInput
                inputRef={passwordRef}
                name="password"
                type="password"
                placeholder="••••••••"
                required
                validator={VALIDATORS.password}
                leftIcon={<LockIcon />}
              />
            </div>

            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium hover:underline"
                style={{ color: "#C96C38" }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={emailLoginMutation.isPending}
              className="w-full text-white font-semibold py-4 rounded-full disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-[15px]"
              style={{ backgroundColor: "#C96C38" }}
            >
              {emailLoginMutation.isPending && <Spinner size="sm" />}
              {emailLoginMutation.isPending ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          {/* <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div> */}

          {/* <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaApple className="w-5 h-5" />
              Apple
            </button>
          </div> */}

          <p className="text-sm text-center text-gray-400 mt-5">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold hover:underline"
              style={{ color: "#C96C38" }}
            >
              Create an account
            </Link>
          </p>
        </MotionCard>
      </div>
    </div>
  );
}
