import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            I keep them <span className="text-[#FFD700]">hooked</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            You want to hook them too?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">
              <a href="#book" className="inline-flex items-center">
                Book Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white hover:bg-white/10">
              <a href="#portfolio">View Portfolio</a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Background Animation Elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
