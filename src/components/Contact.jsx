import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, ShieldCheck } from "lucide-react";

const GithubIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1800);
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 w-full bg-cyber-gray overflow-hidden px-6 md:px-12 border-b border-cyber-border/20"
    >
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full glow-yellow-radial pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col text-left mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#FFD600]" />
            <span className="font-mono text-xs tracking-[0.3em] text-[#FFD600] uppercase">
              SECURE COMMS // 07
            </span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white uppercase">
            GET IN TOUCH
          </h2>
          <div className="w-16 h-1 bg-[#FFD600] mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Left Column: Comms details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <h3 className="font-display font-bold text-xl text-white tracking-wide uppercase mb-4">
                Transmission channels
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                Have an architecture that needs optimization, a multi-agent AI pipeline waiting to be built, or a modern digital design to launch? Broadcast your mission details.
              </p>
            </div>

            {/* Geo and Email Cards */}
            <div className="flex flex-col gap-4">
              <div className="glassmorphism p-5 rounded flex items-center gap-4 hover:border-[#FFD600]/30 transition-colors">
                <span className="w-10 h-10 rounded bg-[#FFD600]/5 border border-[#FFD600]/20 flex items-center justify-center text-[#FFD600]">
                  <Mail className="w-5 h-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-gray-500 tracking-wider">EMAIL CHANNEL</span>
                  <a href="mailto:farhan@example.com" className="text-sm font-semibold text-white hover:text-[#FFD600] transition-colors">
                    farhan.dev@example.com
                  </a>
                </div>
              </div>

              <div className="glassmorphism p-5 rounded flex items-center gap-4 hover:border-[#FFD600]/30 transition-colors">
                <span className="w-10 h-10 rounded bg-[#FFD600]/5 border border-[#FFD600]/20 flex items-center justify-center text-[#FFD600]">
                  <MapPin className="w-5 h-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-gray-500 tracking-wider">LOC_COORDINATES</span>
                  <span className="text-sm font-semibold text-white">
                    Bangalore, India // Virtual
                  </span>
                </div>
              </div>
            </div>

            {/* Socials Connection */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono text-gray-500 tracking-wider">SOCIAL_NETWORKS</span>
              <div className="flex gap-3">
                {[
                  { icon: GithubIcon, href: "https://github.com", name: "GitHub" },
                  { icon: LinkedinIcon, href: "https://linkedin.com", name: "LinkedIn" },
                  { icon: TwitterIcon, href: "https://twitter.com", name: "Twitter" }
                ].map((soc) => {
                  const Icon = soc.icon;
                  return (
                    <a
                      key={soc.name}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded bg-cyber-black hover:bg-[#FFD600] border border-cyber-border/40 hover:border-[#FFD600] text-gray-400 hover:text-cyber-black flex items-center justify-center transition-all duration-300 shadow-lg"
                      title={soc.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Secure Transmission Seal */}
            <div className="flex items-center gap-2.5 text-[#FFD600]/70 font-mono text-[9px] tracking-widest mt-4">
              <ShieldCheck className="w-4 h-4 text-green-400 animate-pulse" />
              <span>AES-256 COMMS LINK STABLE & SSL SECURED</span>
            </div>
          </div>

          {/* Right Column: Cyber Form Console (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <div className="glassmorphism-luxury p-8 rounded-lg border-[#FFD600]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#FFD600]/15 group-hover:border-[#FFD600]/50 transition-colors pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Name field */}
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="name" className="font-mono text-[10px] tracking-widest text-[#FFD600] uppercase">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="ENTER FULLNAME"
                    className="w-full bg-cyber-black border border-cyber-border/40 hover:border-cyber-border/80 focus:border-[#FFD600] rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="email" className="font-mono text-[10px] tracking-widest text-[#FFD600] uppercase">
                    Return Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="ENTER EMAIL ADDRESS"
                    className="w-full bg-cyber-black border border-cyber-border/40 hover:border-cyber-border/80 focus:border-[#FFD600] rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Message field */}
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="message" className="font-mono text-[10px] tracking-widest text-[#FFD600] uppercase">
                    Transmission Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    placeholder="DESCRIBE PROJECT PROTOCOLS AND DEADLINES..."
                    className="w-full bg-cyber-black border border-cyber-border/40 hover:border-cyber-border/80 focus:border-[#FFD600] rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors font-mono resize-none"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded bg-[#FFD600] text-cyber-black font-display font-bold text-xs tracking-widest uppercase hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,214,0,0.4)] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-cyber-black border-t-transparent animate-spin" />
                      <span>BROADCASTING TRANSMISSION...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>BROADCAST TRANSMISSION</span>
                    </>
                  )}
                </button>

                {/* Success prompt indicator */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 font-mono text-center text-xs"
                  >
                    TRANSMISSION SUCCESS: MESSAGE WRITTEN TO DATABANK // OK
                  </motion.div>
                )}

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
