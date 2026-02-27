
import { useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useResetPassword from "../hooks/auth/useResetPassword";
import PasswordInput from "../components/forms/PasswordInput";
import SubmitButton from "../components/forms/SubmitButton";
import SuccessState from "../components/states/SuccessState";
import Card from "../components/ui/Card";
import Icon from "../components/ui/Icon";

// ─── Validators ───────────────────────────────────────────────────────────────

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

// ─── Invalid Token State ──────────────────────────────────────────────────────

const InvalidTokenState = ({ onBackClick }) => (
  <div className="text-center">
    <div className="mb-6 flex justify-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <Icon name="close" size={32} className="text-red-500" />
      </div>
    </div>

    <h3 className="text-[22px] font-bold text-gray-900 mb-2">Invalid or Expired Link</h3>
    <p className="text-[15px] text-gray-600 mb-6">
      This password reset link is invalid or has expired. Please request a new one.
    </p>

    <button
      onClick={onBackClick}
      className="w-full py-3 rounded-xl bg-gray-900 text-white text-[15px] font-semibold hover:bg-gray-800 transition-colors"
    >
      Request New Link
    </button>
  </div>
);

// ─── ResetPasswordPage ────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (!token) navigate("/forgot-password");
  }, [token, navigate]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const password = passwordRef.current?.value ?? "";
    const confirmPassword = confirmPasswordRef.current?.value ?? "";

    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);

    if (passwordErr || confirmPasswordErr) return;

    resetPasswordMutation.mutate({ token, newPassword: password });
  }, [token, resetPasswordMutation]);

  const handleBackToLogin = useCallback(() => navigate("/login"), [navigate]);
  const handleRequestNewLink = useCallback(() => navigate("/forgot-password"), [navigate]);

  // Success state
  if (resetPasswordMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <SuccessState
            title="Password Changed!"
            message="Your password has been successfully reset. You can now log in with your new password."
            showRedirectIndicator={true}
          >
            <button
              onClick={handleBackToLogin}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[15px] font-semibold hover:bg-gray-800 transition-colors"
            >
              Go to Login
            </button>
          </SuccessState>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (resetPasswordMutation.isError && resetPasswordMutation.error?.response?.status === 401) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <InvalidTokenState onBackClick={handleRequestNewLink} />
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mb-11">
      <Card className="w-full max-w-md">
        
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
            <Icon name="lock" size={32} className="text-amber-600" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-[24px] font-bold text-gray-900 mb-2 text-center">
          Reset Your Password
        </h2>
        <p className="text-[15px] text-gray-500 mb-6 text-center">
          Enter your new password below
        </p>

        {/* Error Banner */}
        {resetPasswordMutation.error && resetPasswordMutation.error?.response?.status !== 401 && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-xl px-4 py-3 mb-5">
            <Icon name="error" size={16} className="flex-shrink-0 mt-0.5" />
            {resetPasswordMutation.error.response?.data?.message || "Failed to reset password"}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <PasswordInput
            inputRef={passwordRef}
            name="password"
            label="New Password"
            placeholder="••••••••"
            required
            validator={validatePassword}
            showStrength={true}
            className="mb-4"
          />

          <PasswordInput
            inputRef={confirmPasswordRef}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            required
            validator={(value) => validateConfirmPassword(passwordRef.current?.value ?? "", value)}
            className="mb-4"
          />

          {/* Password Requirements */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5">
            <p className="text-[12px] text-gray-600 mb-1.5 font-semibold">
              Password must contain:
            </p>
            <ul className="text-[12px] text-gray-600 space-y-0.5">
              <li>• At least 8 characters</li>
              <li>• Mix of uppercase and lowercase letters (recommended)</li>
              <li>• At least one number (recommended)</li>
              <li>• At least one special character (recommended)</li>
            </ul>
          </div>

          <SubmitButton
            loading={resetPasswordMutation.isPending}
            label="Reset Password"
            loadingLabel="Resetting Password..."
          />
        </form>

        {/* Footer */}
        <p className="text-[13px] text-center text-gray-400 mt-6">
          Remember your password?{" "}
          <button
            onClick={handleBackToLogin}
            className="text-amber-600 font-semibold hover:underline"
          >
            Log in
          </button>
        </p>
      </Card>
    </div>
  );
}
