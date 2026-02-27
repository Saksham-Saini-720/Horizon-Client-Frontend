
import { useState, useCallback, memo } from "react";

/**
 * Password input with optional strength indicator
 * Used in: Login, Register, ResetPassword
 */
const PasswordInput = memo(({
  inputRef,
  name = "password",
  label = "Password",
  placeholder = "••••••••",
  required = true,
  validator,
  showStrength = false,
  hint,
  className = "",
}) => {
  const [fieldError, setFieldError] = useState("");
  const [strength, setStrength] = useState(0);

  const calculateStrength = useCallback((password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }, []);

  const handleChange = useCallback(() => {
    if (showStrength && inputRef.current) {
      const score = calculateStrength(inputRef.current.value);
      setStrength(score);
    }
  }, [showStrength, inputRef, calculateStrength]);

  const handleBlur = useCallback(() => {
    if (!validator) return;
    const value = inputRef.current?.value ?? "";
    const err = validator(value);
    setFieldError(err ?? "");
  }, [validator, inputRef]);

  const handleFocus = useCallback(() => {
    setFieldError("");
  }, []);

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className={className}>
      {label && (
        <label className="block text-[14px] font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <input
        ref={inputRef}
        type="password"
        name={name}
        defaultValue=""
        placeholder={placeholder}
        required={required}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        className={`w-full border rounded-xl px-4 py-3.5 text-[15px] text-gray-800 placeholder-gray-400
          outline-none transition-colors
          ${fieldError
            ? "border-red-300 bg-red-50 focus:border-red-400"
            : "border-gray-200 focus:border-gray-800"
          }`}
      />
      
      {/* Password Strength Indicator */}
      {showStrength && strength > 0 && !fieldError && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  level <= strength ? strengthColors[strength - 1] : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className={`text-[12px] ${
            strength <= 2 ? "text-orange-600" : "text-green-600"
          }`}>
            {strengthLabels[strength - 1]}
          </p>
        </div>
      )}

      {fieldError && (
        <p className="text-[13px] text-red-500 mt-1.5">{fieldError}</p>
      )}
      
      {hint && !fieldError && (
        <p className="text-[12px] text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
});

export default PasswordInput;
