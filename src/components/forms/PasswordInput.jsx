
import { useState, useCallback, memo } from "react";

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
  const [fieldError, setFieldError]   = useState("");
  const [strength, setStrength]       = useState(0);
  const [showPassword, setShowPassword] = useState(false);

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
      setStrength(calculateStrength(inputRef.current.value));
    }
  }, [showStrength, inputRef, calculateStrength]);

  const handleBlur = useCallback(() => {
    if (!validator) return;
    const err = validator(inputRef.current?.value ?? "");
    setFieldError(err ?? "");
  }, [validator, inputRef]);

  const handleFocus = useCallback(() => setFieldError(""), []);

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className={className}>
      {label && (
        <label className="block text-[16px] font-semibold text-gray-700 mb-2">{label}</label>
      )}

      {/* Input wrapper with eye button */}
      <div className={`relative flex items-center border rounded-xl transition-colors ${
        fieldError
          ? "border-red-300 bg-red-50 focus-within:border-red-400"
          : "border-gray-200 focus-within:border-gray-800"
      }`}>
        <input
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          name={name}
          defaultValue=""
          placeholder={placeholder}
          required={required}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
          className="w-full bg-transparent px-4 py-3.5 pr-11 text-[16px] text-gray-800 placeholder-gray-400 outline-none rounded-xl"
        />

        {/* Eye toggle */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowPassword(p => !p)}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>

      {/* Strength bar */}
      {showStrength && strength > 0 && !fieldError && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1,2,3,4,5].map((level) => (
              <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${
                level <= strength ? strengthColors[strength - 1] : "bg-gray-200"
              }`}/>
            ))}
          </div>
          <p className={`text-[13px] ${strength <= 2 ? "text-orange-600" : "text-green-600"}`}>
            {strengthLabels[strength - 1]}
          </p>
        </div>
      )}

      {fieldError && <p className="text-[15px] text-red-500 mt-1.5">{fieldError}</p>}
      {hint && !fieldError && <p className="text-[15px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
