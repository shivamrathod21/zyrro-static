import { motion, useAnimationControls, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/AyeYahZeeLogo.jpg",
    client: "AyeYahzee",
    comment: "Just checked it out, bro! It's absolutely perfect!"
  },
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/kikilogo.jpg",
    client: "kiki",
    comment: "Bro...that edit is incredible! Seriously, it's amazing working with you!"
  },
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/JustmaikoGaminglogo.jpg",
    client: "Justmaikogaming",
    comment: "Great work, Zyro! The multi-cam transitions were handled smoothly, and the comedy timing was spot on. The video was super fun to watch! Keep up the amazing edits."
  },
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/Raylashonlogo.jpg",
    client: "Raylashon",
    comment: "Best Agency I've ever worked with! Great quality, fast delivery, excellent communication. Gets better and better each video. Always has new and improved ideas! Highly recommended 10/10!"
  },
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/ValekisLogo.jpg",
    client: "Valekis",
    comment: "Dope Edits of all time working with them from so long and never disappointed with the quality always new and unexpected quality very hardworking team really suggest to work with them. Founder is doing Great Job."
  },
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/officialalliebloxlogo.jpg",
    client: "offcialalliebox",
    comment: "Second time that I asked Zyro visual to help me edit a video, and he did not disappoint. His edits are top tier, and I was amazed when I first saw the video. I would definitely work with him again!"
  },
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/ZariandZeelogo.jpg",
    client: "zariandzee",
    comment: "Big fan of Zyro Visual's work! You guys are seriously talented."
  },
  {
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/AshleyBunnilogo.jpg",
    client: "Ashleybunni",
    comment: "Zyro Visual is seriously killing it! The creativity and flow in the edits are unmatched. You guys make it look effortless, but it's clear how much talent and hard work goes into it."
  }
];

export default function Testimonials() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftScrollX = useMotionValue(0);
  const rightScrollX = useMotionValue(0);
  const leftControls = useAnimationControls();
  const rightControls = useAnimationControls();
  const baseSpeed = 20;
  const slowSpeed = 60;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth / 2;
      const currentSpeed = isHovered ? slowSpeed : baseSpeed;

      // Left-to-right animation
      leftControls.start({
        x: [0, containerWidth],
        transition: {
          duration: currentSpeed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0
        }
      });

      // Right-to-left animation
      rightControls.start({
        x: [-containerWidth, 0],
        transition: {
          duration: currentSpeed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0
        }
      });
    }
  }, [leftControls, rightControls, isHovered, baseSpeed, slowSpeed]);

  return (
    <section 
      id="testimonials" 
      className="py-16 md:py-24 bg-black/50 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Iceland'] tracking-wider">
            What Our <span className="text-[#FFD700]">Clients Say</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Delivering exceptional results for content creators worldwide
          </p>
        </motion.div>

        <div className="relative overflow-hidden h-[400px]" ref={containerRef}>
          {/* Left-to-right scroll container */}
          <motion.div 
            className="flex gap-6 absolute left-0 right-0"
            style={{ x: leftScrollX }}
            animate={leftControls}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`left-${index}`}
                className="bg-[#111111] rounded-lg p-6 shadow-lg border border-gray-800 min-w-[300px] md:min-w-[400px]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  damping: 15
                }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFD700] mr-4">
                    <img 
                      src={testimonial.logo}
                      alt={`${testimonial.client}'s logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white text-lg">{testimonial.client}</h3>
                </div>
                <blockquote className="text-gray-300 text-sm italic">
                  "{testimonial.comment}"
                </blockquote>
              </motion.div>
            ))}
          </motion.div>

          {/* Right-to-left scroll container */}
          <motion.div 
            className="flex gap-6 absolute left-0 right-0 top-[200px]"
            style={{ x: rightScrollX }}
            animate={rightControls}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`right-${index}`}
                className="bg-[#111111] rounded-lg p-6 shadow-lg border border-gray-800 min-w-[300px] md:min-w-[400px]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  damping: 15
                }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFD700] mr-4">
                    <img 
                      src={testimonial.logo}
                      alt={`${testimonial.client}'s logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white text-lg">{testimonial.client}</h3>
                </div>
                <blockquote className="text-gray-300 text-sm italic">
                  "{testimonial.comment}"
                </blockquote>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
