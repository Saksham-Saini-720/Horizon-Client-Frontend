
import { memo, useState, useCallback } from 'react';
import { useChangePassword } from '../../hooks/auth/useChangePassword';
import ErrorBanner from '../forms/ErrorBanner';

// ── Eye icon toggle ──────────────────────────────────────────────────────────
const EyeIcon = memo(({ show }) => show ? (
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
));

// ── Password field ───────────────────────────────────────────────────────────
const PasswordField = memo(({ label, value, onChange, error, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[13px] font-semibold text-gray-700 font-font-myriad mb-1.5">
        {label}
      </label>
      <div className={`flex items-center border rounded-xl transition-colors ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus-within:border-[#1C2A3A]'
      }`}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 bg-transparent outline-none rounded-l-xl"
        />
        <button
          type="button"
          onClick={() => setShow(p => !p)}
          className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <EyeIcon show={show}/>
        </button>
      </div>
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );
});

// ── Password rules ───────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { label: 'At least 8 characters',       test: (v) => v.length >= 8 },
  { label: 'One uppercase letter (A–Z)',  test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter (a–z)',  test: (v) => /[a-z]/.test(v) },
  { label: 'One number (0–9)',            test: (v) => /[0-9]/.test(v) },
  { label: 'One special character',       test: (v) => /[^A-Za-z0-9]/.test(v) },
];

// ── Password checklist ───────────────────────────────────────────────────────
const PasswordChecklist = memo(({ password }) => {
  if (!password) return null;
  return (
    <ul className="mt-2 space-y-1">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.label} className={`flex items-center gap-1.5 text-[12px] ${met ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${met ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
              {met && (
                <svg viewBox="0 0 10 8" className="w-2 h-2 fill-white">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
});

// ── Main modal ───────────────────────────────────────────────────────────────
const ChangePasswordModal = memo(({ isOpen, onClose }) => {
  const [form, setForm]     = useState({ current: '', newPass: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const mutation = useChangePassword({
    onSuccess: () => {
      setTimeout(onClose, 2000);
    },
  });

  const handleChange = useCallback((field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: '' }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.current) errs.current = 'Current password is required';
    if (!form.newPass) errs.newPass = 'New password is required';
    else if (PASSWORD_RULES.some(r => !r.test(form.newPass))) errs.newPass = "Password doesn't meet all requirements";
    else if (form.newPass === form.current)                    errs.newPass = 'New password must be different';
    if (form.newPass !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    mutation.mutate({ currentPassword: form.current, newPassword: form.newPass });
  };

  const handleClose = useCallback(() => {
    if (mutation.isPending) return;
    setForm({ current: '', newPass: '', confirm: '' });
    setErrors({});
    mutation.reset();
    onClose();
  }, [mutation, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleClose}/>

      {/* Sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full"/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] font-bold text-[#1C2A3A] font-font-myriad">
              Change Password
            </h2>
            <p className="text-[13px] text-gray-400 font-font-myriad mt-0.5">
              You'll be logged out after changing
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Success state */}
        {mutation.isSuccess ? (
          <div className="px-6 py-12 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-[17px] font-bold text-[#1C2A3A] font-font-myriad mb-2">
              Password Changed!
            </p>
            <p className="text-[14px] text-gray-400 font-font-myriad text-center">
              Logging you out in a moment...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <PasswordField
              label="Current Password"
              value={form.current}
              onChange={handleChange('current')}
              error={errors.current}
              placeholder="Enter current password"
            />

            <div>
              <PasswordField
                label="New Password"
                value={form.newPass}
                onChange={handleChange('newPass')}
                error={errors.newPass}
                placeholder="Min 8 chars, upper & lowercase"
              />
              <PasswordChecklist password={form.newPass}/>
            </div>

            <PasswordField
              label="Confirm New Password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              error={errors.confirm}
              placeholder="Repeat new password"
            />

            <ErrorBanner error={mutation.error} />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 rounded-2xl bg-[#1C2A3A] text-white text-[15px] font-bold font-font-myriad hover:bg-[#2A3A4A] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Changing password...
                </span>
              ) : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </>
  );
});

ChangePasswordModal.displayName = 'ChangePasswordModal';
export default ChangePasswordModal;
