import React, { useState } from "react";
import { ReactLenis } from "lenis/react";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Stats from "./components/Stats";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import AIGenAI from "./components/AIGenAI";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ReactLenis root>
      <div className="bg-cyber-black text-gray-200 min-h-screen relative select-none font-sans overflow-x-hidden">
        {/* Futuristic booting loading screen */}
        <LoadingScreen onComplete={() => setIsLoading(false)} />

        {!isLoading && (
          <div className="flex flex-col w-full relative">
            {/* Custom Glowing Cursor Follower */}
            <CustomCursor />

            {/* Sticky HUD Navbar */}
            <Navbar />

            {/* Modular Panels Container */}
            <main className="w-full flex flex-col">
              <Hero />
              <About />
              <Stats />
              <Skills />
              <Projects />
              <Experience />
              <AIGenAI />
              <Testimonials />
              <Contact />
            </main>

            {/* System Status Footer */}
            <Footer />
          </div>
        )}
      </div>
    </ReactLenis>
  );
}

export default App;
