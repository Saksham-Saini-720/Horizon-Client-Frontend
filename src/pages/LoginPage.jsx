
import { useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
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
import { needsEmailVerification } from "../utils/roles";

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

// Written by axiosInstance just before it redirects here, so the user is told
// why they were signed out instead of arriving at a bare login form.
const SESSION_ENDED_MESSAGES = {
  inactivity: "You were signed out after a period of inactivity. Please log in again.",
  expired: "Your session has expired. Please log in again.",
};

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

  useEffect(() => {
    try {
      const reason = sessionStorage.getItem("auth:endedReason");
      if (!reason) return;
      // Read once — it must not reappear on a later manual visit.
      sessionStorage.removeItem("auth:endedReason");
      toast(SESSION_ENDED_MESSAGES[reason] ?? SESSION_ENDED_MESSAGES.expired, {
        icon: "⏱️",
      });
    } catch {
      // Storage unavailable; the form still works without the notice.
    }
  }, []);

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

  if (isAuthenticated && needsEmailVerification(user)) {
    return <Navigate to="/verify-email" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas w-full overflow-hidden">

      <AuthPageHeader />

      {/*
        A sheet rising out of the header, not a card floating on a page: full
        bleed, rounded only at the top, and running to the bottom of the screen.
        The side margins and bottom rounding were what made it read as a widget
        sitting on a background rather than as the page itself.

        bg-canvas, so the white inputs inside have a tone to sit on — the same
        reason the property sheet needed it.
      */}
      <div className="flex-1 flex -mt-8 w-full z-20">
        <MotionCard
          className="bg-canvas rounded-t-[32px] shadow-2xl w-full px-7 pt-9 pb-10"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
        >
          <h2 className="text-[28px] font-display font-semibold text-center text-secondary mb-1">
            Welcome{" "}
            <span
              className="italic font-normal"
              style={{ color: "#C96C38", fontFamily: "var(--font-display)" }}
            >
              back
            </span>
          </h2>
          <p className="text-sm font-display text-gray-400 italic text-center mb-6">
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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

            {/*
              The background is a class, not an inline style. It was
              `style={{ backgroundColor }}` before, and an inline value beats any
              class — so a hover/active colour could never have taken effect.
            */}
            <button
              type="submit"
              disabled={emailLoginMutation.isPending}
              className="group relative w-full overflow-hidden py-4 rounded-full text-white font-semibold text-[15px]
                bg-primary-light hover:bg-[#B25E2D] active:bg-[#9C5126]
                shadow-[0_6px_20px_rgba(201,108,56,0.35)] hover:shadow-[0_10px_26px_rgba(201,108,56,0.45)]
                transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
            >
              {/*
                Shine sweep. A band of light parked off the left edge that
                travels across on hover or press, clipped by the button's own
                overflow-hidden so it stays inside the pill.

                Driven by transform rather than `left`: transforms are composited
                so the sweep stays smooth, where animating `left` relayouts every
                frame. The band is wider than the button and angled slightly, so
                it reads as a reflection passing over rather than a bar sliding.
              */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full
                  group-hover:translate-x-full group-active:translate-x-full
                  transition-transform duration-700 ease-out"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 25%, rgba(255,255,255,0.38) 50%, transparent 75%)",
                }}
              />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {emailLoginMutation.isPending && <Spinner size="sm" />}
                {emailLoginMutation.isPending ? "Signing in…" : "Sign in →"}
              </span>
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
