import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useDevice } from "../hooks/useDevice";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, Play, Terminal, HelpCircle, Activity, Cpu, Code } from "lucide-react";

// Presets for the interactive terminal simulation
const PRESETS = [
  {
    cmd: "RUN AETHERMIND_AGENT",
    label: "AetherMind Agent",
    logs: [
      "SYSTEM CORE CONNECTED...",
      "RUNNING AI PIPELINE...",
      "LOADING VECTOR DATABASE...",
      "ANALYZING USER CONTEXT...",
      "GENERATING INTELLIGENT RESPONSE...",
      "STATUS: STABLE"
    ],
    response: {
      engine: "Gemini-2.5-Pro",
      framework: "LangChain",
      vectorDB: "Pinecone",
      architecture: "MERN + AI",
      status: "ONLINE"
    }
  },
  {
    cmd: "QUERY NEURAL_TELEMETRY",
    label: "AI Diagnostics",
    logs: [
      "ESTABLISHING SECURE BACKPLANE LINK...",
      "SCANNING VECTOR EMBEDDINGS...",
      "COMPUTING COGNITIVE LATENCY INDEX...",
      "RETRIEVING CONTEXT FROM PINECONE DB...",
      "SEMANTIC CACHE COMPRESSION RATIO RUNNING...",
      "DIAGNOSTIC SEQUENCE END: NOMINAL"
    ],
    response: {
      status: "STABLE",
      vectorDB: "Pinecone Vector Core",
      dimensions: 1536,
      semanticCache: "Redis (94.2% Hit Rate)",
      tokenEfficiency: "+42.5% Optimized",
      systemHealth: "NOMINAL"
    }
  },
  {
    cmd: "RUN SYSTEM_TELEMETRY",
    label: "Telemetry Scan",
    logs: [
      "INITIALIZING HARDWARE HANDSHAKE...",
      "VERIFYING EXPRESS API STACKS...",
      "PINGING GEMINI-2.5 ENDPOINTS...",
      "DETERMINING ROUTING NETWORK TIMING...",
      "MERN PIPELINE HEALTH CHECKS STABLE...",
      "SYSTEM ROUTE GATEWAY ONLINE."
    ],
    response: {
      status: "COMPLETED",
      ping: "12ms",
      loadPercentage: "8.6%",
      uptime: "99.9997% (Node Gateway)",
      diagnostics: "All neural pipeline routers online and stable."
    }
  }
];

const BADGE_COLORS = {
  "LangChain": "#00E5FF",
  "OpenAI API": "#10B981",
  "Pinecone": "#EF4444",
  "Express.js": "#94A3B8",
  "Gemini API": "#3B82F6",
  "Vector DB": "#F59E0B",
  "RAG Pipeline": "#EC4899"
};

// Inline styles for tracing animations, scanlines, sweeps, and particles
const aiControlCenterStyles = `
  @keyframes scanline-ai {
    0% { transform: translateY(0); }
    50% { transform: translateY(384px); } /* matches terminal h-96 */
    100% { transform: translateY(0); }
  }
  .animate-scanline-ai {
    animation: scanline-ai 7s ease-in-out infinite;
  }

  @keyframes trace-top-ai {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes trace-right-ai {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes trace-bottom-ai {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes trace-left-ai {
    0% { transform: translateY(100%); }
    100% { transform: translateY(-100%); }
  }

  .animate-trace-top-ai {
    animation: trace-top-ai 3s linear infinite;
  }
  .animate-trace-right-ai {
    animation: trace-right-ai 3s linear infinite;
    animation-delay: 0.75s;
  }
  .animate-trace-bottom-ai {
    animation: trace-bottom-ai 3s linear infinite;
    animation-delay: 1.5s;
  }
  .animate-trace-left-ai {
    animation: trace-left-ai 3s linear infinite;
    animation-delay: 2.25s;
  }

  @keyframes text-flicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 0.99;
      filter: drop-shadow(0 0 2px rgba(255, 214, 0, 0.4));
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.35;
      filter: drop-shadow(0 0 0px transparent);
    }
  }
  .animate-text-flicker {
    animation: text-flicker 5s infinite;
  }

  @keyframes light-sweep {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  .text-sweep-glow {
    background: linear-gradient(
      90deg,
      #ffffff 35%,
      #ffd600 48%,
      #00e5ff 52%,
      #ffffff 65%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: light-sweep 5s linear infinite;
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.15);
  }

  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(180deg); }
  }
  @keyframes float-medium {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-7px) rotate(-180deg); }
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes spin-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
  .animate-float-slow {
    animation: float-slow 12s ease-in-out infinite;
  }
  .animate-float-medium {
    animation: float-medium 8s ease-in-out infinite;
  }
  .animate-spin-slow {
    animation: spin-slow 24s linear infinite;
  }
  .animate-spin-reverse {
    animation: spin-reverse 18s linear infinite;
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.04); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 6s ease-in-out infinite;
  }

  @keyframes underline-sweep {
    0%, 100% {
      width: 100px;
      box-shadow: 0 0 10px #FFD600, 0 0 20px #00e5ff;
    }
    50% {
      width: 280px;
      box-shadow: 0 0 20px #FFD600, 0 0 35px #00e5ff;
    }
  }
  .animate-underline-sweep {
    animation: underline-sweep 4s ease-in-out infinite;
  }

  /* Animated perspective cyber grid lines */
  .cyber-grid-vertical {
    background-image: linear-gradient(90deg, rgba(255, 214, 0, 0.03) 1px, transparent 1px);
    background-size: 80px 100%;
  }

  .noise-bg {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.035;
  }
`;

// 3D Neural Network Nodes and Connection Lines
function NeuralNetwork3D({ mouse }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const sphere1Ref = useRef();
  const sphere2Ref = useRef();
  const sphere3Ref = useRef();
  const pointsRef = useRef();
  const networkRef = useRef();
  const dustRef = useRef();

  const currentMouseX = useRef(0);
  const currentMouseY = useRef(0);

  const count = 50;
  const { positions, lineIndices } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const indices = [];

    // Distribute points in a sphere shape
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.6; // radius up to 2.6

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }

    // Connect close points with lines
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 1.15) {
          indices.push(i, j);
        }
      }
    }

    return { 
      positions: pos, 
      lineIndices: new Uint16Array(indices) 
    };
  }, []);

  // Set up secondary background floating dust
  const dustCount = 60;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Smoothly lerp towards tracked mouse coordinates
    const targetMouseX = mouse.x * 0.5;
    const targetMouseY = mouse.y * 0.5;
    currentMouseX.current = THREE.MathUtils.lerp(currentMouseX.current, targetMouseX, 0.05);
    currentMouseY.current = THREE.MathUtils.lerp(currentMouseY.current, targetMouseY, 0.05);

    // Scroll parallax depth effect
    const targetY = scrollY * 0.0004 - 1.6;

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + currentMouseY.current * 0.4, 0.05);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, currentMouseX.current * 0.4, 0.05);
      
      // Auto-rotation combined with interactive mouse offset
      groupRef.current.rotation.y = time * 0.02 + currentMouseX.current * 0.25;
      groupRef.current.rotation.x = currentMouseY.current * 0.25;
    }

    // Spin holographic outer rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.08;
      ring1Ref.current.rotation.x = time * 0.04;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.06;
      ring2Ref.current.rotation.z = time * 0.03;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -time * 0.05;
      ring3Ref.current.rotation.z = -time * 0.07;
    }

    // Floating dynamic nodes movement (with sine/cosine wave offset)
    if (sphere1Ref.current) {
      sphere1Ref.current.position.y = 1.2 + Math.sin(time * 0.8) * 0.15;
      sphere1Ref.current.position.x = -1.5 + Math.cos(time * 0.6) * 0.1;
    }
    if (sphere2Ref.current) {
      sphere2Ref.current.position.y = -0.8 + Math.cos(time * 0.9) * 0.2;
      sphere2Ref.current.position.z = 1.0 + Math.sin(time * 0.7) * 0.15;
    }
    if (sphere3Ref.current) {
      sphere3Ref.current.position.y = 1.8 + Math.sin(time * 1.1) * 0.1;
      sphere3Ref.current.position.x = 0.5 + Math.cos(time * 1.3) * 0.15;
    }

    // Drifting main point cloud
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.01;
    }

    // Slow drift for background dust
    if (dustRef.current) {
      dustRef.current.rotation.y = -time * 0.004;
      dustRef.current.position.y = Math.sin(time * 0.12) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central neural nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FFD600"
          size={0.065}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.65}
        />
      </points>

      {/* Connection paths */}
      <lineSegments ref={networkRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[lineIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00E5FF"
          transparent={true}
          opacity={0.24}
          linewidth={1}
        />
      </lineSegments>

      {/* Background dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00E5FF"
          size={0.035}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.3}
        />
      </points>

      {/* Floating Glowing Nodes (Double-layered spheres: white core + neon glow) */}
      <group ref={sphere1Ref} position={[-1.5, 1.2, -1]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="#FFD600" transparent opacity={0.35} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group ref={sphere2Ref} position={[2, -0.8, 1]}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group ref={sphere3Ref} position={[0.5, 1.8, -2]}>
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color="#FFD600" transparent opacity={0.4} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Orbiting torus rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.005, 8, 100]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.12} wireframe />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.1, 0.007, 6, 80]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.08} wireframe />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.8, 0.004, 4, 60]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.15} wireframe />
      </mesh>
    </group>
  );
}

// Reusable Tech Badges with Magnetic Follow
function AICardBadge({ name }) {
  const badgeRef = useRef(null);
  const activeColor = BADGE_COLORS[name] || "#FFD600";

  // Spring animations for magnetic pull
  const x = useSpring(0, { stiffness: 120, damping: 10 });
  const y = useSpring(0, { stiffness: 120, damping: 10 });

  const rectRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!badgeRef.current) return;
    if (!rectRef.current) {
      rectRef.current = badgeRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Shift badge slightly in direction of cursor (max 5px)
    x.set(((clientX - centerX) / centerX) * 5);
    y.set(((clientY - centerY) / centerY) * 5);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  // Convert Hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 214, 0";
  };

  return (
    <motion.span
      ref={badgeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
        borderColor: `${activeColor}30`,
        color: activeColor,
        textShadow: `0 0 6px rgba(${hexToRgb(activeColor)}, 0.3)`
      }}
      whileHover={{ 
        scale: 1.05, 
        borderColor: activeColor, 
        backgroundColor: `rgba(${hexToRgb(activeColor)}, 0.06)` 
      }}
      transition={{ type: "spring", stiffness: 150, damping: 10 }}
      className="px-3 py-1 text-[10px] md:text-xs font-mono rounded border bg-[#0b0b0e]/30 cursor-default select-none uppercase tracking-wider transition-colors duration-300"
    >
      {name}
    </motion.span>
  );
}

// Interactive AI Card with 3D Tilt, Laser sweeps and Corners
function AICard() {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(0, { stiffness: 120, damping: 12 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 12 });

  // Spotlight follow coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rectRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX);
    mouseY.set(clientY);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 3D tilt: max 7 degrees
    const rotX = -((clientY - centerY) / centerY) * 7;
    const rotY = ((clientX - centerX) / centerX) * 7;

    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
  };

  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(0, 229, 255, 0.08), transparent 85%)`;

  const badges = ["LangChain", "OpenAI API", "Pinecone", "Express.js", "Gemini API", "Vector DB", "RAG Pipeline"];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3 }}
      className="relative group p-8 rounded-2xl border border-white/10 bg-[#0a0a0c]/60 backdrop-blur-xl overflow-hidden flex flex-col justify-between shadow-[0_12px_35px_rgba(0,0,0,0.75)] cursor-default select-text"
    >
      {/* Background spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spotlight }}
      />

      {/* Cyber Grid background */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none z-0" />

      {/* Corner indicators */}
      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FFD600]/40 group-hover:border-[#FFD600] transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FFD600]/40 group-hover:border-[#FFD600] transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FFD600]/40 group-hover:border-[#FFD600] transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FFD600]/40 group-hover:border-[#FFD600] transition-colors duration-300" />

      {/* Laser tracing sweep on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent animate-trace-top-ai" />
        <div className="absolute top-0 right-0 w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#FFD600] to-transparent animate-trace-right-ai" />
        <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent animate-trace-bottom-ai" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#FFD600] to-transparent animate-trace-left-ai" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 select-text">
        <div className="flex items-center gap-2 mb-6 font-mono text-[9px] text-[#00E5FF] tracking-[0.3em]">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>NODE // AGENT_AETHERMIND</span>
        </div>

        <h4 className="font-display font-black text-xl md:text-2xl text-white tracking-wide uppercase mb-4">
          AETHERMIND AI AGENT
        </h4>
        
        <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 select-text">
          A multi-agent LangChain router automating complex enterprise customer support. Analyzes sentiment, retrieves vector contexts, and generates AI-powered responses.
        </p>

        {/* Tech Badges Container */}
        <div className="flex flex-wrap gap-2.5 pt-6 border-t border-white/5">
          {badges.map((badge) => (
            <AICardBadge key={badge} name={badge} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Custom JSON syntax highlighter renderer
function JSONHighlighter({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  
  return (
    <pre className="whitespace-pre-wrap font-mono text-[10px] md:text-[11px] leading-relaxed text-white select-text">
      {lines.map((line, idx) => {
        // Match keys e.g. "engine":
        const keyMatch = line.match(/^(\s*"[^"]+"\s*):/);
        if (keyMatch) {
          const key = keyMatch[1];
          const rest = line.substring(keyMatch[0].length);
          
          // Match string values in rest
          const strMatch = rest.match(/^(\s*"[^"]*"\s*)(,?)/);
          if (strMatch) {
            const strVal = strMatch[1];
            const comma = strMatch[2];
            return (
              <div key={idx} className="select-text">
                <span className="text-[#FFD600] font-bold">{key}</span>:
                <span className="text-[#00E5FF] font-medium">{strVal}</span>
                <span className="text-white/60">{comma}</span>
              </div>
            );
          }
          
          // Match numerical, booleans, or null values in rest
          const otherMatch = rest.match(/^(\s*[0-9a-zA-Z\.\-\+]+)(,?)/);
          if (otherMatch) {
            const val = otherMatch[1];
            const comma = otherMatch[2];
            return (
              <div key={idx} className="select-text">
                <span className="text-[#FFD600] font-bold">{key}</span>:
                <span className="text-white font-semibold">{val}</span>
                <span className="text-white/60">{comma}</span>
              </div>
            );
          }
        }
        return <div key={idx} className="text-white/50 select-text">{line}</div>;
      })}
    </pre>
  );
}

export default function AIGenAI() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const canvasInView = useInView(canvasContainerRef, { margin: "250px" });
  const { isMobile } = useDevice();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const headerX = useMotionValue(0);
  const headerY = useMotionValue(0);

  const [activePreset, setActivePreset] = useState("RUN AETHERMIND_AGENT");
  const [terminalLines, setTerminalLines] = useState([]);
  const [jsonText, setJsonText] = useState("");
  const [jsonOutput, setJsonOutput] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const sectionRectRef = useRef(null);
  const headerRectRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    if (!sectionRectRef.current) {
      sectionRectRef.current = sectionRef.current.getBoundingClientRect();
    }
    const rect = sectionRectRef.current;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1; // -1 to 1
    setMousePos({ x, y });
  };

  const handleHeaderMouseMove = (e) => {
    if (!headerRef.current) return;
    if (!headerRectRef.current) {
      headerRectRef.current = headerRef.current.getBoundingClientRect();
    }
    const rect = headerRectRef.current;
    headerX.set(e.clientX - rect.left);
    headerY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    const handleResizeOrScroll = () => {
      sectionRectRef.current = null;
      headerRectRef.current = null;
    };
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);
    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, []);

  const headerGlow = useMotionTemplate`radial-gradient(240px circle at ${headerX}px ${headerY}px, rgba(255, 214, 0, 0.08), transparent 80%)`;

  // GSAP Animations on scroll load
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      ".ai-header-line",
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ai-section-container",
          start: "top 80%",
          once: true,
        }
      }
    );

    gsap.fromTo(
      ".ai-title",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".ai-section-container",
          start: "top 80%",
          once: true,
        }
      }
    );
  }, []);

  // Run simulated AI terminal diagnostics steps character by character
  const triggerTerminalSequence = async (preset) => {
    if (isTyping) return;
    setIsTyping(true);
    setTerminalLines([]);
    setJsonText("");
    setJsonOutput(null);
    setActivePreset(preset.cmd);

    // 1. Type query Command Line
    const cmdLine = `run QUERY ${preset.cmd}...`;
    setTerminalLines([""]);
    let currentCmdText = "";
    for (let charIndex = 0; charIndex < cmdLine.length; charIndex++) {
      currentCmdText += cmdLine[charIndex];
      setTerminalLines([`> ${currentCmdText}`]);
      await new Promise((resolve) => setTimeout(resolve, 14));
    }
    
    await new Promise((resolve) => setTimeout(resolve, 180));

    // 2. Type diagnostic log statuses
    const logs = preset.logs;
    for (let i = 0; i < logs.length; i++) {
      const fullLine = logs[i];
      const prefix = "> ";
      let currentText = "";
      
      // Push placeholder line
      setTerminalLines((prev) => [...prev, ""]);
      
      for (let charIndex = 0; charIndex < fullLine.length; charIndex++) {
        currentText += fullLine[charIndex];
        setTerminalLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = prefix + currentText;
          return updated;
        });
        await new Promise((resolve) => setTimeout(resolve, 8)); // Snappy typing
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await new Promise((resolve) => setTimeout(resolve, 180));

    // 3. Output JSON character by character
    const jsonString = JSON.stringify(preset.response, null, 2);
    let currentJsonText = "";
    
    for (let charIndex = 0; charIndex < jsonString.length; charIndex++) {
      currentJsonText += jsonString[charIndex];
      setJsonText(currentJsonText);
      await new Promise((resolve) => setTimeout(resolve, 3)); // Rapid stream JSON
    }

    setJsonOutput(preset.response);
    setIsTyping(false);
  };

  // Run first check automatically on scroll intersection
  useEffect(() => {
    if (inView) {
      triggerTerminalSequence(PRESETS[0]);
    }
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="ai"
      onMouseMove={handleMouseMove}
      className="ai-section-container relative py-28 md:py-36 w-full bg-cyber-black overflow-hidden px-6 md:px-12 border-b border-cyber-border/20 flex flex-col justify-center"
    >
      <style dangerouslySetInnerHTML={{ __html: aiControlCenterStyles }} />

      {/* Repeating noise overlay */}
      <div className="absolute inset-0 noise-bg pointer-events-none z-0" />

      {/* 3D Canvas Background (Interactive Neural Network Visualizer) */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 pointer-events-none opacity-55 select-none">
        {canvasInView && !isMobile && (
          <Canvas camera={{ position: [0, 0, 5.2], fov: 60 }} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.25} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#00E5FF" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#FFD600" />
            <spotLight position={[0, 5, 5]} intensity={1.8} color="#FFD600" penumbra={1} angle={Math.PI / 4} />
            <NeuralNetwork3D mouse={mousePos} />
          </Canvas>
        )}
      </div>

      {/* Soft vertical futuristic grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-15 z-0 cyber-grid-vertical" />

      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full glow-yellow-radial pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full glow-yellow-radial pointer-events-none z-0" />

      {/* Holographic energy wave overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-[#FFD600]/4 to-[#00E5FF]/4 rounded-full blur-3xl opacity-60 pointer-events-none animate-energy-wave -z-10" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header with Title Spotlight follow */}
        <div 
          ref={headerRef}
          onMouseMove={handleHeaderMouseMove}
          className="relative flex flex-col text-left mb-20 md:mb-24 p-6 rounded-2xl overflow-hidden group select-none"
        >
          {/* Spotlight overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: headerGlow }}
          />

          {/* Giant backdrop watermark */}
          <div className="absolute -left-4 -top-8 font-display font-black text-8xl md:text-12xl text-white/[0.015] uppercase tracking-widest select-none pointer-events-none">
            NEURAL
          </div>

          {/* Floating holographic circles near title */}
          <div className="absolute right-1/12 top-4 w-24 h-24 rounded-full border border-[#00E5FF]/20 flex items-center justify-center pointer-events-none select-none animate-float-slow hidden md:flex">
            <div className="w-20 h-20 rounded-full border border-dashed border-[#FFD600]/30 animate-spin-slow" />
            <div className="absolute w-2 h-2 bg-[#FFD600] rounded-full top-0 shadow-[0_0_8px_#FFD600]" />
          </div>
          <div className="absolute right-1/3 -top-12 w-16 h-16 rounded-full border border-[#FFD600]/10 flex items-center justify-center pointer-events-none select-none animate-float-medium hidden md:flex">
            <div className="w-12 h-12 rounded-full border border-dotted border-[#00E5FF]/30 animate-spin-reverse" />
          </div>

          <div className="flex items-center gap-4 mb-4 relative z-10">
            <span className="font-mono text-xs text-[#FFD600] font-bold tracking-[0.25em] uppercase animate-pulse">
              NEURAL ENGINE // 05
            </span>
            <div className="ai-header-line w-16 h-[1px] bg-[#FFD600] origin-left" />
          </div>

          <div className="relative w-fit z-10">
            <h2 className="ai-title font-display font-black text-4xl md:text-6xl tracking-tight text-white uppercase select-none leading-none animate-text-flicker">
              <span className="text-sweep-glow">AI & GENAI INTEGRATIONS</span>
            </h2>

            {/* Orbiting HUD ring target indicator */}
            <div className="absolute -right-10 bottom-0 w-8 h-8 rounded-full border border-blue-500/50 flex items-center justify-center pointer-events-none select-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FFD600] shadow-[0_0_6px_#FFD600]" />
              </motion.div>
            </div>
          </div>
          
          <div className="h-0.5 bg-gradient-to-r from-[#FFD600] via-[#00E5FF] to-transparent mt-5 shadow-[0_0_10px_#FFD600] animate-underline-sweep" />
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* LEFT SIDE: Project detail & features (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            <div className="flex items-center gap-3 text-[#FFD600] pl-1">
              <Brain className="w-6 h-6 animate-pulse" />
              <span className="font-mono text-xs tracking-[0.2em] font-semibold uppercase">COGNITIVE_PROJECTS</span>
            </div>

            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-2 pl-1 select-text">
              Unlike wrapper utilities, I engineer native integrations that couple Generative AI directly into web infrastructures. This involves defining strict validation parameters, caching vector embeddings to reduce latency, and writing autonomous logic loops.
            </p>

            {/* Futuristic AI Project Card with absolute floating telemetry widgets */}
            <div className="relative">
              <AICard />

              {/* Floating Widget 1: Telemetry cache */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-4 md:-right-8 p-3 rounded-xl border border-[#00E5FF]/20 bg-[#0a0a0c]/85 backdrop-blur-md flex items-center gap-2.5 shadow-[0_8px_20px_rgba(0,229,255,0.15)] z-20 pointer-events-none"
              >
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">SEMANTIC CACHE</span>
                  <span className="font-mono text-[10px] text-[#00E5FF] font-bold">94.2% HIT // 14ms</span>
                </div>
              </motion.div>

              {/* Floating Widget 2: Latency Index */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute -bottom-6 -left-4 md:-left-8 p-3 rounded-xl border border-[#FFD600]/20 bg-[#0a0a0c]/85 backdrop-blur-md flex items-center gap-2.5 shadow-[0_8px_20px_rgba(255,214,0,0.15)] z-20 pointer-events-none"
              >
                <Activity className="w-3.5 h-3.5 text-[#FFD600] animate-pulse" />
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">VECTOR DIMENSIONS</span>
                  <span className="font-mono text-[10px] text-[#FFD600] font-bold">1536d // PINECONE</span>
                </div>
              </motion.div>

              {/* Floating Widget 3: Router status */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                className="absolute top-1/2 -left-12 md:-left-16 p-3 rounded-xl border border-[#00E5FF]/20 bg-[#0a0a0c]/85 backdrop-blur-md flex items-center gap-2.5 shadow-[0_8px_20px_rgba(0,229,255,0.1)] z-20 pointer-events-none hidden md:flex"
              >
                <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">ROUTER STATUS</span>
                  <span className="font-mono text-[10px] text-[#00E5FF] font-bold">ROUTE // ACTIVE</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE: Diagnostic Terminal (7 cols) */}
          <div className="lg:col-span-7 w-full relative group">
            
            {/* Background screen glow reflection */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FFD600]/5 to-[#00E5FF]/5 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 animate-pulse-slow" />

            {/* Floating holographic particles around terminal */}
            <div className="absolute -top-4 -left-4 w-2 h-2 bg-[#FFD600] rounded-full blur-[1px] animate-float-slow pointer-events-none hidden md:block" />
            <div className="absolute top-1/4 -right-3 w-1.5 h-1.5 bg-[#00E5FF] rounded-full blur-[1px] animate-float-medium pointer-events-none hidden md:block" />
            <div className="absolute bottom-1/3 -left-3 w-2 h-2 bg-[#00E5FF] rounded-full blur-[1px] animate-float-slow pointer-events-none hidden md:block" />
            <div className="absolute -bottom-4 right-1/4 w-2.5 h-2.5 bg-[#FFD600] rounded-full blur-[1px] animate-float-medium pointer-events-none hidden md:block" />

            <div className="relative bg-[#07070a]/90 border border-white/10 rounded-2xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
              
              {/* Scanline CRT overlay */}
              <div className="absolute inset-0 hud-scanline pointer-events-none opacity-[0.06]" />

              {/* Glowing terminal laser border */}
              <div className="absolute inset-0 border border-[#FFD600]/10 rounded-2xl group-hover:border-[#FFD600]/25 transition-colors duration-500 pointer-events-none" />

              {/* Laser trace */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD600] to-transparent animate-trace-top-ai" />
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#FFD600] to-transparent animate-trace-right-ai" />
              </div>

              {/* Terminal Header */}
              <div className="bg-[#0b0b0f] border-b border-white/10 px-6 py-4 flex justify-between items-center text-xs font-mono select-none">
                <div className="flex items-center gap-2.5 text-[#FFD600] tracking-wider">
                  <Terminal className="w-4 h-4" />
                  <span>FARHAN_COGNITIVE_TERMINAL_v1.3.0</span>
                </div>
                {/* Simulated window actions */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/25 border border-red-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/25 border border-[#FFD600]/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/25 border border-green-500/50" />
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-8 font-mono text-xs text-left h-96 overflow-y-auto flex flex-col justify-between gap-6 relative select-text">
                {/* Dynamic scan line anim */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD600]/25 to-transparent pointer-events-none z-20 animate-scanline-ai" />

                {/* Console Log Area */}
                <div className="flex-grow flex flex-col gap-3.5 overflow-y-auto pr-2 select-text">
                  <div className="text-white/60">
                    <span className="text-[#FFD600]">&gt;</span> SYSTEM CORE CONNECTED ON IP 127.0.0.1
                    <br />
                    <span className="text-[#FFD600]">&gt;</span> READY TO ENGAGE COGNITIVE DIAGNOSTIC. CHOOSE COMMAND:
                  </div>

                  {terminalLines.map((line, idx) => (
                    <div key={idx} className="text-white/80 select-text">
                      {line}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-2 text-[#FFD600]/80">
                      <span className="text-[#FFD600] font-bold animate-pulse">&gt;</span>
                      <span className="animate-pulse">EXECUTING RUNTIME AGENT SEQUENCE...</span>
                    </div>
                  )}

                  {/* Rendering Typed JSON text */}
                  {jsonText && (
                    <div className="p-5 bg-[#FFD600]/5 border border-[#FFD600]/15 rounded-xl relative overflow-hidden select-text">
                      {/* Soft JSON glowing pulse */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
                        </span>
                        <span className="text-[9px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                          {isTyping ? "COMPILING..." : "STABLE"}
                        </span>
                      </div>

                      {/* Display character streaming or highlighted JSON */}
                      {jsonOutput && !isTyping ? (
                        <JSONHighlighter text={jsonStringify(jsonOutput)} />
                      ) : (
                        <pre className="whitespace-pre-wrap font-mono text-[10px] md:text-[11px] leading-relaxed text-[#FFD600]/80 select-text">
                          {jsonText}
                          <span className="inline-block w-1.5 h-3 bg-[#FFD600] ml-0.5 animate-pulse" />
                        </pre>
                      )}
                    </div>
                  )}
                </div>

                {/* Stimulus buttons selection */}
                <div className="border-t border-white/10 pt-5 flex flex-col gap-3 select-none">
                  <div className="text-[9px] text-white/40 tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#FFD600]/60" />
                    <span>SELECT COGNITIVE PIPELINE COMMAND:</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.cmd}
                        onClick={() => triggerTerminalSequence(preset)}
                        disabled={isTyping}
                        className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg font-mono text-[10px] tracking-wider transition-all duration-300 ${
                          activePreset === preset.cmd
                            ? "bg-[#FFD600] text-cyber-black border-[#FFD600] font-extrabold shadow-[0_0_12px_rgba(255,214,0,0.3)]"
                            : "bg-[#050507] border-white/10 text-white/50 hover:text-white hover:border-[#FFD600]/40"
                        } disabled:opacity-50`}
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Helper to stringify JSON consistently
function jsonStringify(obj) {
  return JSON.stringify(obj, null, 2);
}
