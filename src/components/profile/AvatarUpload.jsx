
import { memo, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const AvatarUpload = memo(({ user }) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Uploading avatar...');

    // Create local URL for immediate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      // Simulate upload delay
      setTimeout(() => {
        // Update Redux state with new avatar
        dispatch(updateUser({ avatar: base64String }));
        
        toast.success('Avatar updated successfully', {
          id: loadingToast,
        });
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  return (
    <div className="relative">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-white shadow-lg overflow-hidden border-4 border-white/20">
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-[24px] font-bold text-gray-600 font-['DM_Sans',sans-serif]">
              {getInitials()}
            </span>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
});

export default AvatarUpload;
