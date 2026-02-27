
import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useForgotPassword from "../hooks/auth/useForgotPassword";
import ValidatedInput from "../components/forms/ValidatedInput";
import SubmitButton from "../components/forms/SubmitButton";
import SuccessState from "../components/states/SuccessState";
import Card from "../components/ui/Card";
import Icon from "../components/ui/Icon";

// ─── Email Validator ──────────────────────────────────────────────────────────

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
  return null;
};

// ─── ForgotPasswordPage ───────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const forgotPasswordMutation = useForgotPassword();

  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim() ?? "";
    const err = validateEmail(email);
    if (err) return;

    forgotPasswordMutation.mutate(email, {
      onSuccess: () => setSubmittedEmail(email),
    });
  }, [forgotPasswordMutation]);

  const handleBackToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleTryAgain = useCallback(() => {
    setSubmittedEmail("");
    forgotPasswordMutation.reset();
    if (emailRef.current) {
      emailRef.current.value = "";
      emailRef.current.focus();
    }
  }, [forgotPasswordMutation]);

  // Success state
  if (forgotPasswordMutation.isSuccess && submittedEmail) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <SuccessState
            title="Check Your Email"
            message={
              <>
                We've sent a password reset link to
                <br />
                <strong>{submittedEmail}</strong>
              </>
            }
          >
            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-[13px] text-amber-800">
                💡 <strong>Tip:</strong> Check your spam folder if you don't see the email
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Send to Different Email
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full py-3 rounded-xl bg-gray-900 text-white text-[15px] font-semibold hover:bg-gray-800 transition-colors"
              >
                Back to Login
              </button>
            </div>

            {/* Footer */}
            <p className="text-[13px] text-center text-gray-400 mt-6">
              Didn't receive the email?{" "}
              <button
                onClick={() => forgotPasswordMutation.mutate(submittedEmail)}
                className="text-amber-600 font-semibold hover:underline"
              >
                Resend
              </button>
            </p>
          </SuccessState>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="flex items-center gap-2 text-[14px] text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <Icon name="arrowLeft" size={16} />
          Back to Login
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
            <Icon name="alert" size={32} className="text-amber-600" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-[24px] font-bold text-gray-900 mb-2 text-center">
          Forgot Password?
        </h2>
        <p className="text-[15px] text-gray-500 mb-6 text-center">
          Enter your email and we'll send you a link to reset your password
        </p>

        {/* Error Banner */}
        {forgotPasswordMutation.error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-xl px-4 py-3 mb-5">
            <Icon name="error" size={16} className="flex-shrink-0 mt-0.5" />
            {forgotPasswordMutation.error.response?.data?.message || "Failed to send reset link"}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <ValidatedInput
            inputRef={emailRef}
            name="email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            required
            validator={validateEmail}
            className="mb-5"
          />

          <SubmitButton
            loading={forgotPasswordMutation.isPending}
            label="Send Reset Link"
            loadingLabel="Sending Link..."
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
