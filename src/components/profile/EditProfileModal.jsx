
import { memo, useState, useEffect, useCallback, useRef } from "react";
import useUpdateProfile from "../../hooks/profile/useUpdateProfile";

const EditProfileModal = memo(({ isOpen, onClose, user }) => {
  // Use refs to store current values - NO re-renders on change
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const bioRef = useRef(null);
  
  const [errors, setErrors] = useState({});
  const updateMutation = useUpdateProfile();

  // Initialize refs when modal opens
  useEffect(() => {
    if (isOpen && user) {
      if (firstNameRef.current) firstNameRef.current.value = user.firstName || "";
      if (lastNameRef.current) lastNameRef.current.value = user.lastName || "";
      if (emailRef.current) emailRef.current.value = user.email || "";
      if (phoneRef.current) phoneRef.current.value = user.phone || "";
      if (bioRef.current) bioRef.current.value = user.bio || "";
      setErrors({});
    }
  }, [isOpen, user]);

  const validate = useCallback(() => {
    const newErrors = {};
    const firstName = firstNameRef.current?.value || "";
    const lastName = lastNameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const phone = phoneRef.current?.value || "";

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (phone && !/^\+?[\d\s\-]{7,15}$/.test(phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const formData = {
      firstName: firstNameRef.current?.value || "",
      lastName: lastNameRef.current?.value || "",
      email: emailRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      bio: bioRef.current?.value || "",
    };

    updateMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  }, [validate, updateMutation, onClose]);

  // Clear error for field on change - NO state update for value
  const handleFieldChange = useCallback((fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  const handleClose = useCallback(() => {
    if (!updateMutation.isPending) {
      onClose();
    }
  }, [onClose, updateMutation.isPending]);

  if (!isOpen) return null;

  // console.log('🔍 Rendering EditProfileModal with user:', user);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
            Edit Profile
          </h2>
          <button
            onClick={handleClose}
            disabled={updateMutation.isPending}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-[13px] font-semibold text-gray-700 mb-1.5 font-['DM_Sans',sans-serif]">
              First Name *
            </label>
            <input
              ref={firstNameRef}
              id="firstName"
              type="text"
              onChange={() => handleFieldChange('firstName')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.firstName ? 'border-red-500' : 'border-gray-200'
              } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-['DM_Sans',sans-serif]`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-[12px] text-red-500 mt-1 font-['DM_Sans',sans-serif]">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-[13px] font-semibold text-gray-700 mb-1.5 font-['DM_Sans',sans-serif]">
              Last Name *
            </label>
            <input
              ref={lastNameRef}
              id="lastName"
              type="text"
              onChange={() => handleFieldChange('lastName')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.lastName ? 'border-red-500' : 'border-gray-200'
              } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-['DM_Sans',sans-serif]`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-[12px] text-red-500 mt-1 font-['DM_Sans',sans-serif]">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[13px] font-semibold text-gray-700 mb-1.5 font-['DM_Sans',sans-serif]">
              Email *
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              onChange={() => handleFieldChange('email')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-['DM_Sans',sans-serif]`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-[12px] text-red-500 mt-1 font-['DM_Sans',sans-serif]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-[13px] font-semibold text-gray-700 mb-1.5 font-['DM_Sans',sans-serif]">
              Phone
            </label>
            <input
              ref={phoneRef}
              id="phone"
              type="tel"
              onChange={() => handleFieldChange('phone')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              } focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-['DM_Sans',sans-serif]`}
              placeholder="+1 234 567 8900"
            />
            {errors.phone && (
              <p className="text-[12px] text-red-500 mt-1 font-['DM_Sans',sans-serif]">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-[13px] font-semibold text-gray-700 mb-1.5 font-['DM_Sans',sans-serif]">
              Bio
            </label>
            <textarea
              ref={bioRef}
              id="bio"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none font-['DM_Sans',sans-serif]"
              placeholder="Tell us about yourself..."
              maxLength={200}
            />
            <p className="text-[12px] text-gray-400 mt-1 text-right font-['DM_Sans',sans-serif]">
              {bioRef.current?.value.length || 0}/200
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={updateMutation.isPending}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 px-4 py-3 rounded-xl text-[15px] font-semibold text-white font-['DM_Sans',sans-serif] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
              style={{ background: "linear-gradient(135deg, #F5B731, #E8A020)" }}
            >
              {updateMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default EditProfileModal;
