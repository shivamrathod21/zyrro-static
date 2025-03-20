import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon } from "@/lib/icons";

// More testimonials with subscriber counts and avatars
const testimonials = [
  {
    quote: "The quality of editing is high!",
    author: "RazorFishGaming",
    role: "1.25M subscribers",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg", 
    rating: 5
  },
  {
    quote: "Best graphics ever! And a great person to work with!",
    author: "DiamondPlays",
    role: "505K subscribers",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5
  },
  {
    quote: "Fast turnaround and meets all deadlines!",
    author: "RFG",
    role: "434K subscribers",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    rating: 5
  },
  {
    quote: "Amazing storytelling and exceptional editing skills!",
    author: "JayWayyGaming",
    role: "334K subscribers",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 5
  },
  {
    quote: "Loved the intro! Looking forward to more collaborations.",
    author: "ClayK",
    role: "97K subscribers",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    rating: 5
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
      scrollToTestimonial((activeIndex + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [activeIndex, autoplay]);

  const scrollToTestimonial = (index: number) => {
    if (!sliderRef.current) return;
    
    const slideWidth = sliderRef.current.scrollWidth / testimonials.length;
    sliderRef.current.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    setIsDragging(true);
    setAutoplay(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setAutoplay(true);
    
    // Find the closest testimonial based on scroll position
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.scrollWidth / testimonials.length;
      const index = Math.round(sliderRef.current.scrollLeft / slideWidth);
      setActiveIndex(index);
      scrollToTestimonial(index);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Drag sensitivity
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="testimonials" className="py-12 md:py-16 bg-black/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Iceland'] tracking-wider">
            Trusted by <span className="text-[#FFD700]">Top Gaming Creators</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm mb-8">
            Delivering high-quality edits for gaming content creators worldwide
          </p>
        </motion.div>

        {/* Horizontal scrollable testimonials */}
        <div 
          className="relative overflow-hidden"
          onMouseLeave={handleMouseUp}
        >
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx}
                className="min-w-[300px] md:min-w-[350px] p-4 snap-start snap-always mr-4 flex-shrink-0"
              >
                <motion.div 
                  className="bg-[#111111] rounded-lg p-6 h-full flex flex-col shadow-lg border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(255, 215, 0, 0.1)' }}
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.author} 
                      className="w-12 h-12 rounded-full border-2 border-[#FFD700] mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-white text-md">{testimonial.author}</h3>
                      <p className="text-gray-400 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="text-[#FFD700] w-4 h-4" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-300 text-sm italic flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  scrollToTestimonial(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-[#FFD700] w-6' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Background decorative element */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full h-40 opacity-10 z-[-1]">
            <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path 
                d="M0,0 C300,80 500,20 1000,80 L1000,100 L0,100 Z" 
                fill="#FFD700"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
