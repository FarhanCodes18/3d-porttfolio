import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "CORE SYSTEM INITIALIZING...",
  "ACTIVATING INTELLECTUAL MATRIX...",
  "LOADING PROCEDURAL 3D MESHES...",
  "COMPILING SHADERS & LIGHTING PATHS...",
  "INJECTING TAILWIND V4 LAYOUT ENGINE...",
  "SPAWNING GSAP SCROLL TRIGGERS...",
  "STABILIZING KINETIC SCROLL ENGINE...",
  "PORTFOLIO HUD CONNECTED (v1.0.0-beta)..."
];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Increment progress
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 2; // Jump by 2 to 10%
        return Math.min(prev + step, 100);
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Small delay at 100% to let user see "online" state
      const completeTimer = setTimeout(() => {
        setIsFinished(true);
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(completeTimer);
    }

    // Change log statements periodically based on progress
    const targetLogIndex = Math.min(
      Math.floor((progress / 100) * BOOT_LOGS.length),
      BOOT_LOGS.length - 1
    );
    if (targetLogIndex > logIndex) {
      setLogIndex(targetLogIndex);
    }
  }, [progress, logIndex, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-9999 flex flex-col justify-between bg-cyber-black p-8 md:p-16 select-none overflow-hidden hud-scanline"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100vh", 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Top HUD Frame Details */}
          <div className="flex justify-between items-center text-xs md:text-sm font-display tracking-widest text-[#FFD600] opacity-80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-pulse" />
              <span>SYS_BOOSTER.EXE</span>
            </div>
            <div>[ COGNITIVE PORTFOLIO CORE ]</div>
            <div>LOC_TIME: {new Date().toLocaleTimeString()}</div>
          </div>

          {/* Central Progress HUD */}
          <div className="flex flex-col items-center justify-center my-auto">
            {/* Holographic glowing ring */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-12 flex items-center justify-center">
              {/* Outer spinning dash ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-dashed border-[#FFD600] opacity-20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              />
              {/* Inner glowing pulse ring */}
              <motion.div 
                className="absolute inset-4 rounded-full border border-[#FFD600] opacity-40 shadow-[0_0_15px_rgba(255,214,0,0.2)]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              
              <div className="flex flex-col items-center z-10">
                <motion.span 
                  className="text-5xl md:text-7xl font-display font-bold text-[#FFD600] tracking-tight filter drop-shadow-[0_0_10px_rgba(255,214,0,0.5)]"
                >
                  {progress}%
                </motion.span>
                <span className="text-xxs tracking-[0.3em] text-[#FFD600] opacity-60 uppercase mt-2 font-display">
                  System Load
                </span>
              </div>
            </div>

            {/* Diagnostic Logs HUD */}
            <div className="w-full max-w-lg bg-cyber-gray border border-cyber-border rounded p-4 font-mono text-left text-xs text-[#FFD600]/80 h-32 overflow-hidden flex flex-col justify-end gap-1 shadow-inner relative">
              {/* Gradient cover at top */}
              <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-cyber-gray to-transparent pointer-events-none" />
              
              <div className="flex flex-col gap-1 overflow-y-auto pr-2 max-h-full">
                {BOOT_LOGS.slice(0, logIndex + 1).map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2"
                  >
                    <span className="text-[#FFD600] font-bold">&gt;&gt;</span>
                    <span className="break-all">{log}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom HUD Bar */}
          <div className="w-full">
            {/* Tech line indicator */}
            <div className="w-full h-1 bg-[#FFD600]/10 rounded mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-[#FFD600] shadow-[0_0_8px_#FFD600]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-xxs tracking-widest text-[#FFD600]/60 font-mono">
              <div>INITIALIZATION SEQUENCE IN PROGRESS // MERN_GENAI_SYS</div>
              <div>COPYRIGHT © 2026 FARHAN</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
