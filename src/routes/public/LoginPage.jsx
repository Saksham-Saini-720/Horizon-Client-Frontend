
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setTokens } from "../../utils/token";
import { loginUser, sendOtp, verifyOtp } from "../../api/authApi";


export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("LoginPage location:", location);
  const from = location.state?.from?.pathname || "/";

  const [activeTab, setActiveTab] = useState("email"); // "email" | "phone"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone form state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // ── Email Login ────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await loginUser({
        email,
        password,
        device : "web"
      })

      // Save tokens
      setTokens(res.data.accessToken, res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(from, { replace: true });

    } catch (err) {
      setError(err || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Send OTP ───────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await sendOtp({ phone });

      setOtpSent(true);

    } catch (err) {
      setError(err ? err : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verify OTP ─────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await verifyOtp({ phone, otp });

      setTokens(res.data.accessToken, res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(from, { replace: true });

    } catch (err) {
      setError(err  ? err : "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Log in to continue</h2>
        <p className="text-sm text-gray-500 mb-6">
          Access your saved properties, inquiries, and more.
        </p>

        {/* Google Button */}
        <button
          onClick={() => window.location.href = `${API_BASE}/auth/google`}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 mb-5"
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
          <button
            onClick={() => { setActiveTab("phone"); setError(""); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "phone" ? "bg-white shadow text-gray-800" : "text-gray-500"
            }`}
          >
            📞 Phone
          </button>
          <button
            onClick={() => { setActiveTab("email"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "email" ? "bg-white shadow text-gray-800" : "text-gray-500"
            }`}
          >
            ✉️ Email
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* ── Phone Tab ── */}
        {activeTab === "phone" && (
          !otpSent ? (
            <form onSubmit={handleSendOtp}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+260 97X XXX XXX"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-800 mb-5"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl disabled:opacity-60"
              >
                {isLoading ? "Sending..." : "Send OTP →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <p className="text-sm text-gray-600 mb-4">
                OTP sent to <span className="font-semibold">{phone}</span>
              </p>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-800 mb-5 tracking-widest text-center font-bold"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl disabled:opacity-60"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="w-full text-center text-sm text-gray-500 mt-3"
              >
                ← Change number
              </button>
            </form>
          )
        )}

        {/* ── Email Tab ── */}
        {activeTab === "email" && (
          <form onSubmit={handleEmailLogin}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-800 mb-3"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-800 mb-2"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        )}

        {/* Terms */}
        <p className="text-xs text-center text-gray-400 mt-5">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-amber-600 hover:underline">Terms</a>{" "}
          and{" "}
          <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a>
        </p>

      </div>
    </div>
  );
}
