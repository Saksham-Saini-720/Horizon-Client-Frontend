
import { useRef, useCallback } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEmailLoginMutation } from "../hooks/auth/useLoginMutations";
import ValidatedInput from "../components/forms/ValidatedInput";
import ErrorBanner from "../components/forms/ErrorBanner";
import SubmitButton from "../components/forms/SubmitButton";
import AuthTerms from "../components/auth/AuthTerms";

const VALIDATORS = {
  email: (v) => !v.trim() ? "Email is required"
    : !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email address"
    : null,
  password: (v) => !v ? "Password is required"
    : v.length < 8 ? "Password must be at least 8 characters"
    : null,
};

export default function LoginPage() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mb-11">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        <h2 className="text-2xl font-semibold font-font-myriad text-gray-900 mb-1">
          Log in to continue
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Access your saved properties, inquiries, and more.
        </p>

        <ErrorBanner error={emailLoginMutation.error} />

        <form onSubmit={handleSubmit} noValidate>
          <ValidatedInput
            inputRef={emailRef}
            name="email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            required
            validator={VALIDATORS.email}
            className="mb-3"
          />

          <ValidatedInput
            inputRef={passwordRef}
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
            validator={VALIDATORS.password}
            className="mb-2"
          />

          <div className="flex justify-end mb-5">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-gray-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <SubmitButton
            loading={emailLoginMutation.isPending}
            label="Log In"
            loadingLabel="Logging in..."
          />
        </form>

        <AuthTerms />

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-gray-900 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
