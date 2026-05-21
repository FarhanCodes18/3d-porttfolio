import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useInView } from "framer-motion";
import { useDevice } from "../hooks/useDevice";
import * as THREE from "three";

// 3D Scene controller that coordinates mouse follow and scroll adjustments
function CyberScene({ scrollProgress }) {
  const groupRef = useRef();
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const particlesRef = useRef();

  // Mouse state
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse between -1 and 1
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Set up particles procedurally
  const particleCount = 120;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 15; // X
      arr[i + 1] = (Math.random() - 0.5) * 15; // Y
      arr[i + 2] = (Math.random() - 0.5) * 15; // Z
    }
    return arr;
  }, []);

  // Frame loop for 3D animations (runs at 60/120fps)
  useFrame((state, delta) => {
    // 1. Mouse smoothing interpolation (lerp)
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    // 2. Rotate overall group slightly based on mouse
    if (groupRef.current) {
      groupRef.current.rotation.y = mouse.current.x * 0.4;
      groupRef.current.rotation.x = -mouse.current.y * 0.3;
      
      // Scroll-based rotation & slide down
      groupRef.current.position.y = -scrollProgress * 3;
      groupRef.current.rotation.z = scrollProgress * 1.5;
    }

    // 3. Rotate core and rings
    const time = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
      coreRef.current.rotation.x += 0.002;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.15;
      ring1Ref.current.rotation.y = time * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.25;
      ring2Ref.current.rotation.z = time * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -time * 0.1;
      ring3Ref.current.rotation.z = -time * 0.3;
    }

    // 4. Animate background particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0008;
      particlesRef.current.rotation.x += 0.0003;
      
      // Slowly float particles up/down
      const pos = particlesRef.current.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += Math.sin(time + i) * 0.0005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Grid Overlay Backdrop Helper (Subtle lines) */}
      <gridHelper args={[20, 20, "#FFD600", "#1a1a1a"]} position={[0, -4, 0]} rotation={[0.2, 0, 0]} opacity={0.15} transparent />

      {/* Central Morphing Mesh */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial
          color="#FFD600"
          roughness={0.1}
          metalness={0.9}
          distort={0.4}
          speed={2}
          bumpScale={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe Core Overlay (adds hologram HUD detail) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.52, 16, 16]} />
        <meshBasicMaterial color="#FFD600" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Orbiting Tech Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.015, 8, 100]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.5} />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.01, 8, 100]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.3} />
      </mesh>
      
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.2, 0.008, 6, 80]} />
        <meshBasicMaterial color="#FFD600" transparent opacity={0.2} />
      </mesh>

      {/* Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FFD600"
          size={0.025}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient and point lights in the scene */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD600" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
      <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#FFD600" />
    </group>
  );
}

export default function HeroCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { margin: "250px" });
  const { isMobile } = useDevice();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? scrolled / height : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 select-none pointer-events-none">
      {inView && !isMobile && (
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          style={{ pointerEvents: "auto" }}
        >
          <CyberScene scrollProgress={scrollProgress} />
        </Canvas>
      )}
    </div>
  );
}
