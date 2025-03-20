import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon } from "@/lib/icons";

const testimonials = [
  {
    quote: "Zyro-Visuals took my gaming channel to another level. Their edits are professional, engaging, and perfectly capture the excitement of my gameplay. Fast turnaround too!",
    author: "GamerQueen",
    role: "Minecraft Creator, 1.2M subscribers",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5
  },
  {
    quote: "I've tried many editors before, but none have delivered the quality that Zyro-Visuals consistently provides. My viewers always comment on how well-edited my videos are.",
    author: "FPSMaster",
    role: "FPS Streamer, 850K subscribers",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5
  },
  {
    quote: "The team at Zyro-Visuals understands gaming content. They know exactly how to highlight the most exciting moments and create videos that keep viewers engaged.",
    author: "RPGLegend",
    role: "RPG Content Creator, 1.5M subscribers",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    rating: 5
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Creators <span className="text-[#FFD700]">Say About Us</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="p-6 md:p-8 bg-[#111111] rounded-xl"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/4 flex justify-center">
                  <img 
                    src={testimonials[activeIndex].avatar}
                    alt={testimonials[activeIndex].author} 
                    className="w-24 h-24 rounded-full border-2 border-[#FFD700]"
                  />
                </div>
                <div className="md:w-3/4">
                  <div className="flex mb-4">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <StarIcon key={i} className="text-[#FFD700]" />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 italic text-lg mb-4">
                    "{testimonials[activeIndex].quote}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-white">{testimonials[activeIndex].author}</p>
                    <p className="text-gray-400 text-sm">{testimonials[activeIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-[#FFD700]' : 'bg-gray-600'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#FFD700] text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#FFD700] text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 focus:outline-none"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
