
import { memo } from "react";
import logo from "../../assets/icons/white_logo.png";
import leading from "../../assets/icons/Leading.png";

const LoadingScreen = memo(() => {
  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center">
      
      {/* Logo */}
      <div >
        {/* <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-secondary to-secondary flex items-center justify-center shadow-2xl"> */}
          <img src={logo} alt="logo" className="w-52 h-52  object-contain" />
        {/* </div> */}
      </div>

      {/* Brand Name */}
      <div >
        <img src={leading} alt="logo" className="invert w-96 h-96  object-contain" />
      </div>
      
      {/* <p className="text-white/60 text-[18px] font-black font-myriad tracking-widest uppercase mb-7">
        PROPERTIES
      </p> */}

      {/* Animated Dots */}
      <div className="flex items-center gap-2 mt-6">
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
