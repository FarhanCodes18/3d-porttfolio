import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useMotionTemplate, animate } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useDevice } from "../hooks/useDevice";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 3D Background Particles & Hologram Rings for the Stats section
function StatsBgParticles() {
  const groupRef = useRef();
  const ringRef = useRef();
  const smallRing1Ref = useRef();
  const smallRing2Ref = useRef();
  const particlesRef = useRef();

  // Create point locations procedurally
  const particleCount = 90;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 14;      // X
      arr[i + 1] = (Math.random() - 0.5) * 8;   // Y
      arr[i + 2] = (Math.random() - 0.5) * 6 - 2; // Z
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Apply scroll parallax depth effect
    if (groupRef.current) {
      const targetY = scrollY * 0.0006 - 0.3;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
      groupRef.current.rotation.y = scrollY * 0.00015;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.06;
      ringRef.current.rotation.y = time * 0.09;
    }

    if (smallRing1Ref.current) {
      smallRing1Ref.current.rotation.y = -time * 0.12;
      smallRing1Ref.current.rotation.z = time * 0.08;
      // Ambient floating
      smallRing1Ref.current.position.y = 1.3 + Math.sin(time * 0.7) * 0.12;
    }

    if (smallRing2Ref.current) {
      smallRing2Ref.current.rotation.x = time * 0.15;
      smallRing2Ref.current.rotation.y = time * 0.05;
      // Ambient floating
      smallRing2Ref.current.position.y = -1.2 + Math.cos(time * 0.5) * 0.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.008;
      particlesRef.current.rotation.x = time * 0.004;
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
          size={0.035}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Orbit Ring near top-center */}
      <mesh ref={ringRef} position={[0, 1.8, -2.5]}>
        <torusGeometry args={[3.2, 0.008, 8, 100]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.15} wireframe />
      </mesh>

      {/* Small holographic circle 1 (left) */}
      <mesh ref={smallRing1Ref} position={[-3, 1.3, -3]}>
        <torusGeometry args={[0.8, 0.004, 6, 60]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.25} wireframe />
      </mesh>

      {/* Small holographic circle 2 (right) */}
      <mesh ref={smallRing2Ref} position={[3.2, -1.2, -3]}>
        <torusGeometry args={[1.1, 0.005, 6, 60]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  );
}

// Count-Up animation component
function CountUp({ value, isInfinity, trigger }) {
  const [displayValue, setDisplayValue] = useState("00");

  useEffect(() => {
    if (!trigger) return;

    if (isInfinity) {
      let count = 0;
      const interval = setInterval(() => {
        // Rapid counting from 0 to 99, then morphing into infinity symbol
        count += Math.floor(Math.random() * 8) + 3;
        if (count >= 99) {
          clearInterval(interval);
          setDisplayValue("∞");
        } else {
          setDisplayValue(count.toString().padStart(2, "0"));
        }
      }, 25);
      return () => clearInterval(interval);
    } else {
      const target = parseInt(value, 10);
      const controls = animate(0, target, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        onUpdate: (latest) => {
          const num = Math.floor(latest);
          setDisplayValue(num.toString().padStart(2, "0"));
        }
      });
      return () => controls.stop();
    }
  }, [value, isInfinity, trigger]);

  return <span className="tabular-nums">{displayValue}</span>;
}

// Individual Stat Card with Tilt & Spotlight hover effects
function StatCard({ stat, index, inView }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 15 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 15 });

  const rectRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((centerY - y) / centerY) * 10; // Max 10 degrees tilt
    const rotY = -((centerX - x) / centerX) * 10;

    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
  };

  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(255, 214, 0, 0.12), transparent 80%)`;

  const isInfinity = stat.value === "∞";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -6 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group p-8 md:p-10 rounded-2xl border border-cyber-border/10 bg-[#0a0a0c]/40 backdrop-blur-md overflow-hidden flex flex-col justify-between aspect-[16/10] md:aspect-auto select-none shadow-[0_10px_35px_rgba(0,0,0,0.6)] cursor-default"
    >
      {/* Spotlight highlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlight }}
      />

      {/* Cyber Grid background */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none z-0" />

      {/* Futuristic corner indicators */}
      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FFD600]/30 group-hover:border-[#FFD600] transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FFD600]/30 group-hover:border-[#FFD600] transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FFD600]/30 group-hover:border-[#FFD600] transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FFD600]/30 group-hover:border-[#FFD600] transition-colors duration-300" />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col justify-end h-full">
        {/* Card Index Indicator in small text */}
        <div className="font-mono text-[9px] text-white/30 tracking-[0.25em] mb-8 select-none">
          SYS_METRIC_0{index + 1}
        </div>

        {/* Large Stat Number */}
        <div className="flex items-baseline select-none">
          <h3 className="font-display font-black text-6xl md:text-7xl lg:text-8xl text-[#FFD600] tracking-tighter filter drop-shadow-[0_0_15px_rgba(255,214,0,0.4)] neon-glow-text select-none leading-none">
            <CountUp value={stat.value} isInfinity={isInfinity} trigger={inView} />
          </h3>
          {!isInfinity && (
            <span className="font-display font-black text-4xl md:text-5xl text-[#FFD600] leading-none ml-0.5 select-none">
              +
            </span>
          )}
        </div>

        {/* Stat Label */}
        <p className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-white/50 group-hover:text-white transition-colors duration-300 mt-4 uppercase">
          {stat.label}
        </p>

        {/* Animated neon underline */}
        <div className="w-10 h-[2px] bg-gradient-to-r from-[#FFD600] to-transparent mt-4 group-hover:w-full transition-all duration-500 ease-out shadow-[0_0_8px_#FFD600]" />
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.15 });
  const canvasInView = useInView(canvasContainerRef, { margin: "250px" });
  const { isMobile } = useDevice();

  const stats = [
    { value: "02", label: "Years Experience" },
    { value: "10", label: "Projects Built" },
    { value: "05", label: "Tech Stacks" },
    { value: "∞", label: "Curiosity" }
  ];

  useEffect(() => {
    // GSAP ScrollTrigger animation for the divider line
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      ".stats-divider-line",
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".stats-section-container",
          start: "top 85%",
          once: true,
        }
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="stats-section-container relative py-24 md:py-32 w-full bg-cyber-black overflow-hidden px-6 md:px-12 border-b border-cyber-border/20 flex flex-col justify-center"
      id="stats"
    >
      {/* 3D Canvas Background */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 pointer-events-none opacity-60 select-none">
        {canvasInView && !isMobile && (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
          >
            <StatsBgParticles />
          </Canvas>
        )}
      </div>

      {/* Cyber Grid background overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 z-0" />

      {/* Ambient glow spots */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full glow-yellow-radial pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full glow-yellow-radial pointer-events-none z-0" />

      {/* Top Divider with Cyber target indicator (•) */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-10">
        <div className="stats-divider-line w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD600]/30 to-transparent origin-center" />
        <div className="absolute flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border border-[#FFD600]/40 flex items-center justify-center bg-[#050507] shadow-[0_0_10px_rgba(255,214,0,0.2)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD600] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Dashboard Title Header */}
        <div className="flex flex-col text-left mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-[#FFD600]/90 uppercase"
          >
            <span>02 — PERFORMANCE METRICS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-4xl md:text-6xl tracking-tight text-white uppercase select-none"
          >
            SYSTEM STATISTICS
          </motion.h2>
          <div className="w-20 h-0.5 bg-[#FFD600] mt-4 shadow-[0_0_8px_#FFD600]" />
        </div>

        {/* Grid layout for cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}
