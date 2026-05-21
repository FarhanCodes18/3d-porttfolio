import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useDevice } from "../hooks/useDevice";
import * as THREE from "three";

// 3D Particles & Hologram Rings for the background of the About section
function AboutBgParticles() {
  const pointsRef = useRef();
  const ringRef = useRef();

  // Create point locations
  const particleCount = 80;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 12; // X
      arr[i + 1] = (Math.random() - 0.5) * 12; // Y
      arr[i + 2] = (Math.random() - 0.5) * 8 - 4; // Z
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.02;
      pointsRef.current.rotation.x = time * 0.01;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.08;
      ringRef.current.rotation.y = time * 0.05;
      ringRef.current.rotation.z = time * 0.02;
    }
  });

  return (
    <group>
      {/* Slow floating points */}
      <points ref={pointsRef}>
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

      {/* Holographic orbital wireframe ring */}
      <mesh ref={ringRef} position={[0, 0, -2]}>
        <torusGeometry args={[3.5, 0.006, 8, 80]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.12} wireframe />
      </mesh>
    </group>
  );
}

export default function About() {
  const textContainerRef = useRef(null);
  const cardRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const canvasInView = useInView(canvasContainerRef, { margin: "250px" });
  const { isMobile } = useDevice();

  // Mouse coords for text spotlight glow
  const textMouseX = useMotionValue(0);
  const textMouseY = useMotionValue(0);

  // Motion values for image card tilt & parallax
  const cardRotateX = useMotionValue(0);
  const cardRotateY = useMotionValue(0);
  const imgTranslateX = useMotionValue(0);
  const imgTranslateY = useMotionValue(0);

  const rectRef = useRef(null);

  useEffect(() => {
    const updateRect = () => {
      if (textContainerRef.current) {
        rectRef.current = textContainerRef.current.getBoundingClientRect();
      }
    };

    const handleGlobalMouseMove = (e) => {
      if (textContainerRef.current) {
        if (!rectRef.current) {
          updateRect();
        }
        const rect = rectRef.current;
        textMouseX.set(e.clientX - rect.left);
        textMouseY.set(e.clientY - rect.top);
      }
    };

    const handleResizeOrScroll = () => {
      rectRef.current = null;
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [textMouseX, textMouseY]);

  // Card mouse tilt handler
  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotations (max 10 degrees)
    const rotX = ((centerY - y) / centerY) * 10;
    const rotY = -((centerX - x) / centerX) * 10;

    // Image Parallax Translation (max 12px shift in opposite direction)
    const transX = -((centerX - x) / centerX) * 12;
    const transY = -((centerY - y) / centerY) * 12;

    cardRotateX.set(rotX);
    cardRotateY.set(rotY);
    imgTranslateX.set(transX);
    imgTranslateY.set(transY);
  };

  const handleCardMouseLeave = () => {
    // Reset spring rotations & translations back to center
    cardRotateX.set(0);
    cardRotateY.set(0);
    imgTranslateX.set(0);
    imgTranslateY.set(0);
  };

  const textSpotlight = useMotionTemplate`radial-gradient(400px circle at ${textMouseX}px ${textMouseY}px, rgba(255, 214, 0, 0.09), transparent 80%)`;

  // Raw Content
  const firstHalf = "I design and build digital products that push the boundaries of what’s possible on the web. Specializing in ";
  const midKeywords = [
    { text: "React,", isHighlight: true },
    { text: "Node.js,", isHighlight: true },
    { text: "AI,", isHighlight: true },
    { text: "GenAI,", isHighlight: true },
    { text: "and", isHighlight: false },
    { text: "Real-time Systems", isHighlight: true, isMultiWord: true },
    { text: "—", isHighlight: false }
  ];
  const secondHalf = " I craft immersive experiences that feel alive. Every interaction should feel smooth, futuristic, and unforgettable.";

  // Split words for text reveal staggered entrance
  const paragraphWords = [
    ...firstHalf.split(" ").map(w => ({ text: w, highlight: false })),
    ...midKeywords.map(k => ({ text: k.text, highlight: k.isHighlight, isMultiWord: k.isMultiWord })),
    ...secondHalf.split(" ").map(w => ({ text: w, highlight: false }))
  ].filter(w => w.text !== "");

  const wordRevealContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const wordRevealItem = {
    hidden: { opacity: 0.15, y: 15, filter: "blur(6px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section
      id="about"
      className="relative py-28 md:py-36 w-full bg-cyber-black overflow-hidden px-6 md:px-12 border-b border-cyber-border/20 flex flex-col justify-center"
    >
      {/* 1. 3D Particles Background Canvas */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 pointer-events-none opacity-50 select-none">
        {canvasInView && !isMobile && (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
          >
            <AboutBgParticles />
          </Canvas>
        )}
      </div>

      {/* 2. Cyber grid backdrop texture overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 z-0" />

      {/* 3. Outer HUD framing lines */}
      <div className="absolute left-[5%] top-12 bottom-12 w-[1px] bg-gradient-to-b from-transparent via-[#FFD600]/10 to-transparent pointer-events-none" />
      <div className="absolute right-[5%] top-12 bottom-12 w-[1px] bg-gradient-to-b from-transparent via-[#FFD600]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section HUD Header */}
        <div className="flex flex-col text-left mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-[#FFD600]/90 uppercase"
          >
            <span>01 — WHO I AM</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-6xl md:text-8xl tracking-tight text-white uppercase select-none"
          >
            ABOUT
          </motion.h2>
          <div className="w-20 h-0.5 bg-[#FFD600] mt-4 shadow-[0_0_8px_#FFD600]" />
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Portrait Card (Interactive 3D Tilt) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative w-full max-w-sm aspect-[4/5] rounded-2xl p-[2px] transition-transform duration-200 ease-out cursor-default overflow-hidden group select-none shadow-[0_15px_45px_rgba(0,0,0,0.8)]"
              style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Spinning animated light outline around border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD600] via-transparent to-[#FFD600]/30 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_6s_linear_infinite]" />

              {/* Inner card panel body */}
              <div 
                className="w-full h-full bg-[#07070a] rounded-2xl overflow-hidden relative flex items-center justify-center"
                style={{ transform: "translateZ(10px)" }}
              >
                {/* HUD Overlay inside frame */}
                <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-10" />
                <div className="absolute top-4 left-4 font-mono text-[8px] text-[#FFD600] opacity-60 z-10 tracking-widest select-none">
                  FRAME_REF_01 // SECURE_PORTRAIT
                </div>

                {/* Main image with parallax shift inside card */}
                <motion.div
                  className="w-full h-full relative"
                  style={{
                    x: imgTranslateX,
                    y: imgTranslateY,
                    scale: 1.05,
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                >
                  <img
                    src="/src\assets\farhan.jpeg"
                    alt="Farhan portrait"
                    className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] grayscale hover:grayscale-0 transition-all duration-700"
                    draggable="false"
                  />
                </motion.div>
                
                {/* Glowing border ring tracing overlay */}
                <div className="absolute inset-2 border border-[#FFD600]/10 rounded-xl pointer-events-none z-10" />
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Oversized reveal paragraph text */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center">
            
            {/* Interactive Spotlight Glow Backdrop */}
            <div
              ref={textContainerRef}
              className="relative p-6 md:p-8 rounded-2xl border border-cyber-border/10 bg-[#0a0a0c]/40 backdrop-blur-sm overflow-hidden select-text"
            >
              {/* Spotlight overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                style={{ background: textSpotlight }}
              />

              <motion.p
                variants={wordRevealContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20%" }}
                className="relative z-10 font-display text-2xl md:text-3xl lg:text-[2.25rem] leading-[1.45] md:leading-[1.4] text-white/70 font-light flex flex-wrap gap-x-2.5 gap-y-2 select-text"
              >
                {paragraphWords.map((word, idx) => (
                  <motion.span
                    variants={wordRevealItem}
                    key={idx}
                    className={`inline-block origin-bottom ${
                      word.highlight 
                        ? "text-[#FFD600] font-bold filter drop-shadow-[0_0_12px_rgba(255,214,0,0.4)] neon-glow-text" 
                        : "text-white/80 hover:text-white transition-colors duration-300"
                    }`}
                  >
                    {word.text}
                  </motion.span>
                ))}
              </motion.p>
            </div>

            {/* Bottom HUD details under text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 font-mono text-[9px] md:text-[10px] tracking-widest text-[#FFD600]/60 pl-2"
            >
              <div>COGNITIVE CORE: ACTIVATED</div>
              <div>TRANS_LATENCY: 0.12ms</div>
              <div>LOCALE: IN_SYS_17</div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
