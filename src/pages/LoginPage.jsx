
import { useRef, useState, useCallback } from "react";
import { useEmailLoginMutation, useSendOtpMutation, useVerifyOtpMutation } from "../hooks/auth/useLoginMutations";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// ─── Field validators ─────────────────────────────────────────────────────────

const VALIDATORS = {
  email:    (v) => !v.trim()                      ? "Email is required"
                 : !/\S+@\S+\.\S+/.test(v)        ? "Enter a valid email address"
                 : null,
  password: (v) => !v                             ? "Password is required"
                 : v.length < 8                   ? "Password must be at least 8 characters"
                 : null,
  phone:    (v) => !v.trim()                      ? "Phone number is required"
                 : !/^\+?[\d\s\-]{7,15}$/.test(v) ? "Enter a valid phone number"
                 : null,
  otp:      (v) => !v.trim()                      ? "OTP is required"
                 : v.length !== 6                  ? "Enter the 6-digit OTP"
                 : null,
};

// ─── Validated Input ──────────────────────────────────────────────────────────

const ValidatedInput = ({ inputRef, name, type = "text", placeholder, required, className = "", extraClass = "" }) => {
  const [fieldError, setFieldError] = useState("");

  const handleBlur  = useCallback(() => {
    const err = VALIDATORS[name]?.(inputRef.current?.value ?? "");
    setFieldError(err ?? "");
  }, [name, inputRef]);

  const handleFocus = useCallback(() => setFieldError(""), []);

  return (
    <div>
      <input
        ref={inputRef}
        type={type}
        name={name}
        defaultValue=""
        placeholder={placeholder}
        required={required}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400
          outline-none transition-colors ${className} ${extraClass}
          ${fieldError ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-gray-800"}`}
      />
      {fieldError && (
        <p className="text-xs text-red-500 mt-1">{fieldError}</p>
      )}
    </div>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

// ─── Error Banner ─────────────────────────────────────────────────────────────

const ErrorBanner = ({ error }) => {
  if (!error) return null;

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

// ─── Submit Button ────────────────────────────────────────────────────────────

const SubmitBtn = ({ isPending, label, loadingLabel }) => (
  <button
    type="submit"
    disabled={isPending}
    className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl disabled:opacity-60 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
  >
    {isPending && <Spinner />}
    {isPending ? loadingLabel : label}
  </button>
);

// ─── Email Form ───────────────────────────────────────────────────────────────

const EmailForm = ({ mutation }) => {
  const emailRef    = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const email    = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    const emailErr    = VALIDATORS.email(email);
    const passwordErr = VALIDATORS.password(password);

    if (emailErr || passwordErr) return;

    mutation.mutate({ email, password });
  }, [mutation]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Email Address
      </label>
      <ValidatedInput inputRef={emailRef} name="email" type="email" placeholder="john@example.com" required className="mb-3" />

      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Password
      </label>
      <ValidatedInput inputRef={passwordRef} name="password" type="password" placeholder="••••••••" required className="mb-2" />

      <div className="flex justify-end mb-5">
        <button type="button" className="text-xs text-amber-600 hover:underline">
          Forgot password?
        </button>
      </div>

      <SubmitBtn isPending={mutation.isPending} label="Log In" loadingLabel="Logging in..." />
    </form>
  );
};

// ─── Phone Form ───────────────────────────────────────────────────────────────

const PhoneForm = ({ sendOtpMutation, verifyOtpMutation }) => {
  const phoneRef = useRef(null);
  const otpRef   = useRef(null);
  const [otpSent, setOtpSent] = useState(false);

  // ── Step 1: Send OTP ──

  const handleSendOtp = useCallback((e) => {
    e.preventDefault();
    const phone = phoneRef.current?.value.trim() ?? "";
    const phoneErr = VALIDATORS.phone(phone);
    if (phoneErr) return;

    sendOtpMutation.mutate({ phone }, {
      onSuccess: () => setOtpSent(true),
    });
  }, [sendOtpMutation]);

  // ── Step 2: Verify OTP ──

  const handleVerifyOtp = useCallback((e) => {
    e.preventDefault();
    const phone = phoneRef.current?.value.trim() ?? "";
    const otp   = otpRef.current?.value.trim() ?? "";
    const otpErr = VALIDATORS.otp(otp);
    if (otpErr) return;

    verifyOtpMutation.mutate({ phone, otp });
  }, [verifyOtpMutation]);

  // ── Render ──

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOtp} noValidate>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Phone Number
        </label>
        <ValidatedInput inputRef={phoneRef} name="phone" type="tel" placeholder="+260 97X XXX XXX" required className="mb-5" />
        <SubmitBtn isPending={sendOtpMutation.isPending} label="Send OTP →" loadingLabel="Sending..." />
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOtp} noValidate>
      <p className="text-sm text-gray-600 mb-4">
        OTP sent to <span className="font-semibold">{phoneRef.current?.value}</span>
      </p>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Enter OTP
      </label>
      <ValidatedInput inputRef={otpRef} name="otp" type="text" placeholder="• • • • • •" required className="mb-5" extraClass="tracking-[0.5em] text-center font-bold" />
      <SubmitBtn isPending={verifyOtpMutation.isPending} label="Verify OTP" loadingLabel="Verifying..." />
      <button type="button" onClick={() => setOtpSent(false)} className="w-full text-center text-sm text-gray-500 mt-3 hover:text-gray-700">
        ← Change number
      </button>
    </form>
  );
};

// ─── LoginPage ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("email");

  // Mutations
  const emailLoginMutation = useEmailLoginMutation();
  const sendOtpMutation    = useSendOtpMutation();
  const verifyOtpMutation  = useVerifyOtpMutation();

  // Current error (from active tab's mutation)
  const currentError = activeTab === "email"
    ? emailLoginMutation.error
    : sendOtpMutation.error || verifyOtpMutation.error;

  const handleTabSwitch = useCallback((tab) => {
    setActiveTab(tab);
    // Reset all mutations on tab switch
    emailLoginMutation.reset();
    sendOtpMutation.reset();
    verifyOtpMutation.reset();
  }, [emailLoginMutation, sendOtpMutation, verifyOtpMutation]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Log in to continue</h2>
        <p className="text-sm text-gray-500 mb-6">
          Access your saved properties, inquiries, and more.
        </p>

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
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {[
            { id: "phone", label: "📞 Phone" },
            { id: "email", label: "✉️ Email" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleTabSwitch(id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === id
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        <ErrorBanner error={currentError} />

        {/* Active Form */}
        {activeTab === "email"
          ? <EmailForm key="email" mutation={emailLoginMutation} />
          : <PhoneForm key="phone" sendOtpMutation={sendOtpMutation} verifyOtpMutation={verifyOtpMutation} />
        }

        {/* Terms */}
        <p className="text-xs text-center text-gray-400 mt-5">
          By continuing, you agree to our{" "}
          <a href="/terms"   className="text-amber-600 hover:underline">Terms</a> and{" "}
          <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a>
        </p>

      </div>
    </div>
  );
}
