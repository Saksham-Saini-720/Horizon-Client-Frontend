import { memo } from 'react';

const StatsCard = memo(({ icon, label, count, glowColor, iconColor, iconBg }) => {
  return (
    <div
      className="rounded-2xl py-3 px-3 relative overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255, 255, 255, 0.07)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Per-card ambient glow behind icon */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10px', left: '-10px',
          width: '70px', height: '70px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor || 'rgba(99,102,241,0.4)'} 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />

      {/* Icon with glowing background */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 relative"
        style={{
          background: iconBg || 'rgba(99,102,241,0.18)',
          color: iconColor || '#818cf8',
          boxShadow: `0 0 14px ${glowColor || 'rgba(99,102,241,0.45)'}`,
        }}
      >
        {icon}
      </div>

      {/* Count */}
      <p className="text-[22px] font-bold text-white font-myriad leading-none mb-1">
        {count}
      </p>

      {/* Label */}
      <span
        className="text-[11px] font-medium font-myriad"
        style={{ color: 'rgba(196,210,255,0.55)' }}
      >
        {label}
      </span>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';
export default StatsCard;
