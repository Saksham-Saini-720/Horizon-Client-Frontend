import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useRegisterMutation from "../hooks/auth/useRegisterMutation";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// ─── Field-level validators ───────────────────────────────────────────────────

const VALIDATORS = {
  firstName: (v) => !v.trim()                    ? "First name required"          : null,
  lastName:  (v) => !v.trim()                    ? "Last name required"           : null,
  email:     (v) => !/\S+@\S+\.\S+/.test(v)     ? "Enter a valid email"          : null,
  password:  (v) => v.length < 8                 ? "Min 8 characters required"    : null,
  phone:     (v) => v && !/^\+?[\d\s\-]{7,15}$/.test(v)
                                                 ? "Enter a valid phone number"   : null,
};

// ─── Input Field Component ────────────────────────────────────────────────────

const Field = ({ label, name, inputRef, type = "text", placeholder, required, hint, maxLength }) => {
  const [fieldError, setFieldError] = useState("");

  const handleBlur = useCallback(() => {
    const value = inputRef.current?.value ?? "";
    const error = VALIDATORS[name]?.(value) ?? null;
    setFieldError(error ?? "");
  }, [name, inputRef]);

  const handleFocus = useCallback(() => setFieldError(""), []);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{" "}
        {!required && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        onBlur={handleBlur}
        onFocus={handleFocus}
        defaultValue=""
        className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400
          outline-none transition-colors
          ${fieldError
            ? "border-red-300 bg-red-50 focus:border-red-400"
            : "border-gray-200 focus:border-gray-800"
          }`}
      />
      {fieldError && (
        <p className="text-xs text-red-500 mt-1">{fieldError}</p>
      )}
      {hint && !fieldError && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
};

// ─── Error Banner ─────────────────────────────────────────────────────────────

const ErrorBanner = ({ error }) => {
  if (!error) return null;

  // TanStack Query error object ya string
  const message = typeof error === "string"
    ? error
    : error?.message ?? "Something went wrong. Please try again.";

  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
    </div>
  );
};

// ─── RegisterPage ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  // Refs — uncontrolled inputs, zero re-renders on typing
  const firstNameRef = useRef(null);
  const lastNameRef  = useRef(null);
  const emailRef     = useRef(null);
  const passwordRef  = useRef(null);
  const phoneRef     = useRef(null);

  // TanStack Query mutation
  const registerMutation = useRegisterMutation();

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Read values from refs
    const values = {
      firstName: firstNameRef.current?.value.trim() ?? "",
      lastName:  lastNameRef.current?.value.trim()  ?? "",
      email:     emailRef.current?.value.trim()     ?? "",
      password:  passwordRef.current?.value         ?? "",
      phone:     phoneRef.current?.value.trim()     ?? "",
    };

    // Client-side validation
    const errors = Object.entries(VALIDATORS)
      .map(([key, validate]) => validate(values[key]))
      .filter(Boolean);

    if (errors.length) {
      // Show first validation error
      // You could also set a local error state here if needed
      return;
    }

    // Trigger mutation
    registerMutation.mutate({
      firstName: values.firstName,
      lastName:  values.lastName,
      email:     values.email,
      password:  values.password,
      phone:     values.phone || undefined,
    });

  }, [registerMutation]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mb-14">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h2>
        <p className="text-sm text-gray-500 mb-6">Join Horizon Properties today.</p>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={() => window.location.href = `${API_BASE}/auth/google`}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or sign up with email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Error from mutation */}
        <ErrorBanner error={registerMutation.error} />

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* First + Last Name */}
          <div className="flex gap-3 mb-3">
            <Field
              label="First Name"
              name="firstName"
              inputRef={firstNameRef}
              placeholder="John"
              required
              maxLength={50}
            />
            <Field
              label="Last Name"
              name="lastName"
              inputRef={lastNameRef}
              placeholder="Doe"
              required
              maxLength={50}
            />
          </div>

          <div className="mb-3">
            <Field
              label="Email Address"
              name="email"
              inputRef={emailRef}
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <Field
              label="Password"
              name="password"
              inputRef={passwordRef}
              type="password"
              placeholder="Min 8 characters"
              required
              hint="Use letters, numbers & symbols"
            />
          </div>

          <div className="mb-6">
            <Field
              label="Phone"
              name="phone"
              inputRef={phoneRef}
              type="tel"
              placeholder="+260 97X XXX XXX"
            />
          </div>

          {/* Submit — isPending from mutation */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl disabled:opacity-60 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            {registerMutation.isPending && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            )}
            {registerMutation.isPending ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {/* Terms */}
        <p className="text-xs text-center text-gray-400 mt-4">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-amber-600 hover:underline">Terms</a> and{" "}
          <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a>
        </p>

        {/* Login link */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-semibold hover:underline">Log in</Link>
        </p>

      </div>
    </div>
  );
}
