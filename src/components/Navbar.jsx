import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "AI", href: "#ai" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const lenis = useLenis();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Monitor scroll for header background opacity increase
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -40% 0px", // Focus middle of viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle smooth scroll when clicking links
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(href, { duration: 1.2 });
    } else {
      const targetEl = document.querySelector(href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#FFD600] origin-left z-55 shadow-[0_0_8px_#FFD600]"
        style={{ scaleX }}
      />

      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? "bg-cyber-black/80 backdrop-blur-md border-[#FFD600]/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, "#home")}
            className="font-display text-xl font-bold tracking-wider text-white hover:text-[#FFD600] transition-colors relative flex items-center gap-1 group"
          >
            <span>FARHAN</span>
            <span className="text-[#FFD600] group-hover:animate-ping">.</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-display tracking-widest uppercase transition-colors relative py-1 ${
                    isActive ? "text-[#FFD600]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  
                  {/* Neon underline slider */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FFD600] shadow-[0_0_8px_#FFD600]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Available Status Indicators */}
          <div className="hidden lg:flex items-center gap-3 bg-cyber-gray/60 px-3 py-1.5 rounded-full border border-cyber-border/40 font-mono text-[10px] tracking-widest text-[#FFD600]/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>AVAILABLE FOR WORK</span>
          </div>

          {/* Mobile Hamburguer */}
          <div className="flex md:hidden items-center gap-4">
            {/* Pulsing Status Dot for Mobile Nav */}
            <span className="relative flex h-2 w-2 lg:hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#FFD600]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            className="fixed inset-y-0 right-0 z-45 w-full max-w-xs bg-cyber-black border-l border-cyber-border shadow-[0_0_50px_rgba(0,0,0,0.9)] p-8 flex flex-col justify-between cyber-grid pt-24"
          >
            {/* Mobile Scanline Overlay */}
            <div className="absolute inset-0 hud-scanline pointer-events-none opacity-40" />

            <div className="flex flex-col gap-6">
              <div className="text-xxs tracking-[0.2em] font-mono text-gray-500 border-b border-cyber-border/40 pb-2">
                NAVIGATION CORE
              </div>
              <nav className="flex flex-col gap-5">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <motion.a
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`text-lg font-display tracking-widest uppercase flex items-center justify-between group ${
                        isActive ? "text-[#FFD600]" : "text-gray-400"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[#FFD600] font-mono">
                        // 0{index + 1}
                      </span>
                    </motion.a>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col gap-4 border-t border-cyber-border/40 pt-6">
              <div className="flex items-center gap-3 font-mono text-[9px] tracking-widest text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>STATUS: STABLE & RECRUITING</span>
              </div>
              <div className="text-xxs text-gray-500 font-mono tracking-wider">
                PORTFOLIO v1.0.0<br />
                BUILT BY FARHAN
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
