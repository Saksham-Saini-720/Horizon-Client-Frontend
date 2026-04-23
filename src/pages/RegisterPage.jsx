import { useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useRegisterMutation from "../hooks/auth/useRegisterMutation";
import ValidatedInput from "../components/forms/ValidatedInput";
import PhoneInput from "../components/forms/PhoneInput";
import ErrorBanner from "../components/forms/ErrorBanner";
import Spinner from "../components/ui/Spinner";
import AuthPageHeader from "../components/auth/AuthPageHeader";

// extracted so ESLint sees `motion` as used (dot-notation JSX isn't tracked)
const MotionCard = motion.div;

const VALIDATORS = {
  firstName: (v) => !v.trim() ? "First name required" : null,
  lastName:  (v) => !v.trim() ? "Last name required" : null,
  email:     (v) => !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email" : null,
  password:  (v) => v.length < 8 ? "Min 8 characters required" : null,
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

export default function RegisterPage() {
  const firstNameRef = useRef(null);
  const lastNameRef  = useRef(null);
  const emailRef     = useRef(null);
  const passwordRef  = useRef(null);

  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const registerMutation = useRegisterMutation();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const values = {
      firstName: firstNameRef.current?.value.trim() ?? "",
      lastName:  lastNameRef.current?.value.trim()  ?? "",
      email:     emailRef.current?.value.trim()     ?? "",
      password:  passwordRef.current?.value         ?? "",
    };

    const errors = Object.entries(VALIDATORS)
      .map(([key, validate]) => validate(values[key]))
      .filter(Boolean);

    const digits = phoneValue.replace(/\D/g, "");
    if (!digits || digits.length < 7) {
      setPhoneError("Enter a valid phone number");
      errors.push("phone");
    } else {
      setPhoneError("");
    }

    if (errors.length) {
      [firstNameRef, lastNameRef, emailRef, passwordRef].forEach(ref => {
        ref.current?.focus();
        ref.current?.blur();
      });
      return;
    }

    registerMutation.mutate({
      firstName: values.firstName,
      lastName:  values.lastName,
      email:     values.email,
      password:  values.password,
      phone:     phoneValue,
    });
  }, [registerMutation, phoneValue]);

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-hidden">

      <AuthPageHeader />

      {/* ── Card — constrained width, slides up on mount ── */}
      <div className="flex justify-center px-5 -mt-7 pb-12 z-20 w-full">
        <MotionCard
          className="bg-white rounded-3xl shadow-2xl w-full px-8 pt-8 pb-8"
          style={{ minWidth: 390 }}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
        >
          <h2 className="text-[28px] font-bold text-center text-primary mb-1">
            Create your{" "}
            <span className="italic font-normal" style={{ color: "#C96C38", fontFamily: "Georgia, serif" }}>
              account
            </span>
          </h2>
          <p className="text-sm text-gray-400 italic text-center mb-6">
            Join Horizon Properties today.
          </p>

          <ErrorBanner error={registerMutation.error} />

          <form onSubmit={handleSubmit} noValidate>

            {/* First + Last Name side by side */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                  First Name
                </p>
                <ValidatedInput
                  inputRef={firstNameRef}
                  name="firstName"
                  placeholder="John"
                  required
                  validator={VALIDATORS.firstName}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                  Last Name
                </p>
                <ValidatedInput
                  inputRef={lastNameRef}
                  name="lastName"
                  placeholder="Doe"
                  required
                  validator={VALIDATORS.lastName}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                Email Address
              </p>
              <ValidatedInput
                inputRef={emailRef}
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                validator={VALIDATORS.email}
                leftIcon={<MailIcon />}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                Password
              </p>
              <ValidatedInput
                inputRef={passwordRef}
                name="password"
                type="password"
                placeholder="Min 8 characters"
                required
                validator={VALIDATORS.password}
                hint="Use letters, numbers & symbols"
                leftIcon={<LockIcon />}
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1.5">
                Phone Number
              </p>
              <PhoneInput
                required
                onChange={(val) => {
                  setPhoneValue(val);
                  setPhoneError("");
                }}
              />
              {phoneError && (
                <p className="text-[13px] text-red-500 mt-1.5">{phoneError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full text-white font-semibold py-4 rounded-full disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-[15px]"
              style={{ backgroundColor: "#C96C38" }}
            >
              {registerMutation.isPending && <Spinner size="sm" />}
              {registerMutation.isPending ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-400 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: "#C96C38" }}>
              Sign in
            </Link>
          </p>
        </MotionCard>
      </div>
    </div>
  );
}
