
import { useState, useCallback, memo } from "react";

const ValidatedInput = memo(({
  inputRef,
  name,
  type = "text",
  label,
  placeholder,
  required = false,
  validator,
  hint,
  className = "",
  extraClass = "",
}) => {
  const [fieldError, setFieldError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType  = isPassword ? (showPassword ? "text" : "password") : type;

  const handleBlur = useCallback(() => {
    if (!validator) return;
    const value = inputRef.current?.value ?? "";
    const err = validator(value);
    setFieldError(err ?? "");
  }, [validator, inputRef]);

  const handleFocus = useCallback(() => {
    setFieldError("");
  }, []);

  return (
    <div className={className}>
      {label && (
        <label className="block text-[16px] font-semibold text-gray-700 mb-2">
          {label}
          {!required && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
        </label>
      )}

      <div className={`relative flex items-center border rounded-xl transition-colors ${
        fieldError
          ? "border-red-300 bg-red-50 focus-within:border-red-400"
          : "border-gray-200 focus-within:border-gray-800"
      }`}>
        <input
          ref={inputRef}
          type={inputType}
          name={name}
          defaultValue=""
          placeholder={placeholder}
          required={required}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`w-full bg-transparent px-4 py-3.5 text-[16px] text-gray-800 placeholder-gray-400
            outline-none rounded-xl ${extraClass} ${isPassword ? 'pr-11' : ''}`}
        />

        {/* Eye toggle — only for password fields */}
        {isPassword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // prevent input blur
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? (
              // Eye-off
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              // Eye
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {fieldError && (
        <p className="text-[15px] text-red-500 mt-1.5">{fieldError}</p>
      )}

      {hint && !fieldError && (
        <p className="text-[12px] text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
});

ValidatedInput.displayName = 'ValidatedInput';
export default ValidatedInput;
