
import { memo } from 'react';
import whiteLogo from '../../assets/icons/white_logo.png';

const ProfileHeader = memo(({ user, onEdit }) => {
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <div
      className="relative overflow-hidden px-5 pt-8 pb-16 bg-gradient-to-br from-[#1a2550] to-secondary"
    >
      {/* ── Glow orbs ── */}
      <div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: '#C96C38', opacity: 0.32, filter: 'blur(72px)' }}
      />
      <div
        className="absolute top-6 right-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: '#C96C38', opacity: 0.18, filter: 'blur(44px)' }}
      />
      <div
        className="absolute top-14 -left-10 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: '#C96C38', opacity: 0.1, filter: 'blur(60px)' }}
      />

      {/* ── Decorative arc lines ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.13 }}>
        <svg
          viewBox="0 0 400 280"
          fill="none"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse cx="390" cy="30"  rx="230" ry="230" stroke="white" strokeWidth="0.9" />
          <ellipse cx="410" cy="70"  rx="180" ry="180" stroke="white" strokeWidth="0.7" />
          <ellipse cx="370" cy="10"  rx="280" ry="280" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ── Top bar: Logo · Gear ── */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <img src={whiteLogo} alt="Horizon" className="h-9 object-contain" />

        <button
          onClick={onEdit}
          aria-label="Settings"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.28)',
            boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 0 12px rgba(255,255,255,0.12)',
          }}
        >
          <svg
            className="w-[18px] h-[18px] text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* ── Avatar (left) + Info (right) row ── */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Avatar */}
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-[72px] h-[72px] flex-shrink-0 rounded-full object-cover"
            style={{
              border: '3px solid rgba(255,255,255,0.22)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
            }}
          />
        ) : (
          <div
            className="w-[72px] h-[72px] flex-shrink-0 rounded-full flex items-center justify-center text-white text-[26px] font-bold font-myriad"
            style={{
              background: 'linear-gradient(135deg, #C96C38 0%, #e08050 100%)',
              border: '3px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 18px rgba(201,108,56,0.45)',
            }}
          >
            {getInitials(user?.firstName, user?.lastName)}
          </div>
        )}

        {/* Name · Email · Badge */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[20px] font-bold text-white font-myriad leading-snug mb-[2px] truncate">
            {user?.firstName} {user?.lastName}
          </h2>

          <p
            className="text-[13px] font-myriad mb-[10px] truncate"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {user?.email}
          </p>

          {/* Badge */}
          {user?.verified ? (
            <div
              className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full"
              style={{
                background: 'rgba(34,197,94,0.18)',
                border: '1px solid rgba(74,222,128,0.45)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 2px 8px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span
                className="text-[10px] font-bold font-myriad tracking-[0.12em] uppercase"
                style={{ color: '#4ade80' }}
              >
                Verified
              </span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full"
              style={{
                background: 'rgba(251,191,36,0.18)',
                border: '1px solid rgba(251,191,36,0.45)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 2px 8px rgba(251,191,36,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span
                className="text-[10px] font-bold font-myriad tracking-[0.12em] uppercase"
                style={{ color: '#fbbf24' }}
              >
                Not Verified
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';
export default ProfileHeader;
