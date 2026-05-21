import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const PROJECTS = [
  {
    title: "NEXUS COMMERCE",
    category: "SCALABLE MERN + REDIS ARCHITECTURE",
    desc: "Built a production-ready headless e-commerce ecosystem with React, Node.js, and MongoDB. Integrates Stripe APIs for secure transaction flows, custom admin inventory analytics, and Redis caching for optimized sub-second product delivery.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Redis", "Stripe API", "JWT"],
    year: "2025",
    image: "/project_nexus.png",
    live: "#",
    github: "#"
  },
  {
    title: "3D CAR CONFIGURATOR",
    category: "THREE.JS + WEBGL ENVIRONMENT",
    desc: "Interactive 3D vehicle configurator engineered in React Three Fiber and GSAP. Features complex PBR metallic texture reflections, custom shadow mapping, camera path sweeps, and real-time color customizers running at 60FPS.",
    tech: ["React Three Fiber", "Three.js", "Drei", "GSAP", "Tailwind CSS", "WebGL"],
    year: "2025",
    image: "/project_car.png",
    live: "#",
    github: "#"
  },
  {
    title: "OMNI TELEMETRY",
    category: "WEBSOCKETS + CLUSTER MANAGEMENT",
    desc: "Real-time client telemetry analytics dashboard monitoring system health. Tracks database loads, visitor heatmaps, API latency spikes, and socket packet clustering with live canvas data visualization updates.",
    tech: ["Node.js", "Socket.io", "MongoDB", "Chart.js", "CSS Grid", "Canvas API"],
    year: "2026",
    image: "/project_telemetry.png",
    live: "#",
    github: "#"
  }
];

function ProjectCard({ project, index }) {
  const imageContainerRef = useRef(null);
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Motion values for "VIEW" circle follow
  const viewX = useMotionValue(0);
  const viewY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 280 };
  const smoothX = useSpring(viewX, springConfig);
  const smoothY = useSpring(viewY, springConfig);

  const handleImageMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    // Offset by 28px (half of 56px size of "VIEW" circle)
    viewX.set(e.clientX - rect.left - 28);
    viewY.set(e.clientY - rect.top - 28);
  };

  const handleImageMouseEnter = (e) => {
    setIsImageHovered(true);
    // Initialize coordinate at mouse entry
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      viewX.set(e.clientX - rect.left - 28);
      viewY.set(e.clientY - rect.top - 28);
    }
  };

  const handleImageMouseLeave = () => {
    setIsImageHovered(false);
  };

  // Format index as two digit string
  const numStr = String(index + 1).padStart(2, "0");

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className="w-full flex flex-col gap-4 border-b border-white/5 py-12 md:py-16 select-none last:border-b-0"
    >
      {/* Top Header Row of Project Card */}
      <div className="flex justify-between items-center font-mono text-sm tracking-widest text-gray-500 mb-2">
        <span className="text-[#FFD600] font-bold">{numStr}</span>
        <span>{project.year || "2026"}</span>
      </div>

      {/* Main Card Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Large Project Image Frame */}
        <div className="lg:col-span-7 w-full">
          <div
            ref={imageContainerRef}
            onMouseMove={handleImageMouseMove}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
            className="relative aspect-[16/10] w-full bg-[#0a0a0c] border border-white/10 rounded-xl overflow-hidden group cursor-none shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            {/* Dark gradient overlay and grain mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 z-10 transition-opacity duration-300" />
            
            {/* Project Image */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05] grayscale-[20%] group-hover:scale-102 group-hover:brightness-[0.75] transition-all duration-700 ease-out"
              draggable="false"
            />

            {/* Glowing inner border overlay */}
            <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none z-20" />

            {/* "VIEW" floating magnet circle button */}
            <AnimatePresence>
              {isImageHovered && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    x: smoothX,
                    y: smoothY,
                  }}
                  className="absolute w-14 h-14 bg-[#FFD600] rounded-full flex items-center justify-center text-[10px] font-mono font-black text-black z-30 shadow-[0_0_15px_rgba(255,214,0,0.4)] pointer-events-none"
                >
                  VIEW
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Left Buttons inside Image frame */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
              <a
                href={project.github}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-black/60 backdrop-blur-md border border-white/20 text-white rounded font-display text-xxs md:text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-lg"
              >
                <span>Github</span>
                <span className="text-[10px]">↗</span>
              </a>
              <a
                href={project.live}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FFD600] text-black border border-[#FFD600] rounded font-display text-xxs md:text-xs font-black tracking-widest uppercase hover:bg-transparent hover:text-[#FFD600] hover:border-[#FFD600]/80 transition-all duration-300 shadow-lg"
              >
                <span>Live Demo</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Project Details */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left py-2">
          {/* Category Yellow Text */}
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#FFD600] mb-3 inline-block">
            {project.category}
          </span>

          {/* Huge Editorial Title */}
          <h3 className="font-display font-black text-3.5xl md:text-5xl lg:text-5.5xl leading-[1.05] text-white tracking-tight uppercase mb-6 select-text">
            {project.title}
          </h3>

          {/* Clean Muted Paragraph Description */}
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-8 select-text">
            {project.desc}
          </p>

          {/* Tech Stack outline badges */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 border border-white/10 rounded font-mono text-[9px] uppercase tracking-wider text-gray-500 hover:border-[#FFD600] hover:text-[#FFD600] transition-colors cursor-default select-none"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-28 md:py-36 w-full bg-cyber-black overflow-hidden border-b border-cyber-border/20"
    >
      {/* Subtle Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }} 
      />

      {/* Cyber Grid overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-10 z-0" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col text-left mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs tracking-[0.3em] text-[#FFD600] uppercase">
            <span className="w-1.5 h-1.5 bg-[#FFD600] rounded-full animate-pulse" />
            <span>03 — WORKS SHOWCASE</span>
          </div>
          <h2 className="font-display font-black text-5xl md:text-7xl tracking-tight text-white uppercase select-none leading-none">
            SELECTED PROJECTS
          </h2>
          <div className="w-20 h-0.5 bg-[#FFD600] mt-5 shadow-[0_0_8px_#FFD600]" />
        </div>

        {/* Vertical Editorial Cards List */}
        <div className="flex flex-col">
          {PROJECTS.map((proj, idx) => (
            <ProjectCard key={proj.title} project={proj} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
