import React, { useRef, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
  const containerRef = useRef(null);

  // Motion values for mouse position (for follow spotlight glow)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Create a template string for the radial spotlight glow style
  const spotlightStyle = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255, 214, 0, 0.08), transparent 80%)`;

  const lenis = useLenis();

  const scrollToAbout = (e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo("#about", { duration: 1.2 });
    } else {
      const aboutEl = document.querySelector("#about");
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo("#contact", { duration: 1.2 });
    } else {
      const contactEl = document.querySelector("#contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full bg-cyber-black flex flex-col justify-center items-center overflow-hidden px-6 md:px-12 py-20"
    >
      {/* 1. Interactive Mouse Spotlight Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: spotlightStyle }}
      />

      {/* 2. Cyber Matrix Grid Background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* 3. Massive background HUD Letter "F" */}
      <div className="absolute left-[8%] md:left-[15%] top-[15%] md:top-[12%] select-none font-display font-extrabold text-[25vw] md:text-[30vw] text-white/[0.015] leading-none pointer-events-none z-0 hover:text-white/[0.02] transition-colors duration-700">
        F
      </div>

      {/* 4. Perspective 3D Grid Floor Projection */}
      <div className="perspective-grid pointer-events-none z-5">
        <div className="grid-floor" />
      </div>

      {/* 5. Main Hero Container Grid */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 my-auto">
        
        {/* Left Side: Bold Futuristic Typography */}
        <div className="lg:col-span-7 flex flex-col text-left justify-center pr-0 xl:pr-10">
          
          {/* Cyber Status Tag */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 border border-cyber-border/40 w-fit px-3 py-1 rounded bg-[#FFD600]/5 text-xs font-mono tracking-widest text-[#FFD600] mb-6"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD600] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD600]"></span>
            </span>
            <span>SYSTEM ONLINE // LINK_ESTABLISHED</span>
          </motion.div>

          {/* Name Display */}
          <h1 className="font-display font-black text-6xl md:text-8xl leading-none text-white tracking-tight uppercase select-none mb-1">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block tracking-tight text-white"
            >
              FARHAN
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="block tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] via-[#FFE34D] to-[#FFD600]/70 filter drop-shadow-[0_0_15px_rgba(255,214,0,0.35)]"
            >
              PORTFOLIO
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg md:text-2xl font-display font-medium tracking-[0.25em] text-white/95 uppercase mb-6 flex flex-wrap items-center gap-x-3 gap-y-1"
          >
            <span>MERN STACK</span>
            <span className="text-[#FFD600]">•</span>
            <span className="text-[#FFD600] neon-glow-text">GENAI ENGINEER</span>
          </motion.div>

          {/* Core Brief / Elevator Pitch */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm md:text-base text-gray-400 font-sans font-light max-w-xl mb-10 leading-relaxed"
          >
            Architecting next-generation, high-performance web applications using MongoDB, Express, React, and Node.js. Pushing boundaries by embedding intelligent LLM automation and immersive 3D geometries for award-winning digital interfaces.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <a
              href="#about"
              onClick={scrollToAbout}
              className="group relative overflow-hidden px-8 py-3.5 rounded bg-[#FFD600] text-cyber-black text-sm tracking-widest uppercase font-display font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,214,0,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span>EXPLORE MISSION</span>
            </a>
            
            <a
              href="#contact"
              onClick={scrollToContact}
              className="group relative overflow-hidden px-8 py-3.5 rounded border border-cyber-border bg-[#FFD600]/5 text-white hover:text-[#FFD600] hover:border-[#FFD600] hover:shadow-[0_0_15px_rgba(255,214,0,0.2)] text-sm tracking-widest uppercase font-display transition-all duration-300"
            >
              <span>GET IN TOUCH</span>
            </a>
          </motion.div>

          {/* Diagnostic Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
            className="hidden md:flex items-center gap-8 mt-16 font-mono text-[9px] tracking-widest text-[#FFD600]"
          >
            <div>GPU_STATUS: RENDER_ACTIVE</div>
            <div>R3F_STABILIZATION: 99.82%</div>
            <div>CORE_MATRIX: ESTABLISHED</div>
          </motion.div>
        </div>

        {/* Right Side: R3F Canvas Container */}
        <div className="lg:col-span-5 h-[400px] lg:h-[600px] w-full relative">
          {/* Subtle hologram glow backdrop behind canvas */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#FFD600]/10 blur-[80px] pointer-events-none" />
          <HeroCanvas />
        </div>
      </div>

      {/* 6. Scroll Prompt Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-6 flex flex-col items-center gap-2 cursor-pointer z-10"
        onClick={scrollToAbout}
      >
        <span className="font-mono text-[10px] tracking-[0.35em] text-[#FFD600] opacity-80 uppercase">
          Scroll Down
        </span>
        <div className="w-[18px] h-[30px] rounded-full border-2 border-[#FFD600]/50 flex justify-center p-[3px]">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-[#FFD600]"
          />
        </div>
      </motion.div>
    </section>
  );
}
