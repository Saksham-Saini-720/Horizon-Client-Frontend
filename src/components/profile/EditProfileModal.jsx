
import { memo, useState, useCallback, useEffect } from 'react';
import { useUpdateBasicInfo } from '../../hooks/profile/useUpdateProfile';

/**
 * EditProfileModal Component
 * Modal for editing user profile information
 * NOW WITH API INTEGRATION
 */
const EditProfileModal = memo(({ isOpen, onClose, user }) => {
  const updateMutation = useUpdateBasicInfo();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback((e) => {
    e.preventDefault();
    
    // Call API to update profile
    updateMutation.mutate(formData, {
      onSuccess: () => {
        // Close modal on success
        onClose();
      }
    });
  }, [formData, updateMutation, onClose]);

  const handleCancel = useCallback(() => {
    // Reset form to original values
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      email: user?.email || ''
    });
    
    // Close modal
    onClose();
  }, [user, onClose]);

  // Return null if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                  Edit Profile
                </h2>
                <p className="text-[13px] text-gray-500 font-['DM_Sans',sans-serif] mt-1">
                  Update your personal information
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="px-6 py-6 space-y-5">
            {/* First Name */}
            <div>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] focus:outline-none focus:border-[#1C2A3A] focus:ring-2 focus:ring-[#1C2A3A]/10 transition-all"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] focus:outline-none focus:border-[#1C2A3A] focus:ring-2 focus:ring-[#1C2A3A]/10 transition-all"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] focus:outline-none focus:border-[#1C2A3A] focus:ring-2 focus:ring-[#1C2A3A]/10 transition-all"
                required
              />
              <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif] mt-2">
                Changing phone may require verification
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 font-['DM_Sans',sans-serif] mb-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] focus:outline-none focus:border-[#1C2A3A] focus:ring-2 focus:ring-[#1C2A3A]/10 transition-all"
                required
              />
              <p className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif] mt-2">
                Changing email may require verification
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-200 text-[#1C2A3A] font-semibold text-[15px] font-['DM_Sans',sans-serif] hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#1C2A3A] text-white font-semibold text-[15px] font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
});

EditProfileModal.displayName = 'EditProfileModal';

export default EditProfileModal;
