
import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useRegisterMutation from "../hooks/auth/useRegisterMutation";
import SocialLogin from "../components/auth/SocialLogin";
import AuthDivider from "../components/auth/AuthDivider";
import AuthTerms from "../components/auth/AuthTerms";
import ValidatedInput from "../components/forms/ValidatedInput";
import ErrorBanner from "../components/forms/ErrorBanner";
import SubmitButton from "../components/forms/SubmitButton";

// ─── Validators ───────────────────────────────────────────────────────────────

const VALIDATORS = {
  firstName: (v) => !v.trim() ? "First name required" : null,
  lastName: (v) => !v.trim() ? "Last name required" : null,
  email: (v) => !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email" : null,
  password: (v) => v.length < 8 ? "Min 8 characters required" : null,
  phone: (v) => v && !/^\+?[\d\s\-]{7,15}$/.test(v) ? "Enter a valid phone number" : null,
};

// ─── RegisterPage ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const phoneRef = useRef(null);

  const registerMutation = useRegisterMutation();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const values = {
      firstName: firstNameRef.current?.value.trim() ?? "",
      lastName: lastNameRef.current?.value.trim() ?? "",
      email: emailRef.current?.value.trim() ?? "",
      password: passwordRef.current?.value ?? "",
      phone: phoneRef.current?.value.trim() ?? "",
    };

    // Validate all fields
    const errors = Object.entries(VALIDATORS)
      .map(([key, validate]) => validate(values[key]))
      .filter(Boolean);

    if (errors.length) return;

    registerMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.phone || undefined,
    });
  }, [registerMutation]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mb-14">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h2>
        <p className="text-sm text-gray-500 mb-6">Join Horizon Properties today.</p>

        {/* Google OAuth */}
        <SocialLogin label="Continue with Google" />

        {/* Divider */}
        <AuthDivider text="or sign up with email" />

        {/* Error Banner */}
        <ErrorBanner error={registerMutation.error} />

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          
          {/* First + Last Name */}
          <div className="flex gap-3 mb-3">
            <ValidatedInput
              inputRef={firstNameRef}
              name="firstName"
              label="First Name"
              placeholder="John"
              required
              validator={VALIDATORS.firstName}
            />
            <ValidatedInput
              inputRef={lastNameRef}
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              required
              validator={VALIDATORS.lastName}
            />
          </div>

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
            placeholder="Min 8 characters"
            required
            validator={VALIDATORS.password}
            hint="Use letters, numbers & symbols"
            className="mb-3"
          />

          <ValidatedInput
            inputRef={phoneRef}
            name="phone"
            type="tel"
            label="Phone"
            placeholder="+260 97X XXX XXX"
            validator={VALIDATORS.phone}
            className="mb-6"
          />

          <SubmitButton
            loading={registerMutation.isPending}
            label="Create Account"
            loadingLabel="Creating account..."
          />
        </form>

        {/* Terms */}
        <AuthTerms />

        {/* Login link */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
