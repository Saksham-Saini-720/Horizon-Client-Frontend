
import { memo } from "react";

const LoadingScreen = memo(() => {
  return (
    <div className="min-h-screen bg-[#2C3E50] flex flex-col items-center justify-center">
      
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-2xl">
          <span className="text-[#2C3E50] text-[48px] font-bold font-['DM_Sans',sans-serif]">
            H
          </span>
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-white text-[36px] font-bold font-['DM_Sans',sans-serif] mb-1">
        Horizon
      </h1>
      
      <p className="text-white/60 text-[14px] font-['DM_Sans',sans-serif] tracking-widest uppercase mb-12">
        PROPERTIES
      </p>

      {/* Animated Dots */}
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full bg-white/40"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0s'
          }}
        />
        <div 
          className="w-3 h-3 rounded-full bg-white/40"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.2s'
          }}
        />
        <div 
          className="w-3 h-3 rounded-full bg-white/40"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.4s'
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
});

export default LoadingScreen;
