
import { memo } from "react";
import AvatarUpload from "./AvatarUpload";

const ProfileHeader = memo(({ user, onEdit }) => {
  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  return (
    <div className="bg-gradient-to-br from-amber-400 to-amber-500 px-5 pt-8 pb-24 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[24px] font-bold text-white font-['DM_Sans',sans-serif]">
            Profile
          </h1>
          <button
            onClick={onEdit}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          <AvatarUpload user={user} />
          
          <div className="flex-1">
            <h2 className="text-[20px] font-bold text-white font-['DM_Sans',sans-serif] mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-[14px] text-white/80 font-['DM_Sans',sans-serif]">
              {user?.email}
            </p>
            {user?.phone && (
              <p className="text-[13px] text-white/70 font-['DM_Sans',sans-serif] mt-0.5">
                {user.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileHeader;
