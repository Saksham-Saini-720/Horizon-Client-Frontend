import { memo } from 'react';

const StatsCard = memo(({ icon, label, count, glowColor, iconColor, iconBg }) => {
  return (
    <div
      className="rounded-xl py-1.5 px-2 relative overflow-hidden transition-all duration-200 flex items-center gap-2"
      style={{
        background: 'rgba(255, 255, 255, 0.07)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Per-card ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10px', left: '-10px',
          width: '50px', height: '50px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor || 'rgba(99,102,241,0.4)'} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />

      {/* Icon */}
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 relative"
        style={{
          background: iconBg || 'rgba(99,102,241,0.18)',
          color: iconColor || '#818cf8',
          boxShadow: `0 0 10px ${glowColor || 'rgba(99,102,241,0.45)'}`,
        }}
      >
        {icon}
      </div>

      {/* Count + Label */}
      <div className="min-w-0">
        <p className="text-[15px] font-bold text-white font-display leading-none">{count}</p>
        <span className="text-[12px] font-medium font-display" style={{ color: 'rgba(196,210,255,0.55)' }}>
          {label}
        </span>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';
export default StatsCard;
