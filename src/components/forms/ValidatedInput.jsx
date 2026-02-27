
import { useState, useCallback, memo } from "react";

/**
 * Reusable input with built-in validation
 * Used in: Login, Register, ForgotPassword, ResetPassword
 */
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
        <label className="block text-[14px] font-semibold text-gray-700 mb-2">
          {label}
          {!required && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
        </label>
      )}
      
      <input
        ref={inputRef}
        type={type}
        name={name}
        defaultValue=""
        placeholder={placeholder}
        required={required}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`w-full border rounded-xl px-4 py-3.5 text-[15px] text-gray-800 placeholder-gray-400
          outline-none transition-colors ${extraClass}
          ${fieldError
            ? "border-red-300 bg-red-50 focus:border-red-400"
            : "border-gray-200 focus:border-gray-800"
          }`}
      />
      
      {fieldError && (
        <p className="text-[13px] text-red-500 mt-1.5">{fieldError}</p>
      )}
      
      {hint && !fieldError && (
        <p className="text-[12px] text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
});

export default ValidatedInput;
