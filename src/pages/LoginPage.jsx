
import { useRef, useState, useCallback, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEmailLoginMutation, useSendOtpMutation, useVerifyOtpMutation } from "../hooks/auth/useLoginMutations";
import ValidatedInput from "../components/forms/ValidatedInput";
import ErrorBanner from "../components/forms/ErrorBanner";
import SubmitButton from "../components/forms/SubmitButton";
import SocialLogin from "../components/auth/SocialLogin";
import AuthDivider from "../components/auth/AuthDivider";
import AuthTerms from "../components/auth/AuthTerms";

// ─── Validators ───────────────────────────────────────────────────────────────

const VALIDATORS = {
  email: (v) => !v.trim() ? "Email is required"
    : !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email address"
      : null,
  password: (v) => !v ? "Password is required"
    : v.length < 8 ? "Password must be at least 8 characters"
      : null,
  phone: (v) => !v.trim() ? "Phone number is required"
    : !/^\+?[\d\s\-]{7,15}$/.test(v) ? "Enter a valid phone number"
      : null,
  otp: (v) => !v.trim() ? "OTP is required"
    : v.length !== 6 ? "Enter the 6-digit OTP"
      : null,
};

// ─── Email Form ───────────────────────────────────────────────────────────────

const EmailForm = ({ mutation }) => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    const emailErr = VALIDATORS.email(email);
    const passwordErr = VALIDATORS.password(password);
    if (emailErr || passwordErr) return;

    mutation.mutate({ email, password });
  }, [mutation]);

  return (
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
          className="text-xs text-amber-600 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <SubmitButton
        loading={mutation.isPending}
        label="Log In"
        loadingLabel="Logging in..."
      />
    </form>
  );
};

// ─── Phone Form ───────────────────────────────────────────────────────────────

const PhoneForm = ({ sendOtpMutation, verifyOtpMutation }) => {
  const phoneRef = useRef(null);
  const otpRef = useRef(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = useCallback((e) => {
    e.preventDefault();
    const phone = phoneRef.current?.value.trim() ?? "";
    const phoneErr = VALIDATORS.phone(phone);
    if (phoneErr) return;

    sendOtpMutation.mutate({ phone }, {
      onSuccess: () => setOtpSent(true),
    });
  }, [sendOtpMutation]);

  const handleVerifyOtp = useCallback((e) => {
    e.preventDefault();
    const phone = phoneRef.current?.value.trim() ?? "";
    const otp = otpRef.current?.value.trim() ?? "";
    const otpErr = VALIDATORS.otp(otp);
    if (otpErr) return;

    verifyOtpMutation.mutate({ phone, otp });
  }, [verifyOtpMutation]);

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOtp} noValidate>
        <ValidatedInput
          inputRef={phoneRef}
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="+260 97X XXX XXX"
          required
          validator={VALIDATORS.phone}
          className="mb-5"
        />
        <SubmitButton
          loading={sendOtpMutation.isPending}
          label="Send OTP →"
          loadingLabel="Sending..."
        />
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOtp} noValidate>
      <p className="text-sm text-gray-600 mb-4">
        OTP sent to <span className="font-semibold">{phoneRef.current?.value}</span>
      </p>
      <ValidatedInput
        inputRef={otpRef}
        name="otp"
        type="text"
        label="Enter OTP"
        placeholder="• • • • • •"
        required
        validator={VALIDATORS.otp}
        className="mb-5"
        extraClass="tracking-[0.5em] text-center font-bold"
      />
      <SubmitButton
        loading={verifyOtpMutation.isPending}
        label="Verify OTP"
        loadingLabel="Verifying..."
      />
      <button
        type="button"
        onClick={() => setOtpSent(false)}
        className="w-full text-center text-sm text-gray-500 mt-3 hover:text-gray-700"
      >
        ← Change number
      </button>
    </form>
  );
};

// ─── LoginPage ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("email");
  
  // Check if already authenticated
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const emailLoginMutation = useEmailLoginMutation();
  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const currentError = activeTab === "email"
    ? emailLoginMutation.error
    : sendOtpMutation.error || verifyOtpMutation.error;

  const handleTabSwitch = useCallback((tab) => {
    setActiveTab(tab);
    emailLoginMutation.reset();
    sendOtpMutation.reset();
    verifyOtpMutation.reset();
  }, [emailLoginMutation, sendOtpMutation, verifyOtpMutation]);

  // ✅ REDIRECT IF ALREADY LOGGED IN
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mb-11">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Log in to continue</h2>
        <p className="text-sm text-gray-500 mb-6">
          Access your saved properties, inquiries, and more.
        </p>

        {/* Google OAuth */}
        <SocialLogin label="Continue with Google" />

        {/* Divider */}
        <AuthDivider text="or continue with" />

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
        {activeTab === "email" ? (
          <EmailForm key="email" mutation={emailLoginMutation} />
        ) : (
          <PhoneForm
            key="phone"
            sendOtpMutation={sendOtpMutation}
            verifyOtpMutation={verifyOtpMutation}
          />
        )}

        {/* Terms */}
        <AuthTerms />

        {/* Register Link */}
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
