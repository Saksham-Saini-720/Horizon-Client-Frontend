import { useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import horizonLogo from "../../assets/icons/logo.png"; 
import leadingReLogo from "../../assets/icons/leading.png"; 

const TEXT = "Real\u00A0\u00A0\u00A0\u00A0Property\u00A0\u00A0\u00A0\u00A0Merchants";

export default function SplashScreen() {
  const textPathRef = useRef(null);

 useEffect(() => {
  const el = textPathRef.current;
  if (!el) return;

  el.innerHTML = "";

  TEXT.split("").forEach((ch, i) => {
    const ts = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    ts.textContent = ch === " " ? "\u00A0" : ch;
    ts.setAttribute("opacity", "0");
    ts.style.transition = "opacity 0.18s ease";
    el.appendChild(ts);
    setTimeout(() => ts.setAttribute("opacity", "1"), 950 + i * 52);
  });
}, []);

  return (
    <Motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#2D368E" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motion.div
        style={{ position: "relative", width: 270, height: 240 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      >
        {/* Logo - top 29% cropped (hides original text) */}
        <img
          src={horizonLogo}
          alt="Horizon"
          style={{
            width: 250,
            // height: 200,
            objectFit: "contain",
            position: "absolute",
            top: 50,
            left: 0,
            // margin: "auto",
            zIndex: 1,
            clipPath: "inset(2% 2% 2% 2%)",
          }}
        />

        {/* Arc animated text */}
        <svg
          width="320"
          height="250"
          viewBox="0 0 320 120"
          style={{ position: "absolute", top: -23, left: -33, zIndex: 2 }}
        >
          <defs>
            <path id="rpmArc" d="M 10,110 A 160,160 0 0,1 310,110" />
          </defs>
          <text fontFamily="'Great Vibes', cursive" fontSize="25" fill="white">
            <textPath
              ref={textPathRef}
              href="#rpmArc"
              startOffset="52%"
              textAnchor="middle"
              letterSpacing="1"
            />
          </text>
        </svg>
      </Motion.div>

      <div className="flex items-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <Motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
       {/* A member of text */}
      <Motion.p
        style={{
          color: "white",
          fontSize: 13,
          letterSpacing: 2,
          marginTop: 150,
          opacity: 0.85,
          textTransform: "uppercase",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        A member of the
      </Motion.p>
      <Motion.img
        src={leadingReLogo}
        alt="LeadingRE"
        style={{
          width: 230,
          filter: "brightness(0) invert(1)", // black logo → white
          opacity: 0.9,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      />
    </Motion.div>
  );
}