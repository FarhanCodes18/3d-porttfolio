import React from "react";
import { motion } from "framer-motion";
import { Calendar, Briefcase, Award } from "lucide-react";

const EXPERIENCES = [
  {
    role: "LEAD GENAI DEVELOPER",
    company: "Cognitive Labs // Tech Corp",
    period: "2024 - PRESENT",
    desc: "Spearheaded integration of LLMs into commercial MERN SaaS frameworks. Established custom multi-agent routing engines and structured semantic caching systems which reduced OpenAI/Gemini API billing costs by 42%. Managed a team of 4 full-stack developers.",
    highlights: ["Pinecone RAG Pipelines", "API Orchestration", "Team Leadership"]
  },
  {
    role: "SENIOR FULL STACK ENGINEER",
    company: "Apex Digital Solutions",
    period: "2022 - 2024",
    desc: "Refactored high-traffic server architectures in Node.js, transitioning to clustered stateless systems. Tuned slow MongoDB aggregation queries and established Redis caching, boosting page response speeds by 65% across 40k+ daily active users.",
    highlights: ["Node Clustering", "Database Optimization", "Redis Caching"]
  },
  {
    role: "FRONTEND UI DEVELOPER",
    company: "Vivid Interactive Studios",
    period: "2020 - 2022",
    desc: "Engineered high-fidelity responsive user interfaces and custom HUD dashboards. Created internal design libraries using Tailwind CSS and SVG sprite packs. Implemented GSAP layout transitions and Framer Motion micro-animations.",
    highlights: ["Design System Creation", "SVG Layouts", "GSAP Animations"]
  }
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-24 md:py-32 w-full bg-cyber-black overflow-hidden px-6 md:px-12 border-b border-cyber-border/20"
    >
      {/* Dynamic Grid Background overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 z-0" />
      
      {/* Radial soft glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full glow-yellow-radial pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col text-left mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#FFD600]" />
            <span className="font-mono text-xs tracking-[0.3em] text-[#FFD600] uppercase">
              TEMPORAL CHRONOLOGY // 04
            </span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white uppercase">
            EXPERIENCE TIMELINE
          </h2>
          <div className="w-16 h-1 bg-[#FFD600] mt-3" />
        </div>

        {/* Timeline Path Container */}
        <div className="relative w-full max-w-4xl mx-auto mt-12">
          
          {/* Vertical Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FFD600] via-[#FFD600]/30 to-[#FFD600]/5 -translate-x-1/2" />

          {/* Timeline Cards */}
          <div className="flex flex-col gap-12">
            {EXPERIENCES.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={exp.role} 
                  className={`flex flex-col md:flex-row w-full relative ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  
                  {/* Glowing Node Dot on center timeline */}
                  <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-10">
                    <span className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD600] opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-cyber-black border-2 border-[#FFD600] justify-center items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]" />
                      </span>
                    </span>
                  </div>

                  {/* Empty space placeholder for desktop alignment */}
                  <div className="hidden md:block w-1/2" />

                  {/* Actual Experience Card content */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-[45%] pl-12 md:pl-0"
                  >
                    <div className="glassmorphism p-6 md:p-8 rounded-lg text-left neon-glow-border-hover transition-all duration-300 relative group overflow-hidden">
                      {/* Sub-corner HUD decorations */}
                      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#FFD600]/10 group-hover:border-[#FFD600]/40 transition-colors pointer-events-none" />

                      {/* Period Date Tag */}
                      <div className="flex items-center gap-2 text-xs font-mono text-[#FFD600] mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </div>

                      {/* Title & Organization */}
                      <h3 className="font-display font-bold text-lg md:text-xl text-white tracking-wide uppercase">
                        {exp.role}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono mt-1 mb-4 uppercase">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{exp.company}</span>
                      </div>

                      {/* Main Paragraph Description */}
                      <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed mb-6">
                        {exp.desc}
                      </p>

                      {/* Core Highlights */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-cyber-border/20">
                        {exp.highlights.map((hl) => (
                          <div 
                            key={hl}
                            className="flex items-center gap-1 text-[10px] font-mono text-[#FFD600] bg-[#FFD600]/5 px-2.5 py-1 rounded border border-[#FFD600]/10"
                          >
                            <Award className="w-3 h-3" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
