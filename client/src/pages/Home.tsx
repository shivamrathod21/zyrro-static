import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Portfolio from "@/components/Portfolio";
import Creators from "@/components/Creators";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CursorEffect from "@/components/CursorEffect";
import CustomCursor from "@/components/CustomCursor";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  useEffect(() => {
    // Add class to body to enable custom cursor
    document.body.classList.add('has-custom-cursor');
    
    // Clean up
    return () => {
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Custom cursor and effects */}
      <CustomCursor />
      <CursorEffect />
      
      {/* Fixed elements */}
      <Header />
      
      {/* Dynamic lines effect similar to Prime Entertainment */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute bottom-0 w-full h-32 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1200 120" 
            xmlns="http://www.w3.org/2000/svg" 
            preserveAspectRatio="none"
          >
            <motion.path 
              d="M0,10 Q300,60 600,40 T1200,60 V120 H0 Z" 
              fill="none" 
              stroke="#FFD700" 
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                pathOffset: [0, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 10, 
                ease: "linear" 
              }}
            />
            <motion.path 
              d="M0,40 Q300,20 600,60 T1200,20 V120 H0 Z" 
              fill="none" 
              stroke="#FFD700" 
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                pathOffset: [0, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 15, 
                ease: "linear",
                delay: 1
              }}
            />
          </svg>
        </motion.div>
      </div>
      
      <main>
        <Hero />
        <section id="services">
          <Services />
        </section>
        <section id="whychooseus">
          <WhyChooseUs />
        </section>
        <section id="portfolio">
          <Portfolio />
        </section>
        <section id="creators">
          <Creators />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
      </main>
      <Footer />
    </div>
  );
}
