import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Set up motion values for raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Set up spring animations for the outer ring (creates smooth lag/follow effect)
  const springConfig = { damping: 30, stiffness: 350, mass: 0.6 };
  const outerX = useSpring(mouseX, springConfig);
  const outerY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    if (isTouchDevice) return;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Hover state toggles
    const handleMouseOver = (e) => {
      // Find if cursor is over clickable elements
      const target = e.target;
      const isClickable = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.tagName === "SELECT" || 
        target.closest("button") || 
        target.closest("a") || 
        target.closest(".clickable") || 
        target.getAttribute("role") === "button";
      
      setIsHovered(!!isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-99999 mix-blend-screen">
      {/* Inner Solid Core Dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-[#FFD600] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />

      {/* Outer Spring Glow Halo */}
      <motion.div
        className="absolute rounded-full border border-[#FFD600] -translate-x-1/2 -translate-y-1/2 bg-[#FFD600]/5 flex items-center justify-center"
        style={{
          x: outerX,
          y: outerY,
          width: isHovered ? 56 : 24,
          height: isHovered ? 56 : 24,
          boxShadow: isHovered 
            ? "0 0 20px rgba(255, 214, 0, 0.4), inset 0 0 10px rgba(255, 214, 0, 0.2)"
            : "0 0 8px rgba(255, 214, 0, 0.1)",
          borderColor: isHovered ? "rgba(255, 214, 0, 0.8)" : "rgba(255, 214, 0, 0.4)",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 250,
        }}
      />
    </div>
  );
}
