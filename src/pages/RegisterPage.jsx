
// import { useRef, useCallback } from "react";
// import { Link } from "react-router-dom";
// import useRegisterMutation from "../hooks/auth/useRegisterMutation";
// // import SocialLogin from "../components/auth/SocialLogin";
// // import AuthDivider from "../components/auth/AuthDivider";
// import AuthTerms from "../components/auth/AuthTerms";
// import ValidatedInput from "../components/forms/ValidatedInput";
// import ErrorBanner from "../components/forms/ErrorBanner";
// import SubmitButton from "../components/forms/SubmitButton";

// // ─── Validators ───────────────────────────────────────────────────────────────

// const VALIDATORS = {
//   firstName: (v) => !v.trim() ? "First name required" : null,
//   lastName: (v) => !v.trim() ? "Last name required" : null,
//   email: (v) => !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email" : null,
//   password: (v) => v.length < 8 ? "Min 8 characters required" : null,
//   phone: (v) => !v?.trim() ? "Phone number is required" : !/^\+?[\d\s-]{7,15}$/.test(v) ? "Enter a valid phone number" : null,
// };

// // ─── RegisterPage ─────────────────────────────────────────────────────────────

// export default function RegisterPage() {
//   const firstNameRef = useRef(null);
//   const lastNameRef = useRef(null);
//   const emailRef = useRef(null);
//   const passwordRef = useRef(null);
//   const phoneRef = useRef(null);

//   const registerMutation = useRegisterMutation();

//   const handleSubmit = useCallback((e) => {
//     e.preventDefault();

//     const values = {
//       firstName: firstNameRef.current?.value.trim() ?? "",
//       lastName: lastNameRef.current?.value.trim() ?? "",
//       email: emailRef.current?.value.trim() ?? "",
//       password: passwordRef.current?.value ?? "",
//       phone: phoneRef.current?.value.trim() ?? "",
//     };

//     // Validate all fields
//     const errors = Object.entries(VALIDATORS)
//       .map(([key, validate]) => validate(values[key]))
//       .filter(Boolean);

//     if (errors.length) {
//     [firstNameRef, lastNameRef, emailRef, passwordRef, phoneRef].forEach((ref) => {
//       ref.current?.focus();
//       ref.current?.blur();
//     });
//     return;
//   }

//     registerMutation.mutate({
//       firstName: values.firstName,
//       lastName: values.lastName,
//       email: values.email,
//       password: values.password,
//       phone: values.phone || undefined,
//     });
//   }, [registerMutation]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mb-14">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        
//         {/* Header */}
//         <h2 className="text-2xl font-semibold font-myriad text-gray-900 mb-1">Create an account</h2>
//         <p className="text-sm text-gray-500 mb-6">Join Horizon Properties today.</p>

//         {/* Google OAuth */}
//         {/* <SocialLogin label="Continue with Google" /> */}

//         {/* Divider */}
//         {/* <AuthDivider text="sign up with email" /> */}

//         {/* Error Banner */}
//         <ErrorBanner error={registerMutation.error} />

//         {/* Form */}
//         <form onSubmit={handleSubmit} noValidate>
          
//           {/* First + Last Name */}
//           <div className="flex gap-3 mb-3">
//             <ValidatedInput
//               inputRef={firstNameRef}
//               name="firstName"
//               label="First Name"
//               placeholder="John"
//               required
//               validator={VALIDATORS.firstName}
//             />
//             <ValidatedInput
//               inputRef={lastNameRef}
//               name="lastName"
//               label="Last Name"
//               placeholder="Doe"
//               required
//               validator={VALIDATORS.lastName}
//             />
//           </div>

//           <ValidatedInput
//             inputRef={emailRef}
//             name="email"
//             type="email"
//             label="Email Address"
//             placeholder="john@example.com"
//             required
//             validator={VALIDATORS.email}
//             className="mb-3"
//           />

//           <ValidatedInput
//             inputRef={passwordRef}
//             name="password"
//             type="password"
//             label="Password"
//             placeholder="Min 8 characters"
//             required
//             validator={VALIDATORS.password}
//             hint="Use letters, numbers & symbols"
//             className="mb-3"
//           />

//           <ValidatedInput
//             inputRef={phoneRef}
//             name="phone"
//             type="tel"
//             label="Phone"
//             required
//             placeholder="+260 97X XXX XXX"
//             validator={VALIDATORS.phone}
//             className="mb-6"
//           />

//           <SubmitButton
//             loading={registerMutation.isPending}
//             label="Create Account"
//             loadingLabel="Creating account..."
//           />
//         </form>

//         {/* Terms */}
//         <AuthTerms />

//         {/* Login link */}
//         <p className="text-sm text-center text-gray-500 mt-4">
//           Already have an account?{" "}
//           <Link to="/login" className="text-gray-900 font-semibold hover:underline">
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


// src/pages/RegisterPage.jsx
import { useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import useRegisterMutation from "../hooks/auth/useRegisterMutation";
import AuthTerms from "../components/auth/AuthTerms";
import ValidatedInput from "../components/forms/ValidatedInput";
import PhoneInput from "../components/forms/PhoneInput";
import ErrorBanner from "../components/forms/ErrorBanner";
import SubmitButton from "../components/forms/SubmitButton";

const VALIDATORS = {
  firstName: (v) => !v.trim() ? "First name required" : null,
  lastName:  (v) => !v.trim() ? "Last name required" : null,
  email:     (v) => !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email" : null,
  password:  (v) => v.length < 8 ? "Min 8 characters required" : null,
};

export default function RegisterPage() {
  const firstNameRef = useRef(null);
  const lastNameRef  = useRef(null);
  const emailRef     = useRef(null);
  const passwordRef  = useRef(null);

  // ⭐ Phone stored as state — includes dial code
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

    // Validate text fields
    const errors = Object.entries(VALIDATORS)
      .map(([key, validate]) => validate(values[key]))
      .filter(Boolean);

    // Validate phone
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
      phone:     phoneValue, // ⭐ e.g. "+26097XXXXXXX"
    });
  }, [registerMutation, phoneValue]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mb-14">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        <h2 className="text-2xl font-semibold text-gray-900 mb-1 font-['DM_Sans',sans-serif]">
          Create an account
        </h2>
        <p className="text-sm text-gray-500 mb-6">Join Horizon Properties today.</p>

        <ErrorBanner error={registerMutation.error} />

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

          {/* ⭐ Phone with country code */}
          <PhoneInput
            label="Phone Number"
            required
            className="mb-6"
            onChange={(val) => {
              setPhoneValue(val);
              setPhoneError("");
            }}
          />
          {phoneError && (
            <p className="text-[13px] text-red-500 -mt-5 mb-4">{phoneError}</p>
          )}

          <SubmitButton
            loading={registerMutation.isPending}
            label="Create Account"
            loadingLabel="Creating account..."
          />
        </form>

        <AuthTerms />

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
