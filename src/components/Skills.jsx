import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useDevice } from "../hooks/useDevice";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRONTEND_STACK = [
  "React.js",
  "Redux Toolkit",
  "Context API",
  "React Optimizations",
  "Custom Hooks",
  "API Integration",
  "Tailwind CSS",
  "HTML5 / CSS3",
  "Shadcn UI",
  "Framer Motion",
  "GSAP",
  "Next.js",
  "Three.js"
];

const BACKEND_STACK = [
  "Node.js",
  "Express.js",
  "MongoDB",
  "REST APIs",
  "Authentication (JWT / RBAC)",
  "Passport.js",
  "Middleware & Error Handling",
  "Multer.js",
  "Cloudinary",
  "ImageKit",
  "Socket.IO",
  "Firebase",
  "Prisma ORM",
  "AI Integrations"
];

// Custom brand-specific colors for hover & active click states
const TECH_COLORS = {
  // Frontend
  "React.js": "#00D8FF",
  "Redux Toolkit": "#A855F7",
  "Context API": "#00FFCC",
  "React Optimizations": "#38BDF8",
  "Custom Hooks": "#10B981",
  "API Integration": "#F43F5E",
  "Tailwind CSS": "#38BDF8",
  "HTML5 / CSS3": "#E34F26",
  "Shadcn UI": "#F8FAFC",
  "Framer Motion": "#FF007F",
  "GSAP": "#88CE02",
  "Next.js": "#FFFFFF",
  "Three.js": "#FFD600",
  
  // Backend
  "Node.js": "#39FF14",
  "Express.js": "#94A3B8",
  "MongoDB": "#10B981",
  "REST APIs": "#0284C7",
  "Authentication (JWT / RBAC)": "#EAB308",
  "Passport.js": "#38BDF8",
  "Middleware & Error Handling": "#EF4444",
  "Multer.js": "#F97316",
  "Cloudinary": "#60A5FA",
  "ImageKit": "#818CF8",
  "Socket.IO": "#00E5FF",
  "Firebase": "#F59E0B",
  "Prisma ORM": "#6366F1",
  "AI Integrations": "#EC4899"
};

// Inline keyframes and classes for laser border tracing on hover
const borderTraceStyles = `
  @keyframes trace-top {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes trace-right {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes trace-bottom {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes trace-left {
    0% { transform: translateY(100%); }
    100% { transform: translateY(-100%); }
  }

  .animate-border-trace-top {
    animation: trace-top 2.5s linear infinite;
  }
  .animate-border-trace-right {
    animation: trace-right 2.5s linear infinite;
    animation-delay: 0.625s;
  }
  .animate-border-trace-bottom {
    animation: trace-bottom 2.5s linear infinite;
    animation-delay: 1.25s;
  }
  .animate-border-trace-left {
    animation: trace-left 2.5s linear infinite;
    animation-delay: 1.875s;
  }
`;

// 3D Background Particles & Hologram Rings
function SkillsBgParticles() {
  const groupRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();
  const particlesRef = useRef();

  const particleCount = 90;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 15;      // X
      arr[i + 1] = (Math.random() - 0.5) * 10;   // Y
      arr[i + 2] = (Math.random() - 0.5) * 6 - 2; // Z
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Apply scroll parallax depth effect
    if (groupRef.current) {
      const targetY = scrollY * 0.0005 - 1.5;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
      groupRef.current.rotation.y = scrollY * 0.0001;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.05;
      ringRef.current.rotation.y = time * 0.08;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.1;
      ring2Ref.current.rotation.z = time * 0.06;
      ring2Ref.current.position.y = 1.0 + Math.sin(time * 0.6) * 0.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.005;
      particlesRef.current.rotation.x = time * 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Subtle Background Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FFD600"
          size={0.03}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Rotating orbit ring */}
      <mesh ref={ringRef} position={[0, -1, -2.5]}>
        <torusGeometry args={[3.8, 0.006, 8, 100]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.1} wireframe />
      </mesh>

      {/* Holographic thin ring */}
      <mesh ref={ring2Ref} position={[-2.5, 1, -3]}>
        <torusGeometry args={[1.5, 0.004, 6, 80]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.15} wireframe />
      </mesh>
    </group>
  );
}

// Reusable Tech Pill Component with Magnetic & 3D Tilt Physics
function TechPill({ name, index }) {
  const pillRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Retrieve brand color
  const activeColor = TECH_COLORS[name] || "#FFD600";

  // Springs for smooth responsive physics
  const x = useSpring(0, { stiffness: 120, damping: 12 });
  const y = useSpring(0, { stiffness: 120, damping: 12 });
  const rotateX = useSpring(0, { stiffness: 120, damping: 12 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 12 });

  // Spotlight coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rectRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!pillRef.current) return;
    if (!rectRef.current) {
      rectRef.current = pillRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX);
    mouseY.set(clientY);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Magnetic pull: shift card slightly (max 7px)
    const pullX = ((clientX - centerX) / centerX) * 7;
    const pullY = ((clientY - centerY) / centerY) * 7;

    // 3D tilt: max 6 degrees
    const rotX = -((clientY - centerY) / centerY) * 6;
    const rotY = ((clientX - centerX) / centerX) * 6;

    x.set(pullX);
    y.set(pullY);
    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (pillRef.current) {
      rectRef.current = pillRef.current.getBoundingClientRect();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Click handler to toggle active status
  const handleClick = () => {
    setIsActive(!isActive);
  };

  // Convert hex color to rgb for soft transparency
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 214, 0";
  };

  const activeRgb = hexToRgb(activeColor);

  const spotlight = useMotionTemplate`radial-gradient(110px circle at ${mouseX}px ${mouseY}px, rgba(${activeRgb}, 0.22), transparent 85%)`;

  const pillVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <motion.div
      variants={pillVariants}
      animate={isHovered ? { y: 0 } : { y: [0, -3, 0] }}
      transition={isHovered ? { duration: 0.2 } : {
        duration: 2.5 + (index % 3) * 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: index * 0.05
      }}
      className="relative z-10"
    >
      <motion.div
        ref={pillRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          x,
          y,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          borderColor: isActive ? activeColor : "rgba(255, 255, 255, 0.1)",
          boxShadow: isActive ? `0 0 20px rgba(${activeRgb}, 0.25), inset 0 0 8px rgba(${activeRgb}, 0.1)` : "none"
        }}
        whileHover={{ scale: 1.05 }}
        className="relative group px-6 py-4 rounded-xl border bg-[#0a0a0d]/70 backdrop-blur-md overflow-hidden cursor-pointer select-none transition-all duration-300"
      >
        {/* Spotlight Radial Background Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlight }}
        />

        {/* Dynamic Laser Tracing lines on hover/active */}
        <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none z-10 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <div 
            className="absolute top-0 left-0 w-full h-[1px] animate-border-trace-top" 
            style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)` }}
          />
          <div 
            className="absolute top-0 right-0 w-[1px] h-full animate-border-trace-right" 
            style={{ background: `linear-gradient(180deg, transparent, ${activeColor}, transparent)` }}
          />
          <div 
            className="absolute bottom-0 left-0 w-full h-[1px] animate-border-trace-bottom" 
            style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)` }}
          />
          <div 
            className="absolute top-0 left-0 w-[1px] h-full animate-border-trace-left" 
            style={{ background: `linear-gradient(180deg, transparent, ${activeColor}, transparent)` }}
          />
        </div>

        {/* Content */}
        <span 
          className="relative z-20 font-sans text-sm md:text-base font-extrabold tracking-wider transition-all duration-300 uppercase"
          style={{
            color: isActive ? activeColor : "rgba(255, 255, 255, 0.7)",
            textShadow: isActive ? `0 0 10px rgba(${activeRgb}, 0.6)` : "none"
          }}
        >
          {name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const canvasInView = useInView(canvasContainerRef, { margin: "250px" });
  const { isMobile } = useDevice();

  // Mouse coordinates for Title spotlight follow
  const headerX = useMotionValue(0);
  const headerY = useMotionValue(0);

  const handleHeaderMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    headerX.set(e.clientX - rect.left);
    headerY.set(e.clientY - rect.top);
  };

  const headerGlow = useMotionTemplate`radial-gradient(200px circle at ${headerX}px ${headerY}px, rgba(255, 214, 0, 0.07), transparent 80%)`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      ".stack-header-line",
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stack-section-container",
          start: "top 80%",
          once: true,
        }
      }
    );

    gsap.fromTo(
      ".stack-title",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".stack-section-container",
          start: "top 80%",
          once: true,
        }
      }
    );
  }, []);

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="stack-section-container relative py-28 md:py-36 w-full bg-cyber-black overflow-hidden px-6 md:px-12 border-b border-cyber-border/20 flex flex-col justify-center"
    >
      <style dangerouslySetInnerHTML={{ __html: borderTraceStyles }} />

      {/* 3D Background Particles Canvas */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 pointer-events-none opacity-60 select-none">
        {canvasInView && !isMobile && (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
          >
            <SkillsBgParticles />
          </Canvas>
        )}
      </div>

      {/* Soft vertical grid lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 z-0" 
        style={{ 
          backgroundImage: "linear-gradient(90deg, rgba(255, 214, 0, 0.03) 1px, transparent 1px)", 
          backgroundSize: "80px 100%" 
        }} 
      />

      {/* Ambient glow spots */}
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] rounded-full glow-yellow-radial pointer-events-none z-0" />
      <div className="absolute top-1/4 right-10 w-[450px] h-[450px] rounded-full glow-yellow-radial pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header with Title Spotlight */}
        <div 
          ref={headerRef}
          onMouseMove={handleHeaderMouseMove}
          className="relative flex flex-col text-left mb-20 md:mb-28 p-6 rounded-2xl overflow-hidden group select-none"
        >
          {/* Header Spotlight overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: headerGlow }}
          />

          {/* Subtle giant background letters */}
          <div className="absolute -left-4 -top-8 font-display font-black text-8xl md:text-12xl text-white/[0.02] uppercase tracking-widest select-none pointer-events-none">
            ARSENAL
          </div>

          <div className="flex items-center gap-4 mb-4 relative z-10">
            <span className="font-mono text-xs text-[#FFD600] font-bold">03</span>
            <div className="stack-header-line w-16 h-[1px] bg-[#FFD600] origin-left" />
            <span className="font-mono text-xs tracking-[0.25em] text-white/60 uppercase">TECH ARSENAL</span>
          </div>

          <div className="relative w-fit z-10">
            <h2 className="stack-title font-display font-black text-7xl md:text-9xl tracking-tighter text-white uppercase select-none leading-none">
              STACK
            </h2>

            {/* Orbiting HUD Ring target overlap */}
            <div className="absolute -right-6 md:-right-8 bottom-2 w-8 h-8 rounded-full border border-blue-500/50 flex items-center justify-center pointer-events-none select-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FFD600] shadow-[0_0_6px_#FFD600]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Split columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start w-full">
          
          {/* FRONTEND COLUMN */}
          <div className="flex flex-col w-full text-left">
            <div className="border-b border-cyber-border/20 pb-4 mb-8 relative">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-[#FFD600]">01</span>
                <h3 className="font-display font-black text-3xl md:text-4xl text-[#FFD600] tracking-wider uppercase">FRONTEND</h3>
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-[1.5px] bg-[#FFD600] shadow-[0_0_6px_#FFD600]" />
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap gap-x-4 gap-y-5 justify-start w-full"
            >
              {FRONTEND_STACK.map((tech, idx) => (
                <TechPill key={tech} name={tech} index={idx} />
              ))}
            </motion.div>
          </div>

          {/* BACKEND COLUMN */}
          <div className="flex flex-col w-full text-left">
            <div className="border-b border-cyber-border/20 pb-4 mb-8 relative">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-white/50">02</span>
                <h3 className="font-display font-black text-3xl md:text-4xl text-white tracking-wider uppercase">BACKEND</h3>
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-[1.5px] bg-white/40" />
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap gap-x-4 gap-y-5 justify-start w-full"
            >
              {BACKEND_STACK.map((tech, idx) => (
                <TechPill key={tech} name={tech} index={idx} />
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
