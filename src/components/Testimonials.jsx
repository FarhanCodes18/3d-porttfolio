import React from "react";
import { motion } from "framer-motion";
import { Quote, MessageSquareCode } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "SARAH CHEN",
    role: "VP of Engineering // Apex Digital",
    quote: "Farhan refactored our legacy cluster pipelines. His MERN stack optimization slashed server-side page delays and saved us thousands in hosting bandwidth. An elite-level full stack engineer.",
    avatar: "SC"
  },
  {
    name: "ALEXANDER ROSS",
    role: "Founder // Cognitive Labs",
    quote: "Integrating Gemini APIs can be tricky, but Farhan designed a modular agent wrapper that manages context budgets seamlessly. His vector store query caches were a game-changer.",
    avatar: "AR"
  },
  {
    name: "ELENA ROSTOVA",
    role: "Product Owner // Vivid Interactive",
    quote: "Farhan possesses an exceptional eye for design fidelity. He translated our design sketches into highly kinetic, responsive animations with sub-millisecond lag. Highly recommended.",
    avatar: "ER"
  }
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-32 w-full bg-[#050507] overflow-hidden px-6 md:px-12 border-b border-cyber-border/20"
    >
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full glow-yellow-radial pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col text-left mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#FFD600]" />
            <span className="font-mono text-xs tracking-[0.3em] text-[#FFD600] uppercase">
              REVIEWS TELEMETRY // 06
            </span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white uppercase">
            CLIENT TESTIMONIALS
          </h2>
          <div className="w-16 h-1 bg-[#FFD600] mt-3" />
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              key={test.name}
              className="glassmorphism-luxury p-8 rounded-lg text-left flex flex-col justify-between relative group hover:border-[#FFD600]/60 transition-colors"
            >
              {/* Corner brackets details */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#FFD600]/10 group-hover:border-[#FFD600]/40 transition-colors pointer-events-none" />

              <div>
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-6">
                  <span className="w-10 h-10 rounded bg-[#FFD600]/5 border border-[#FFD600]/10 flex items-center justify-center text-[#FFD600]">
                    <Quote className="w-5 h-5" />
                  </span>
                  <MessageSquareCode className="w-5 h-5 text-gray-500" />
                </div>

                {/* Quote Body */}
                <p className="text-gray-400 text-sm font-light leading-relaxed italic mb-8">
                  "{test.quote}"
                </p>
              </div>

              {/* Client Profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-cyber-border/20">
                <div className="w-10 h-10 rounded-full bg-cyber-black border border-[#FFD600]/30 flex items-center justify-center font-mono font-bold text-xs text-[#FFD600] shadow-[0_0_8px_rgba(255,214,0,0.1)]">
                  {test.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm text-white tracking-wider">
                    {test.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#FFD600] tracking-widest uppercase">
                    {test.role}
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
