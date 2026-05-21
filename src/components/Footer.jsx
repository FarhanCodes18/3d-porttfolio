import React, { useEffect, useState } from "react";
import { ArrowUp, Terminal, ShieldAlert } from "lucide-react";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      setTime(date.toLocaleTimeString());
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050507] border-t border-cyber-border/20 py-12 px-6 md:px-12 w-full text-left overflow-hidden">
      {/* Bottom Grid Backdrop */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        
        {/* Left Side: System Metrics Status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white font-display font-bold text-sm tracking-wider">
            <span>FARHAN</span>
            <span className="text-[#FFD600]">•</span>
            <span className="text-gray-400 font-normal">PORTFOLIO COGNITION</span>
          </div>
          <p className="text-gray-500 text-xxs font-mono tracking-widest uppercase">
            © 2026 FARHAN. ALL RIGHTS SECURED // USER_IP_LOGGED
          </p>
        </div>

        {/* Center: Live Local Time widget */}
        <div className="flex items-center gap-3 bg-[#0a0a0c] border border-cyber-border/30 rounded px-4 py-2 font-mono text-[10px] text-[#FFD600] tracking-widest shadow-inner">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          <span>TIME_COGNITION:</span>
          <span className="font-bold text-white">{time || "INITIALIZING..."}</span>
        </div>

        {/* Right Side: Back to top shortcut */}
        <div className="flex items-center gap-6">
          <a
            href="#hero"
            onClick={scrollToTop}
            className="w-10 h-10 rounded border border-cyber-border/40 hover:border-[#FFD600] bg-cyber-gray hover:bg-[#FFD600]/5 text-gray-400 hover:text-[#FFD600] flex items-center justify-center transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group"
            title="Return to Core"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </footer>
  );
}
