import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showText, setShowText] = useState(false);

  // Fetch hero video content
  const { data: heroVideo } = useQuery({
    queryKey: ["/api/video-content", "hero"],
    queryFn: async () => {
      const videos = await apiRequest({
        url: "/api/video-content",
        method: "GET",
      });
      return videos.find((v: any) => v.section === "hero" && v.active);
    },
  });

  // After video is loaded, show text content with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1200);
    
    if (videoLoaded) {
      const videoTimer = setTimeout(() => {
        setShowText(true);
      }, 400);
      return () => {
        clearTimeout(videoTimer);
        clearTimeout(timer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [videoLoaded]);

  // Hero text animations - staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
          onLoadedData={() => {
            console.log("Video loaded successfully");
            setVideoLoaded(true);
          }}
          poster={heroVideo?.thumbnailUrl}
          style={{ opacity: videoLoaded ? 1 : 0 }}
          onError={(e) => {
            console.error("Video loading error:", e);
            // Attempt to reload video on error
            const target = e.target;
            if (target instanceof HTMLVideoElement) {
              try {
                target.src = target.src; // Reset source to trigger reload
                target.load(); // Attempt to reload
              } catch (error) {
                console.error("Failed to reload video:", error);
              }
            }
          }}
        >
          <source 
            src={heroVideo?.videoUrl || "https://res.cloudinary.com/do8nyydiy/video/upload/samples/dance-2.mp4"}
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Rest of the component remains unchanged */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-[1]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 md:pt-16">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate={showText ? "show" : "hidden"}
          variants={container}
        >
          <motion.div variants={item}>
            <motion.h1 
              className="hero-title mb-6 font-['Iceland'] uppercase tracking-[0.2em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {heroVideo?.title || "I KEEP THEM"} <motion.span 
                className="text-[#FFD700] inline-block"
                animate={{
                  textShadow: ['0 0 0px #FFD700', '0 0 20px #FFD700', '0 0 0px #FFD700'],
                  filter: ['drop-shadow(0 0 0px #FFD700)', 'drop-shadow(0 0 12px #FFD700)', 'drop-shadow(0 0 0px #FFD700)']
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse"
                }}
              >
                HOOKED
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-gray-300"
              variants={item}
            >
              {heroVideo?.description || "You want to hook them too?"}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-5"
              variants={item}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 text-lg font-bold px-8 py-6 shadow-lg shadow-[#FFD700]/20">
                  <a href="#book" className="inline-flex items-center">
                    Book Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" className="border-white hover:bg-white/10 text-lg font-medium px-8 py-6">
                  <a href="#portfolio">View Portfolio</a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated overlay effect */}
      <motion.div 
        className="absolute inset-0 z-[2] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-[#FFD700] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-72 md:h-72 bg-purple-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </motion.div>
    </section>
  );
}
