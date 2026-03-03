
import { memo } from 'react';

/**
 * MembershipBadge Component
 * Horizon Member status badge
 */
const MembershipBadge = memo(({ memberSince }) => {
  return (
    <div className=" bg-gradient-to-r from-[#1C2A3A] to-[#2A3A4A] rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-3">
        {/* Star Icon */}
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-amber-400 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="text-[14px] font-bold text-white font-['DM_Sans',sans-serif] ">
            Horizon Member
          </h3>
          <p className="text-[12px] text-white/70 font-['DM_Sans',sans-serif]">
            Member since {memberSince}
          </p>
        </div>
      </div>
    </div>
  );
});

MembershipBadge.displayName = 'MembershipBadge';

export default MembershipBadge;
